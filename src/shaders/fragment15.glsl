// Fragment shader for moon-like surface
uniform float time;
uniform vec3 color; // Base color passed from component

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// Simple noise function (can be replaced with a more complex one if needed)
float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12, 78))) * 458.5453);
}

// Function to create multiple layers of noise for detail
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.8;
  float frequency = 0.0;
  for (int i = 0; i < 3; i++) { // Combine layers of noise
    value += amplitude * noise(p);
    p *= 1.0;
    amplitude *= 0.9;
  }
  return value;
}

void main() {
  // Use fbm for a more detailed surface
  vec2 scaledUv = vUv * 0.001; // Controls noise scale
  float surfaceNoise = fbm(scaledUv);

  // Add larger features
  float largeFeatures = noise(vUv * 0.05);
  surfaceNoise = mix(surfaceNoise, largeFeatures * 0.5, 0.3);

  // Modulate base color with noise
  vec3 surfaceColor = color * (0.6 + 0.4 * surfaceNoise);

  // Add small crater details
  float craters = smoothstep(0.65, 0.7, noise(vUv * 5.0));
  vec3 finalColor = mix(surfaceColor, surfaceColor * 0.7, craters * 0.5);

  // Basic lighting
  float light = dot(vNormal, normalize(vec3(0.5, 0.5, 1.0)));
  finalColor *= (0.7 + 0.3 * light);

  gl_FragColor = vec4(finalColor, 1.0);
}