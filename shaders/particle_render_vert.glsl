/*
 * particle_render_vert.glsl
 * Вершинный шейдер для финального рендеринга частиц.
 *
 * Назначение:
 * Для каждой вершины определить ее позицию на экране,
 * считав координаты соответствующей частицы из текстуры состояния.
 * Также считывает смещение с FDM-текстуры для "прыжков".
 */

// Текстуры с финальными данными
uniform sampler2D u_particlePositions;
uniform sampler2D u_plateState;

// Параметры для визуализации
uniform float u_plateRadius;
uniform float u_particleSize;
uniform float u_visualDeformationScale;
uniform float u_maxVisualAmplitude;
 
void main() {
    // `position` здесь - это UV-координаты (x, y) для доступа к текстуре,
    // которые мы заранее записали в атрибуты геометрии.
    vec3 particlePos = texture2D(u_particlePositions, position.xy).xyz;

    // Конвертируем позицию частицы в UV для FDM-текстуры
    vec2 plateUV = particlePos.xz / (u_plateRadius * 2.0) + 0.5;
    
    // Считываем смещение пластины в этой точке для "прыжка"
    float displacement = texture2D(u_plateState, plateUV).r;
    
    // Рассчитываем финальную позицию вершины в мировых координатах
    vec4 modelPosition = vec4(particlePos.x, 0.0, particlePos.z, 1.0);
    modelPosition.y = clamp(displacement * u_visualDeformationScale, -u_maxVisualAmplitude, u_maxVisualAmplitude);

    // Стандартное преобразование в экранные координаты
    vec4 viewPosition = modelViewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    
    // Устанавливаем размер точки
    gl_PointSize = u_particleSize * (100.0 / -viewPosition.z);
}