#version 300 es
precision highp float;
precision highp sampler2D;

in float particleIndex;
uniform sampler2D u_particlePositions; // Текстура позиций частиц
uniform sampler2D u_plateState; // Состояние пластины
uniform float u_plateRadius; // Радиус пластины
uniform float u_deformScale; // Масштаб деформации
uniform float u_maxAmplitude; // Максимальная амплитуда
uniform float u_rotationAngle; // Угол поворота пластины
uniform int u_activeParticleCount; // Активное число частиц

out vec3 vColor;

void main() {
    // Пропускаем неактивные частицы
    if (int(particleIndex) >= u_activeParticleCount) {
        gl_Position = vec4(0.0, 0.0, -1000.0, 1.0); // Помещаем вне видимости
        gl_PointSize = 0.0;
        return;
    }

    // Вычисляем UV-координаты для выборки позиции
    float texSize = ceil(sqrt(float(u_activeParticleCount)));
    vec2 uv = vec2(
        mod(particleIndex, texSize) / texSize,
        floor(particleIndex / texSize) / texSize
    );

    // Считываем позицию частицы
    vec3 position = texture(u_particlePositions, uv).rgb;

    // Вычисляем UV-координаты для FDM
    vec2 fdmUv = (position.xz / u_plateRadius + 1.0) * 0.5;
    float displacement = texture(u_plateState, fdmUv).r;

    // Применяем деформацию по высоте
    position.y = displacement * u_deformScale;

    // Применяем поворот пластины
    float cosA = cos(u_rotationAngle);
    float sinA = sin(u_rotationAngle);
    mat2 rotation = mat2(cosA, -sinA, sinA, cosA);
    position.xz = rotation * position.xz;

    // Проецируем позицию
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 2.0; // Фиксированный размер частиц
    vColor = vec3(0.0, 0.85, 1.0); // Цвет частиц (cyan)
}
