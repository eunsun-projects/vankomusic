// Fragment shader combining Saturn (Enhanced) and Power 60 effects with cross-fading
uniform float time; // Used by Saturn logic
uniform float uTime; // Used by Power 60 logic (consider unifying if possible)
uniform vec3 color; // Base color passed from component (used by Saturn)
uniform float mixWeight; // 0.0 = Saturn, 1.0 = Power 60

varying vec2 vUv; // Used by Saturn logic
varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise; // Noise from vertex shader

// --- Simplex Noise Functions (consistent) ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}
// --- End Noise Functions ---

// Function to create enhanced Saturn bands
vec3 createEnhancedSaturnBands(vec2 uv, float t, vec3 baseColor, float vertNoise) {
    vec2 baseUv = uv;

    // More complex distortion using multiple noise layers
    float distortX1 = snoise(baseUv * vec2(0.8, 2.2) + t * 0.06) * 0.06;
    float distortY1 = snoise(baseUv * vec2(1.8, 0.9) + t * 0.04) * 0.07;
    float distortX2 = snoise(baseUv * vec2(3.5, 1.5) - t * 0.03) * 0.03;
    float distortY2 = snoise(baseUv * vec2(1.2, 3.8) - t * 0.02) * 0.04;
    vec2 distortedUv = baseUv + vec2(distortX1 + distortX2, distortY1 + distortY2);

    // Generate more detailed bands
    float bandNoise1 = snoise(distortedUv * 5.0 + t * 0.12);
    float bandNoise2 = snoise(distortedUv * 12.0 + t * 0.07);
    float baseBand = sin((distortedUv.y + bandNoise1 * 0.1) * 14.0); // Higher frequency bands
    float bandDetail = mix(baseBand, bandNoise2, 0.6);
    bandDetail = (bandDetail + 1.0) * 0.5; // Normalize 0-1

    // Enhanced color palette with more contrast
    vec3 color1 = vec3(1.0, 0.92, 0.7);  // Brighter Cream
    vec3 color2 = vec3(0.95, 0.78, 0.55); // Richer Beige
    vec3 color3 = vec3(0.75, 0.55, 0.38); // Deeper Brown
    vec3 color4 = vec3(0.6, 0.4, 0.25);   // Darker Accent

    // Blend colors with more steps for complexity
    vec3 surfaceColor = mix(color1, color2, smoothstep(0.2, 0.5, bandDetail));
    surfaceColor = mix(surfaceColor, color3, smoothstep(0.55, 0.75, bandDetail));
    surfaceColor = mix(surfaceColor, color4, smoothstep(0.8, 0.9, sin(distortedUv.y * 25.0 + bandNoise1 * 1.5)));

    // Add time-varying color shift for more dynamism
    float timeColorShift = sin(t * 0.5 + baseUv.y * 3.0) * 0.05;
    surfaceColor.r += timeColorShift;
    surfaceColor.g -= timeColorShift * 0.5;

    // Blend with the original star color (less intensity)
    surfaceColor = mix(surfaceColor, baseColor, 0.15);

    // Add finer, shimmering texture noise
    float fineNoiseFreq = 60.0;
    float fineNoise = snoise(distortedUv * fineNoiseFreq + t * 0.03);
    float shimmer = pow(max(0.0, snoise(distortedUv * 20.0 - t * 0.1)), 5.0);
    surfaceColor += vec3(0.1) * shimmer * fineNoise; // Add subtle shimmer
    surfaceColor *= (0.97 + 0.03 * snoise(distortedUv * 80.0 + t * 0.01)); // Very fine grain

    // Use vertex noise for subtle brightness variation
    surfaceColor *= (0.9 + 0.2 * vertNoise);

    return surfaceColor;
}

// --- Power 60 Color Calculation (from fragment60 - Adjusted) ---
vec3 vibrantColorP60(float u_time, vec3 pos, float noise) {
    float speed = 0.8;
    float colorSeparation = 1.5;
    float noiseInfluence = 0.8;
    float r = 0.5 + 0.5 * sin(u_time * speed + pos.x * colorSeparation + noise * noiseInfluence);
    float g = 0.5 + 0.35 * sin(u_time * speed * 1.2 + pos.y * colorSeparation + noise * noiseInfluence + 2.0);
    float b = 0.5 + 0.5 * sin(u_time * speed * 1.4 + pos.z * colorSeparation + noise * noiseInfluence + 4.0);
    vec3 baseColor = vec3(r, g, b);
    vec3 noiseColorShift = vec3(sin(noise * 10.0), cos(noise * 12.0) * 0.7, sin(noise * 15.0 + u_time));
    vec3 mixed = mix(baseColor, noiseColorShift, 0.3 + 0.2 * sin(u_time));
    vec3 purpleShift = vec3(0.6, 0.3, 0.8);
    mixed = mix(mixed, purpleShift, 0.15);
    return mixed;
}

vec3 calculatePower60Color(float u_time, vec3 pos, float noise, vec3 normal) {
    vec3 colorP60 = vibrantColorP60(u_time, pos, noise);
    colorP60 *= 0.85;
    vec3 viewDir = normalize(-pos);
    float fresnel = pow(1.0 - max(dot(normalize(normal), viewDir), 0.0), 3.0);
    vec3 finalColor = colorP60 + vec3(fresnel * 0.15);
    finalColor += vec3(noise * 0.1);
    return finalColor;
}
// --- End Power 60 Calculation ---

void main() {
    // Calculate Saturn color (using 'time' uniform)
    vec3 saturnColorResult = createEnhancedSaturnBands(vUv, time, color, vNoise);

    // Calculate Power 60 color (using 'uTime' uniform)
    vec3 power60ColorResult = calculatePower60Color(uTime, vPosition, vNoise, vNormal);

    // Mix the results based on mixWeight
    vec3 mixedColor = mix(saturnColorResult, power60ColorResult, mixWeight);

    // Apply basic lighting (using Saturn's lighting for consistency in transition)
    float light = dot(vNormal, normalize(vec3(0.6, 0.6, 1.0)));
    light = smoothstep(-0.1, 1.0, light);
    vec3 finalColor = mixedColor * (0.6 + 0.4 * light);

    gl_FragColor = vec4(finalColor, 1.0);
}
