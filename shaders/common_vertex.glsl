#version 300 es
in vec4 position;
out vec2 vUv;

void main() {
    vUv = position.xy * 0.5 + 0.5; // Преобразование координат в [0,1]
    gl_Position = position;
}
