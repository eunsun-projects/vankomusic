precision mediump float;

// These are provided by Three.js automatically
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
uniform float uTime;

// These are provided by Three.js automatically
// attribute vec3 position;
// attribute vec3 normal;

varying vec3 vNormal;
varying vec3 vPosition;

// Simple function for non-linear growth (starts slow, accelerates)
float easeInQuad(float t) {
  return t * t;
}

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Supernova Expansion Logic
    float duration = 5.0; // Total duration of the expansion phase
    float maxScale = 1.5; // Maximum scale factor
    float timeProgress = mod(uTime, duration) / duration; // Loop the effect
    float currentScale = 1.0 + (maxScale - 1.0) * easeInQuad(timeProgress);

    vec3 scaledPosition = position * currentScale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(scaledPosition, 1.0);
}
