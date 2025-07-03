#version 300 es
// Фрагментный шейдер для симуляции физики частиц
// Обновляет позицию и скорость одной частицы.

precision highp float;

// Выходы для Multiple Render Targets (MRT)
// location = 0: новая позиция частицы (xyz)
// location = 1: новая скорость частицы (xyz)
layout(location = 0) out vec4 out_Position; 
layout(location = 1) out vec4 out_Velocity; 

// Входные текстуры:
// u_particleStateTex (location 0): текущие позиции всех частиц
// u_particleStateTex (location 1): текущие скорости всех частиц
uniform sampler2D u_particleStateTex; 
uniform sampler2D u_plateStateTex;    // Текстура состояния FDM (r: текущее смещение)

// Физические параметры частиц:
uniform float u_deltaTime;            // Масштабированный шаг времени (из CPU)
uniform float u_particleForceMultiplier; // Множитель силы, притягивающей частицы к узлам
uniform float u_maxParticleSpeed;     // Максимальная скорость частицы
uniform float u_plateRadius;          // Радиус пластины (для столкновений с границей)
uniform float u_particleRestitution;  // Коэффициент упругости столкновения с границей

// Параметры сетки FDM (для преобразования координат):
uniform float u_currentGridSizeFDM;   // Размер сетки FDM (как float, например 121.0)
uniform float u_fdmPlateWidth;        // Физическая ширина пластины FDM (2 * PLATE_RADIUS)
uniform float u_fdm_dx;               // Пространственный шаг FDM

// Параметры отталкивания частиц:
uniform bool u_enableRepulsion;       // Флаг включения отталкивания
uniform float u_repulsionRadius;      // Радиус действия силы отталкивания (в физических единицах)
uniform float u_repulsionStrength;    // Сила отталкивания
uniform float u_particleTextureSideLength; // Длина стороны квадратной текстуры частиц (e.g., ceil(sqrt(MAX_PARTICLE_COUNT)))

// Адаптированное демпфирование для частиц (из CPU)
uniform float u_adaptedParticleDamping;

in vec2 vUv; // UV-координаты фрагмента (соответствуют индексу частицы в текстуре)

// Вспомогательная функция для получения смещения из текстуры FDM
float getDisplacement(sampler2D fdmTex, vec2 uv) {
    // Клампируем UV для избежания выборки вне текстуры
    uv = clamp(uv, 0.0, 1.0);
    return texture(fdmTex, uv).r;
}

// Вспомогательная функция для получения градиента из текстуры FDM
vec2 getGradient(sampler2D fdmTex, vec2 uv, float dx_fdm) {
    float u_center = getDisplacement(fdmTex, uv);
    // Для градиента берем смещения от соседних ячеек в тексельном пространстве FDM
    // (1.0 / u_currentGridSizeFDM) - это размер одного текселя в UV пространстве FDM текстуры
    float u_plusX = getDisplacement(fdmTex, uv + vec2(1.0/u_currentGridSizeFDM, 0.0));
    float u_minusX = getDisplacement(fdmTex, uv - vec2(1.0/u_currentGridSizeFDM, 0.0));
    float u_plusY = getDisplacement(fdmTex, uv + vec2(0.0, 1.0/u_currentGridSizeFDM));
    float u_minusY = getDisplacement(fdmTex, uv - vec2(0.0, 1.0/u_currentGridSizeFDM));

    // Вычисление центральной разности
    float gradX = (u_plusX - u_minusX) / (2.0 * dx_fdm);
    float gradY = (u_plusY - u_minusY) / (2.0 * dx_fdm);
    return vec2(gradX, gradY);
}

