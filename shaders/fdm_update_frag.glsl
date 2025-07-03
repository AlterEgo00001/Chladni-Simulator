/*
 * fdm_update_frag.glsl
 * Фрагментный шейдер для обновления состояния FDM-сетки.
 * 
 * Назначение:
 * Для каждого "пикселя" (ячейки сетки) вычислить его новое смещение
 * на основе состояний соседних ячеек на предыдущем шаге по времени.
 * Это GPU-аналог функции `_updatePlateFDM_CPU`.
 */

// varying - переменная, полученная из вершинного шейдера.
varying vec2 vUv;

// --- Uniforms: Переменные, передаваемые из JavaScript ---

// Текстура, хранящая состояние сетки с предыдущего шага.
// .r канал = u_curr (текущее смещение)
// .g канал = u_prev (предыдущее смещение)
uniform sampler2D u_prevState;

// Физические и симуляционные параметры
uniform float u_dt_simulation_step; // Шаг по времени (dt)
uniform float u_dx; // Размер ячейки по X
uniform float u_K_coeff; // Коэффициент жесткости (D*dt^2 / rho*h)
uniform float u_F_coeff; // Коэффициент силы (dt^2 / rho*h)
uniform float u_damping; // Коэффициент затухания
uniform float u_exc_amp; // Амплитуда возбуждения
uniform float u_frequency; // Текущая частота
uniform float u_simulationTime; // Общее время симуляции
uniform vec2 u_resolution; // Размер сетки, например vec2(151.0, 151.0)
uniform int u_exc_mode; // Режим возбуждения: 0 = модальный, 1 = точечный
uniform sampler2D u_modalExcitationPattern; // Текстура с модальным узором
uniform float u_m_param; // Модальный параметр m

void main() {
    // Шаг по сетке в UV-координатах (1.0 / размер сетки)
    vec2 texelSize = 1.0 / u_resolution;

    // Читаем состояния из соседних пикселей, чтобы получить 13-точечный трафарет
    // Центральная точка
    vec2 u_ij_state = texture2D(u_prevState, vUv).rg;
    float u_ij = u_ij_state.r;
    float u_ij_prev = u_ij_state.g;

    // Соседи первого порядка
    float u_ip1j = texture2D(u_prevState, vUv + vec2(0.0, texelSize.y)).r;
    float u_im1j = texture2D(u_prevState, vUv - vec2(0.0, texelSize.y)).r;
    float u_ijp1 = texture2D(u_prevState, vUv + vec2(texelSize.x, 0.0)).r;
    float u_ijm1 = texture2D(u_prevState, vUv - vec2(texelSize.x, 0.0)).r;

    // Соседи по диагонали
    float u_ip1jp1 = texture2D(u_prevState, vUv + texelSize).r;
    float u_ip1jm1 = texture2D(u_prevState, vUv + vec2(-texelSize.x, texelSize.y)).r;
    float u_im1jp1 = texture2D(u_prevState, vUv + vec2(texelSize.x, -texelSize.y)).r;
    float u_im1jm1 = texture2D(u_prevState, vUv - texelSize).r;

    // Соседи второго порядка
    float u_ip2j = texture2D(u_prevState, vUv + vec2(0.0, 2.0 * texelSize.y)).r;
    float u_im2j = texture2D(u_prevState, vUv - vec2(0.0, 2.0 * texelSize.y)).r;
    float u_ijp2 = texture2D(u_prevState, vUv + vec2(2.0 * texelSize.x, 0.0)).r;
    float u_ijm2 = texture2D(u_prevState, vUv - vec2(2.0 * texelSize.x, 0.0)).r;
    
    // Вычисляем бигармонический оператор (дискретный аналог двойного Лапласиана)
    // Эта формула идентична той, что была на CPU
    float inv_dx4 = 1.0 / (u_dx * u_dx * u_dx * u_dx);
    float biharmonic = (20.0 * u_ij - 8.0 * (u_ip1j + u_im1j + u_ijp1 + u_ijm1) + 2.0 * (u_ip1jp1 + u_ip1jm1 + u_im1jp1 + u_im1jm1) + (u_ip2j + u_im2j + u_ijp2 + u_ijm2)) * inv_dx4;

    // Вычисляем внешнюю силу возбуждения
    float excForce = 0.0;
    float timeSine = sin(2.0 * 3.1415926535 * u_frequency * u_simulationTime);

    if (u_exc_mode == 0) { // Модальный режим
        float patternValue = texture2D(u_modalExcitationPattern, vUv).r;
        vec2 centered_uv = vUv - 0.5;
        float theta = atan(centered_uv.y, centered_uv.x);
        excForce = u_exc_amp * timeSine * patternValue * cos(u_m_param * theta);
    } else { // Точечный режим (в центре)
        vec2 center_dist = vUv - vec2(0.5);
        float distSq = dot(center_dist, center_dist);
        float excRadSq = 0.0016; // (0.04)^2, радиус возбуждения в UV-координатах
        if (distSq <= excRadSq) {
            excForce = u_exc_amp * timeSine * exp(-distSq / (excRadSq * 0.5));
        }
    }
    
    // Основная формула метода конечных разностей для обновления смещения
    float u_next = (2.0 * u_ij - u_ij_prev) - u_K_coeff * biharmonic + u_F_coeff * excForce;
    
    // Применяем затухание
    u_next *= (1.0 - u_damping);

    // Записываем результат в выходную текстуру.
    // .r (красный канал) будет хранить новое смещение u_next.
    // .g (зеленый канал) будет хранить текущее смещение u_ij, которое станет u_prev на следующем шаге.
    // .b и .a не используются.
    gl_FragColor = vec4(u_next, u_ij, 0.0, 1.0);
}