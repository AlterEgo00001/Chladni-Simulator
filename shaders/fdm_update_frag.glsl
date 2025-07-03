#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D u_prevState; // Предыдущее состояние FDM
uniform float u_dt_simulation_step; // Шаг времени симуляции
uniform vec2 u_resolution; // Разрешение сетки
uniform float u_D_FLEXURAL_RIGIDITY; // Жёсткость изгиба
uniform float u_RHO_H_PLATE_SPECIFIC_DENSITY; // Удельная плотность
uniform int u_exc_mode; // Режим возбуждения (0 - модальный, 1 - точечный)
uniform float u_mParameter; // Параметр m для модального режима
uniform float u_excAmp; // Амплитуда возбуждения
uniform float u_simulationTime; // Текущее время симуляции
uniform float u_frequency; // Частота возбуждения

in vec2 vUv;
out vec4 fragColor;

// Константы
const float PI = 3.141592653589793;
const float DAMPING_FACTOR = 0.000050; // Фактор затухания из исходного кода

void main() {
    vec2 texelSize = 1.0 / u_resolution;
    float h = 2.0 / (u_resolution.x - 1.0); // Шаг сетки (нормализованный)

    // Считываем текущее и соседние перемещения
    float u_center = texture(u_prevState, vUv).r;
    float u_right = texture(u_prevState, vUv + vec2(texelSize.x, 0.0)).r;
    float u_left = texture(u_prevState, vUv - vec2(texelSize.x, 0.0)).r;
    float u_up = texture(u_prevState, vUv + vec2(0.0, texelSize.y)).r;
    float u_down = texture(u_prevState, vUv - vec2(0.0, texelSize.y)).r;
    float u_right2 = texture(u_prevState, vUv + vec2(2.0 * texelSize.x, 0.0)).r;
    float u_left2 = texture(u_prevState, vUv - vec2(2.0 * texelSize.x, 0.0)).r;
    float u_up2 = texture(u_prevState, vUv + vec2(0.0, 2.0 * texelSize.y)).r;
    float u_down2 = texture(u_prevState, vUv - vec2(0.0, 2.0 * texelSize.y)).r;
    float u_right_up = texture(u_prevState, vUv + vec2(texelSize.x, texelSize.y)).r;
    float u_right_down = texture(u_prevState, vUv + vec2(texelSize.x, -texelSize.y)).r;
    float u_left_up = texture(u_prevState, vUv + vec2(-texelSize.x, texelSize.y)).r;
    float u_left_down = texture(u_prevState, vUv + vec2(-texelSize.x, -texelSize.y)).r;

    // Вычисляем лапласиан (∇²u)
    float laplacian = (u_right + u_left + u_up + u_down - 4.0 * u_center) / (h * h);

    // Вычисляем бихармонический оператор (∇⁴u) с 13-точечным шаблоном
    float biharmonic = (
        20.0 * u_center -
        8.0 * (u_right + u_left + u_up + u_down) +
        2.0 * (u_right_up + u_right_down + u_left_up + u_left_down) +
        u_right2 + u_left2 + u_up2 + u_down2
    ) / (h * h * h * h);

    // Вычисляем возбуждающую силу
    float excitation = 0.0;
    if (u_exc_mode == 0) {
        // Модальное возбуждение
        vec2 pos = (vUv - 0.5) * 2.0; // Нормализованные координаты [-1, 1]
        float r = length(pos);
        float theta = atan(pos.y, pos.x);
        float besselValue = cos(u_mParameter * theta); // Упрощённая функция Бесселя для мод
        excitation = u_excAmp * sin(2.0 * PI * u_frequency * u_simulationTime) * besselValue;
    } else {
        // Точечное возбуждение (в центре)
        vec2 pos = vUv - 0.5;
        if (length(pos) < 0.05) {
            excitation = u_excAmp * sin(2.0 * PI * u_frequency * u_simulationTime);
        }
    }

    // Уравнение волны: ∂²u/∂t² = -(D/ρh) * ∇⁴u - γ * ∂u/∂t + f
    float accel = -u_D_FLEXURAL_RIGIDITY / u_RHO_H_PLATE_SPECIFIC_DENSITY * biharmonic -
                  DAMPING_FACTOR * u_center + excitation;

    // Обновление перемещения (метод конечных разностей)
    float u_new = 2.0 * u_center - texture(u_prevState, vUv).g +
                  u_dt_simulation_step * u_dt_simulation_step * accel;

    // Сохранение нового состояния: r - u(t), g - u(t-1), b - u(t-2)
    fragColor = vec4(u_new, u_center, texture(u_prevState, vUv).r, 1.0);
}
