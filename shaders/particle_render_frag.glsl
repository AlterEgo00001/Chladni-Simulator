#version 300 es
precision highp float;

in vec3 vColor;
out vec4 fragColor;

void main() {
    // Круглые частицы
    vec2 coord = gl_PointCoord - vec2(0.5);
    if (length(coord) > 0.5) discard; // Отбрасываем пиксели вне круга
    fragColor = vec4(vColor, 1.0);
}