void main() {
    // Чтение текущей позиции и скорости из входных текстур (MRT attachments)
    vec3 pos = texture(u_particleStateTex, vUv, 0).xyz; // location 0
    vec3 vel = texture(u_particleStateTex, vUv, 1).xyz; // location 1

    // Преобразование XZ-координат частицы в UV-координаты для выборки из FDM-текстуры
    vec2 fdm_uv = (pos.xz / u_fdmPlateWidth) + 0.5;

    // Получение смещения пластины в точке расположения частицы
    float disp = getDisplacement(u_plateStateTex, fdm_uv);

    // Получение градиента смещения пластины (сила, притягивающая частицы к узлам)
    vec2 grad = getGradient(u_plateStateTex, fdm_uv, u_fdm_dx);
    vec2 force_plate = -2.0 * disp * grad * u_particleForceMultiplier; // Сила действует в плоскости XZ

    // *** Отталкивание частиц (улучшенная, но все ещё компромиссная реализация) ***
    // Этот подход проверяет фиксированное количество текселей, "соседних" в памяти текстуры,
    // что не гарантирует, что эти тексели соответствуют физически ближайшим частицам.
    vec2 force_repulsion = vec2(0.0);
    if (u_enableRepulsion) {
        // Определение шага в UV-пространстве, соответствующего одному текселю
        vec2 uv_texel_step = 1.0 / u_particleTextureSideLength;

        // Набор фиксированных относительных UV-смещений для "соседей" в текстурном пространстве.
        // Это позволяет "заглянуть" в 8 ближайших текселей (по горизонтали, вертикали и диагонали).
        // Добавление небольшого случайного смещения может помочь избежать артефактов при строго регулярных узорах,
        // но здесь используется детерминированный набор для стабильности.
        vec2 offsets[8] = vec2[](
            vec2(uv_texel_step.x, 0.0),            // Right
            vec2(-uv_texel_step.x, 0.0),           // Left
            vec2(0.0, uv_texel_step.y),            // Up
            vec2(0.0, -uv_texel_step.y),           // Down
            vec2(uv_texel_step.x, uv_texel_step.y),   // Top-Right
            vec2(-uv_texel_step.x, uv_texel_step.y),  // Top-Left
            vec2(uv_texel_step.x, -uv_texel_step.y),  // Bottom-Right
            vec2(-uv_texel_step.x, -uv_texel_step.y)  // Bottom-Left
        );
        
        for (int i = 0; i < 8; ++i) { // Итерируем по фиксированным "соседям"
            vec2 sample_uv = vUv + offsets[i];
            
            // Клампируем UV, чтобы не читать вне границ текстуры
            sample_uv = clamp(sample_uv, 0.0, 1.0);

            // Чтение позиции "соседней" частицы из той же входной текстуры
            vec3 otherPos = texture(u_particleStateTex, sample_uv, 0).xyz; // 0.0 for LOD 0

            // Расчет физического расстояния между текущей частицей и "соседом"
            vec2 dxz = pos.xz - otherPos.xz;
            float distSq = dot(dxz, dxz);

            // Если частицы достаточно близки (в физическом пространстве) и не являются одной и той же частицей (или слишком близкими, чтобы избежать деления на ноль)
            if (distSq < u_repulsionRadius * u_repulsionRadius && distSq > 1e-9) {
                float dist_p = sqrt(distSq);
                // Расчет величины отталкивающей силы по обратному квадратичному закону (или схожему)
                // Чем ближе частицы, тем сильнее отталкивание
                float repMag = u_repulsionStrength * pow(u_repulsionRadius - dist_p, 2.0) / (dist_p + 1e-9); 
                force_repulsion += repMag * (dxz / dist_p); // Добавляем силу, нормализованную по направлению
            }
        }
    }

    vec2 total_force_xz = force_plate + force_repulsion;

    // Применение демпфирования
    // Демпфирование зависит от смещения: чем меньше смещение (ближе к узлам), тем сильнее демпфирование
    float effDamp = (abs(disp) < 1e-4) ? 0.99 : u_adaptedParticleDamping;
    vel.x = (vel.x + total_force_xz.x * u_deltaTime) * effDamp;
    vel.z = (vel.z + total_force_xz.y * u_deltaTime) * effDamp; // Z-компонента скорости частицы на пластине

    // Ограничение максимальной скорости
    float speed = length(vel.xz);
    if (speed > u_maxParticleSpeed) {
        vel.xz *= u_maxParticleSpeed / speed;
    }

    // Обновление позиции
    pos.x += vel.x * u_deltaTime;
    pos.z += vel.z * u_deltaTime; // Z-компонента позиции частицы на пластине

    // Обработка столкновений с круговой границей пластины
    float radAfter = length(pos.xz);
    if (radAfter > u_plateRadius) {
        float corrRatio = u_plateRadius / radAfter;
        pos.xz *= corrRatio; // Прижимаем к границе
        
        vec2 normBoundary = normalize(pos.xz); // Нормаль к границе, направленная наружу
        float vDotN = dot(vel.xz, normBoundary);
        if (vDotN > 0.0) { // Только если частица движется наружу
            vel.xz -= (1.0 + u_particleRestitution) * vDotN * normBoundary;
        }
    }
    
    // Y-координата (высота частицы) будет задана в вершинном шейдере для рендеринга.
    // Здесь она не используется для физики в плоскости, поэтому оставляем 0.
    pos.y = 0.0;

    // Запись новой позиции и скорости в выходные текстуры MRT
    out_Position = vec4(pos, 1.0); // xyzw: (x,y_on_plate,z_on_plate, 1)
    out_Velocity = vec4(vel, 1.0); // xyzw: (vx,vy_on_plate,vz_on_plate, 1)
}
