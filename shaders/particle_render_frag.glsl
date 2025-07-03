/*
 * particle_update_frag.glsl
 * Фрагментный шейдер для обновления состояния частиц (позиция и скорость).
 *
 * Назначение:
 * Для каждого "пикселя" (частицы) вычислить его новую позицию и скорость.
 * Это GPU-аналог функции `_updateParticles`.
 * Он использует результат работы FDM-шейдера для расчета сил.
 */

// Расширение для возможности записи в несколько текстур одновременно.
#extension GL_EXT_draw_buffers : require

varying vec2 vUv;

// --- Uniforms ---
uniform sampler2D u_particlePosPrev;  // Текстура с позициями частиц (шаг t)
uniform sampler2D u_particleVelPrev;  // Текстура со скоростями частиц (шаг t)
uniform sampler2D u_plateState;       // Текстура с состоянием FDM-сетки (связь!)

// Параметры симуляции
uniform float u_deltaTime;
uniform float u_forceMultiplier;
uniform float u_dampingBase;
uniform float u_plateRadius;
uniform float u_maxParticleSpeed;
uniform float u_restitution;
uniform float u_gridSize;

// --- Функции-хелперы ---

// Линейная интерполяция для чтения из текстуры FDM
float textureBilinear(sampler2D tex, vec2 uv) {
    vec2 f = fract(uv * u_gridSize);
    vec2 texelSize = 1.0 / u_gridSize;
    
    vec4 v00 = texture2D(tex, uv);
    vec4 v10 = texture2D(tex, uv + vec2(texelSize.x, 0.0));
    vec4 v01 = texture2D(tex, uv + vec2(0.0, texelSize.y));
    vec4 v11 = texture2D(tex, uv + texelSize);

    return mix(mix(v00.r, v10.r, f.x), mix(v01.r, v11.r, f.x), f.y);
}

// Вычисление градиента по центральной разности
vec2 getGradient(sampler2D tex, vec2 uv) {
    vec2 texelSize = 1.0 / u_gridSize;
    float p_ip1 = textureBilinear(tex, uv + vec2(0.0, texelSize.y));
    float p_im1 = textureBilinear(tex, uv - vec2(0.0, texelSize.y));
    float p_jp1 = textureBilinear(tex, uv + vec2(texelSize.x, 0.0));
    float p_jm1 = textureBilinear(tex, uv - vec2(texelSize.x, 0.0));
    
    return vec2((p_jp1 - p_jm1), (p_ip1 - p_im1));
}


void main() {
    // Читаем текущую позицию и скорость частицы из входных текстур
    vec3 pos = texture2D(u_particlePosPrev, vUv).xyz;
    vec3 vel = texture2D(u_particleVelPrev, xyz).xyz;

    // Конвертируем мировые координаты частицы в UV-координаты для FDM-текстуры
    vec2 plateUV = pos.xz / (u_plateRadius * 2.0) + 0.5;

    // Расчет силы (аналогично CPU-версии)
    vec3 force = vec3(0.0);
    if (plateUV.x > 0.0 && plateUV.x < 1.0 && plateUV.y > 0.0 && plateUV.y < 1.0) {
        float displacement = textureBilinear(u_plateState, plateUV);
        vec2 gradient = getGradient(u_plateState, plateUV);
        
        // Сила F = -d * grad(d)
        force.x = -2.0 * displacement * gradient.x * u_forceMultiplier;
        force.z = -2.0 * displacement * gradient.y * u_forceMultiplier;
    }
    
    // Обновление скорости и позиции (интегрирование по Эйлеру)
    vel += force * u_deltaTime;
    vel *= u_dampingBase;

    // Ограничение максимальной скорости
    if (length(vel) > u_maxParticleSpeed) {
        vel = normalize(vel) * u_maxParticleSpeed;
    }
    
    pos += vel * u_deltaTime;

    // Обработка столкновений с границей круглой пластины
    float distFromCenter = length(pos.xz);
    if (distFromCenter > u_plateRadius) {
        // Перемещаем частицу обратно на границу
        pos.xz = normalize(pos.xz) * u_plateRadius;
        
        // Отражаем вектор скорости
        vec2 normal = normalize(pos.xz);
        vec2 vel2D = vel.xz;
        vel.xz = vel2D - (1.0 + u_restitution) * dot(vel2D, normal) * normal;
    }

    // Записываем новые значения в две выходные текстуры
    gl_FragData[0] = vec4(pos, 1.0); // Новая позиция
    gl_FragData[1] = vec4(vel, 1.0); // Новая скорость
}