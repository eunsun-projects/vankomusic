// Fragment shader combining Moon and Jupiter effects with cross-fading
uniform float time;
uniform vec3 color; // Base color passed from component (used primarily for Moon)
uniform float mixWeight; // 0.0 = Moon, 1.0 = Jupiter

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// --- Simplex Noise Functions (same as Jupiter shader for consistency) ---
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

// Fractal Brownian Motion using snoise
float fbm_snoise(vec2 p, float time) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 2.0; // Start with a base frequency
    vec2 shift = vec2(100.0);

    for (int i = 0; i < 5; i++) { // Combine 5 layers of noise
        p.x += time * 0.02 * amplitude; // Slow horizontal drift based on amplitude
        value += amplitude * snoise(p * frequency);
        frequency *= 2.1; // Increase frequency (lacunarity)
        amplitude *= 0.45; // Decrease amplitude (persistence)
    }
    return (value + 1.0) * 0.5; // Normalize to 0-1 range
}

vec3 calculateMoonColor(vec2 uv, float t, vec3 baseColor) {
    float surfaceNoise = fbm_snoise(uv * 2.5, t * 0.1);
    float largeFeatures = snoise(uv * 0.8 + vec2(t * 0.015));
    largeFeatures = (largeFeatures + 1.0) * 0.5;
    surfaceNoise = mix(surfaceNoise, largeFeatures * 0.7, 0.4);
    vec3 moonBase = baseColor * mix(0.5, 1.1, surfaceNoise);
    float craterNoise = snoise(uv * 15.0 + vec2(t * 0.05));
    float craters = smoothstep(0.65, 0.75, craterNoise) * smoothstep(1.0, 0.8, craterNoise);
    return mix(moonBase, moonBase * 0.4, craters * 0.7);
}

vec3 createJupiterBands(vec2 uv, float t) {
    vec2 scaledUv = uv;
    scaledUv.x += sin(uv.y * 8.0 + t * 0.15) * 0.06;
    scaledUv.y += cos(uv.x * 6.0 + t * 0.08) * 0.03;
    float band = sin(scaledUv.y * 12.0 + t * 0.25);
    float bandNoise = snoise(scaledUv * 4.0 + t * 0.1) * 0.5 + 0.5;
    band = mix(band, bandNoise, 0.45);
    vec3 color1 = vec3(0.9, 0.75, 0.6);
    vec3 color2 = vec3(0.7, 0.5, 0.3);
    vec3 color3 = vec3(0.5, 0.3, 0.15);
    vec3 jupiterColor = mix(color1, color2, smoothstep(0.2, 0.6, band));
    jupiterColor = mix(jupiterColor, color3, smoothstep(0.7, 0.85, sin(scaledUv.y * 18.0 + bandNoise * 1.5)));
    float fineNoise = snoise(scaledUv * 35.0 + t * 0.06) * 0.5 + 0.5;
    jupiterColor *= (0.9 + 0.1 * fineNoise);
    vec2 spotUv = uv - vec2(0.65, 0.4);
    float spotDist = length(spotUv * vec2(1.0, 1.8));
    float spotIntensity = smoothstep(0.18, 0.08, spotDist);
    if (spotIntensity > 0.0) {
        float spotNoise = snoise(spotUv * 18.0 + t * 0.6);
        vec3 spotColor = vec3(0.6, 0.15, 0.1);
        vec3 spotHighlight = vec3(0.9, 0.7, 0.6);
        spotColor = mix(spotColor, spotHighlight, smoothstep(0.4, 0.7, spotNoise));
        jupiterColor = mix(jupiterColor, spotColor, spotIntensity * 0.9);
    }
    return jupiterColor;
}

void main() {
    // Calculate both colors
    vec3 moonColorResult = calculateMoonColor(vUv, time, color);
    vec3 jupiterColorResult = createJupiterBands(vUv, time);

    // Mix the results based on mixWeight
    vec3 mixedColor = mix(moonColorResult, jupiterColorResult, mixWeight);

    // Apply basic lighting to the final mixed color
    float light = dot(vNormal, normalize(vec3(0.5, 0.5, 1.0)));
    light = smoothstep(0.0, 1.0, light); // Soften lighting
    vec3 finalColor = mixedColor * (0.6 + 0.4 * light); // Apply lighting

    gl_FragColor = vec4(finalColor, 1.0);
}