#version 300 es
// Вершинный шейдер для отрисовки частиц
// Позиционирует частицы в 3D-пространстве и передает данные фрагментному шейдеру.

precision highp float;

in float particleIndex; // Индекс частицы (для выборки из текстуры состояний)

// Входные текстуры:
uniform sampler2D u_particlePositions; // Текстура позиций частиц (выход location 0 из particle_update_frag)
uniform sampler2D u_plateState;        // Текстура состояния FDM (выход из fdm_update_frag)

// Параметры визуализации:
uniform float u_rotationAngle;         // Угол вращения пластины
uniform float u_particleCount;         // Общее количество частиц (для преобразования индекса в UV)
uniform float u_particleTextureSideLength; // Длина стороны квадратной текстуры частиц (e.g., ceil(sqrt(MAX_PARTICLE_COUNT)))
uniform float u_deformScale;           // Масштаб визуального "прыжка"
uniform float u_maxAmplitude;          // Максимальная визуальная амплитуда "прыжка"
uniform float u_plateRadius;           // Радиус пластины (для преобразования координат)
uniform float u_fdmPlateWidth;         // Физическая ширина FDM-пластины (2 * PLATE_RADIUS)
uniform float u_currentGridSizeFDM;    // Размер сетки FDM (как float)
uniform float u_particleSize;          // Базовый размер частицы

out float vDisplacementMagnitude;      // Передача величины смещения во фрагментный шейдер для раскраски

// Вспомогательная функция для получения смещения из текстуры FDM
float getDisplacementFDM(sampler2D fdmTex, vec2 uv) {
    uv = clamp(uv, 0.0, 1.0); // Клампируем UV
    return texture(fdmTex, uv).r; // Смещение в r-канале
}

void main() {
    // Преобразование particleIndex в UV-координаты для выборки из текстуры позиций частиц
    // Используем u_particleTextureSideLength для корректной нормализации
    vec2 uv = vec2(mod(particleIndex, u_particleTextureSideLength) + 0.5, 
                   floor(particleIndex / u_particleTextureSideLength) + 0.5) 
              / u_particleTextureSideLength;

    // Получение сохраненной позиции частицы (XZ - это координаты на плоскости пластины)
    vec4 particleData = texture(u_particlePositions, uv);
    vec3 particlePosXZ = particleData.xyz; // .x = X, .y = 0, .z = Z на плоскости

    // Преобразование XZ-координат частицы в UV-координаты для выборки из FDM-текстуры
    vec2 fdm_uv = (particlePosXZ.xz / u_fdmPlateWidth) + 0.5; 

    // Получение смещения пластины в точке расположения частицы
    float displacement = getDisplacementFDM(u_plateState, fdm_uv);

    // Применение визуальной деформации (высоты "прыжка")
    float visHeight = clamp(displacement * u_deformScale, -u_maxAmplitude, u_maxAmplitude);

    // Применение вращения пластины к горизонтальным координатам частицы
    float rotatedX = particlePosXZ.x * cos(u_rotationAngle) - particlePosXZ.z * sin(u_rotationAngle);
    float rotatedZ = particlePosXZ.x * sin(u_rotationAngle) + particlePosXZ.z * cos(u_rotationAngle);

    // Итоговая 3D-позиция частицы
    vec3 finalPos = vec3(rotatedX, visHeight, rotatedZ);

    // Расчет gl_Position с учетом матриц камеры и проекции
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);

    // Установка размера точки (частицы) в зависимости от расстояния до камеры
    // Используем u_particleSize для базового размера
    // Деление на (dist * factor + offset) делает точки меньше при удалении.
    gl_PointSize = u_particleSize / (length((modelViewMatrix * vec4(finalPos, 1.0)).xyz) * 0.005 + 0.5); 
    gl_PointSize = max(1.0, gl_PointSize); // Минимальный размер точки в 1 пиксель
    gl_PointSize *= 2.0; // Дополнительное увеличение для лучшей видимости

    // Передача абсолютного значения смещения во фрагментный шейдер для раскраски
    vDisplacementMagnitude = abs(displacement);
}
