/*
 * particle_render_frag.glsl
 * Фрагментный шейдер для финального рендеринга частиц.
 *
 * Назначение:
 * Задать цвет каждой частице.
 */

uniform vec3 u_particleColor; // Цвет, передаваемый из JS

void main() {
    // Рисуем круглую точку вместо квадратной
    if (length(gl_PointCoord - vec2(0.5)) > 0.5) {
        discard; // Отбрасываем пиксели вне круга
    }
    
    gl_FragColor = vec4(u_particleColor, 1.0);
}