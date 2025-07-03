#version 300 es
// Фрагментный шейдер для симуляции FDM (метода конечных разностей)
// Вычисляет новое состояние смещения пластины.

precision highp float;

// Входная текстура:
// r - u_current (смещение в момент t)
// g - u_previous (смещение в момент t-1)
uniform sampler2D u_prevState;

// Параметры сетки и времени:
uniform vec2 u_resolution;         // Размер сетки FDM (ширина, высота в текселях)
uniform float u_dx;                // Пространственный шаг сетки (dx = dy)
uniform float u_dt_simulation_step; // Шаг времени для симуляции FDM

// Физические константы пластины:
uniform float u_flexuralRigidity;   // Изгибная жесткость (D)
uniform float u_plateSpecificDensity; // Удельная плотность пластины (rho * h)

// Параметры затухания:
uniform float u_finalDampingFactor; // Коэффициент затухания FDM

// Параметры возбуждения:
uniform int u_excMode;             // Режим возбуждения (0: модальный, 1: точечный)
uniform float u_frequency;         // Частота возбуждения
uniform float u_simulationTime;    // Текущее время симуляции
uniform float u_mParameter;        // Параметр 'm' для модального возбуждения (для cos(m*theta))
uniform float u_plateRadius;       // Радиус пластины (для граничных условий и преобразований координат)

// Параметры амплитуды возбуждения (из CPU)
uniform float u_excBaseAmp;
uniform float u_excLowCutoff;
uniform float u_excHighCutoff;
uniform float u_excMaxFactor;
uniform float u_excMinFactor;

// Текстура с предвычисленным паттерном Бесселя для модального возбуждения
uniform sampler2D u_modalExcitationPattern;

in vec2 vUv;
out vec4 outColor;

const float PI = 3.1415926535897932384626433832795;

// Функция для получения амплитуды возбуждения в зависимости от частоты
float getFrequencyDependentExcitationAmplitude(float freq) {
    float base = u_excBaseAmp;
    if (freq <= 0.0) return base * u_excMaxFactor;
    if (freq < u_excLowCutoff) return base * u_excMaxFactor;
    else if (freq < u_excHighCutoff) {
        float factorRange = u_excMaxFactor - u_excMinFactor;
        float freqRange = u_excHighCutoff - u_excLowCutoff;
        if (freqRange <= 0.0) return base * u_excMaxFactor;
        return base * (u_excMaxFactor - factorRange * ((freq - u_excLowCutoff) / freqRange));
    } else return base * u_excMinFactor;
}

void main() {
    // Размер одного текселя в UV-пространстве
    vec2 invResolution = 1.0 / u_resolution;

    // Выбираем текущее и предыдущее состояния из входной текстуры
    vec4 prevState = texture(u_prevState, vUv);
    float u_current = prevState.r; // u(t)
    float u_previous = prevState.g; // u(t-1)

    // Выборка 13-точечного шаблона для бигармонического оператора
    // Соседи в UV-пространстве
    float u_ip1j = texture(u_prevState, vUv + vec2(0.0, invResolution.y)).r;
    float u_im1j = texture(u_prevState, vUv - vec2(0.0, invResolution.y)).r;
    float u_ijp1 = texture(u_prevState, vUv + vec2(invResolution.x, 0.0)).r;
    float u_ijm1 = texture(u_prevState, vUv - vec2(invResolution.x, 0.0)).r;

    float u_ip1jp1 = texture(u_prevState, vUv + invResolution).r;
    float u_ip1jm1 = texture(u_prevState, vUv + vec2(invResolution.x, -invResolution.y)).r;
    float u_im1jp1 = texture(u_prevState, vUv + vec2(-invResolution.x, invResolution.y)).r;
    float u_im1jm1 = texture(u_prevState, vUv - invResolution).r;

    float u_ip2j = texture(u_prevState, vUv + vec2(0.0, 2.0 * invResolution.y)).r;
    float u_im2j = texture(u_prevState, vUv - vec2(0.0, 2.0 * invResolution.y)).r;
    float u_ijp2 = texture(u_prevState, vUv + vec2(2.0 * invResolution.x, 0.0)).r;
    float u_ijm2 = texture(u_prevState, vUv - vec2(2.0 * invResolution.x, 0.0)).r;

    // Вычисление бигармонического оператора (∇⁴u)
    // Предполагается, что dx = dy
    float inv_dx4 = 1.0 / pow(u_dx, 4.0);
    float biharmonic = (
        20.0 * u_current -
        8.0 * (u_ip1j + u_im1j + u_ijp1 + u_ijm1) +
        2.0 * (u_ip1jp1 + u_ip1jm1 + u_im1jp1 + u_im1jm1) +
        (u_ip2j + u_im2j + u_ijp2 + u_ijm2)
    ) * inv_dx4;

    // Вычисление силы возбуждения
    float excForce = 0.0;
    float timeSine = sin(2.0 * PI * u_frequency * u_simulationTime);
    float currentExcAmp = getFrequencyDependentExcitationAmplitude(u_frequency);

    if (u_excMode == 0) { // Модальное возбуждение (по узору Хладни)
        // Преобразование UV-координат в физические координаты пластины (для угла)
        vec2 pos_norm_plate = (vUv - 0.5) * 2.0; // Нормализованные от -1 до 1
        float theta_phys = atan(pos_norm_plate.y, pos_norm_plate.x);
        
        // Используем предвычисленный паттерн Бесселя (из текстуры) и cos(m*theta)
        float modalPatternValue = texture(u_modalExcitationPattern, vUv).r; 
        excForce = currentExcAmp * timeSine * modalPatternValue * cos(u_mParameter * theta_phys);
    } else { // Точечное возбуждение (в центре)
        vec2 center_uv = vec2(0.5, 0.5);
        float distSq = dot(vUv - center_uv, vUv - center_uv);
        // Эффективный радиус возбуждения в UV-пространстве (например, 2% от размера пластины)
        float effectiveExcRad_UV = 0.02; 
        float pointExcVal = exp(-distSq / (effectiveExcRad_UV * effectiveExcRad_UV * 0.5 + 1e-9));
        excForce = currentExcAmp * timeSine * pointExcVal;
    }

    // Вычисление коэффициентов для уравнения движения пластины
    float K_coeff = (u_dt_simulation_step * u_dt_simulation_step * u_flexuralRigidity) / u_plateSpecificDensity;
    float F_coeff = (u_dt_simulation_step * u_dt_simulation_step) / u_plateSpecificDensity;

    // Вычисление нового смещения u_new
    float u_new = (2.0 * u_current - u_previous) - K_coeff * biharmonic + F_coeff * excForce;

    // Применение затухания
    u_new *= (1.0 - u_finalDampingFactor);

    // Граничные условия: смещение равно 0 вне радиуса пластины
    // Преобразование UV-координат в физические для проверки радиуса
    vec2 physCoords = (vUv - 0.5) * u_plateRadius * 2.0; 
    if (length(physCoords) > u_plateRadius) { 
        u_new = 0.0;
    }

    // Вывод: новое смещение в 'r' компоненте, текущее смещение (которое станет "предыдущим" на следующем шаге) в 'g'
    outColor = vec4(u_new, u_current, 0.0, 1.0);
}
