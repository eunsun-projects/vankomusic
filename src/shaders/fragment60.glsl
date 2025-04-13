precision mediump float;

uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise; // Noise value from vertex shader (0.0 to 1.0)

// Function to create vibrant colors using time and position
vec3 vibrantColor(float time, vec3 pos, float noise) {
    float speed = 0.8;
    float colorSeparation = 1.5;
    float noiseInfluence = 0.8;

    float r = 0.5 + 0.5 * sin(time * speed + pos.x * colorSeparation + noise * noiseInfluence);
    float g = 0.5 + 0.5 * sin(time * speed * 1.2 + pos.y * colorSeparation + noise * noiseInfluence + 2.0);
    float b = 0.5 + 0.5 * sin(time * speed * 1.4 + pos.z * colorSeparation + noise * noiseInfluence + 4.0);

    // Mix in some noise for more variation
    vec3 baseColor = vec3(r, g, b);
    vec3 noiseColorShift = vec3(sin(noise * 10.0), cos(noise * 12.0), sin(noise * 15.0 + time));

    return mix(baseColor, noiseColorShift, 0.3 + 0.2 * sin(time));
}

void main() {
    // Use normalized normal for consistent lighting/coloring independent of view angle if needed
    // vec3 normal = normalize(vNormal);

    // Calculate vibrant color based on time, position, and noise
    vec3 color = vibrantColor(uTime, vPosition, vNoise);

    // Slightly reduce base color brightness
    color *= 0.85;

    // Add a much subtler Fresnel effect for rim lighting
    vec3 viewDir = normalize(-vPosition); // Assumes camera is at origin in view space
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 3.0);
    vec3 finalColor = color + vec3(fresnel * 0.15); // Reduced highlight intensity

    // Add a subtler glowing effect based on noise
    finalColor += vec3(vNoise * 0.1); // Reduced glow intensity

    gl_FragColor = vec4(finalColor, 1.0);
}
