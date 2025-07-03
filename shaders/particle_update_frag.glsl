#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D u_particlePosPrev; // Предыдущие позиции частиц
uniform sampler2D u_particleVelPrev; // Предыдущие скорости частиц
uniform sampler2D u_plateState; // Состояние пластины (FDM)
uniform float u_deltaTime; // Шаг времени
uniform float u_forceMult; // Множитель силы
uniform float u_damping; // Затухание
uniform float u_restitution; // Коэффициент упругости
uniform float u_maxSpeed; // Максимальная скорость
uniform float u_plateRadius; // Радиус пластины
uniform bool u_enableRepulsion; // Включение отталкивания
uniform float u_repulsionRadius; // Радиус отталкивания
uniform float u_repulsionStrength; // Сила отталкивания
uniform int u_maxNeighbors; // Максимальное число соседей
uniform int u_activeParticleCount; // Активное число частиц
uniform vec2 u_resolution; // Разрешение текстуры FDM

in vec2 vUv;
layout(location = 0) out vec4 posOut;
layout(location = 1) out vec4 velOut;

float getDisplacement(vec2 uv) {
    return texture(u_plateState, uv).r;
}

vec2 getGradient(vec2 uv) {
    vec2 texelSize = 1.0 / u_resolution;
    float u_right = getDisplacement(uv + vec2(texelSize.x, 0.0));
    float u_left = getDisplacement(uv - vec2(texelSize.x, 0.0));
    float u_up = getDisplacement(uv + vec2(0.0, texelSize.y));
    float u_down = getDisplacement(uv - vec2(0.0, texelSize.y));
    return vec2((u_right - u_left) / (2.0 * texelSize.x),
                (u_up - u_down) / (2.0 * texelSize.y));
}

void main() {
    // Пропускаем неактивные частицы
    int particleIndex = int(vUv.x * float(u_resolution.x)) + int(vUv.y * float(u_resolution.y)) * int(u_resolution.x);
    if (particleIndex >= u_activeParticleCount) {
        posOut = vec4(0.0);
        velOut = vec4(0.0);
        return;
    }

    // Считываем текущие позицию и скорость
    vec3 position = texture(u_particlePosPrev, vUv).rgb;
    vec3 velocity = texture(u_particleVelPrev, vUv).rgb;

    // Вычисляем UV-координаты для выборки из FDM
    vec2 uv = (position.xz / u_plateRadius + 1.0) * 0.5; // Нормализация [-R, R] -> [0, 1]
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        uv = clamp(uv, 0.0, 1.0); // Ограничение для безопасности
    }

    // Вычисляем силу от градиента
    vec2 gradient = getGradient(uv);
    vec3 force = vec3(-gradient.x, 0.0, -gradient.y) * u_forceMult;

    // Добавляем отталкивание
    if (u_enableRepulsion) {
        vec3 repulsionForce = vec3(0.0);
        int neighborCount = 0;
        float texelSize = 1.0 / float(u_resolution.x);
        for (int i = -u_maxNeighbors / 2; i <= u_maxNeighbors / 2 && neighborCount < u_maxNeighbors; i++) {
            for (int j = -u_maxNeighbors / 2; j <= u_maxNeighbors / 2 && neighborCount < u_maxNeighbors; j++) {
                if (i == 0 && j == 0) continue;
                vec2 neighborUv = vUv + vec2(float(i), float(j)) * texelSize;
                if (neighborUv.x < 0.0 || neighborUv.x > 1.0 || neighborUv.y < 0.0 || neighborUv.y > 1.0) continue;
                int neighborIndex = int(neighborUv.x * float(u_resolution.x)) + int(neighborUv.y * float(u_resolution.y)) * int(u_resolution.x);
                if (neighborIndex >= u_activeParticleCount) continue;
                vec3 neighborPos = texture(u_particlePosPrev, neighborUv).rgb;
                vec3 delta = position - neighborPos;
                float dist = length(delta);
                if (dist < u_repulsionRadius && dist > 0.001) {
                    repulsionForce += normalize(delta) * u_repulsionStrength / (dist * dist);
                    neighborCount++;
                }
            }
        }
        force += repulsionForce;
    }

    // Обновляем скорость
    velocity += force * u_deltaTime;
    velocity *= u_damping; // Применяем затухание
    float speed = length(velocity);
    if (speed > u_maxSpeed) {
        velocity = normalize(velocity) * u_maxSpeed;
    }

    // Обновляем позицию
    position += velocity * u_deltaTime;

    // Ограничение границами пластины
    float r = length(position.xz);
    if (r > u_plateRadius) {
        vec3 normal = vec3(position.x / r, 0.0, position.z / r);
        position.xz = normal.xz * u_plateRadius;
        velocity.xz = reflect(velocity.xz, normal.xz) * u_restitution;
    }

    posOut = vec4(position, 1.0);
    velOut = vec4(velocity, 1.0);
}
