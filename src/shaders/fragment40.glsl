// Fragment shader for Saturn-like surface
uniform float time;
uniform vec3 color; // Base color (will be blended with Saturn colors)

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// --- Simplex Noise Functions (consistent with others) ---
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

// Function to create Saturn bands
vec3 createSaturnBands(vec2 uv, float time, vec3 baseColor) {
    vec2 distortedUv = uv;
    // 노이즈 강도 증가
    distortedUv.x += snoise(uv * vec2(1.0, 2.5) + time * 0.05) * 0.05; // 0.03 → 0.05
    distortedUv.y += snoise(uv * vec2(2.0, 1.0) + time * 0.03) * 0.06; // 0.04 → 0.06


    // Generate soft bands using sine waves mixed with noise
    float band = sin((distortedUv.y + snoise(distortedUv * 1.5 + time * 0.08) * 0.15) * 10.0); // Band frequency
    float bandNoise = snoise(distortedUv * 6.0 + time * 0.1);
    band = mix(band, bandNoise, 0.5); // 기존 0.35 → 0.5 로 높임
    band = (band + 1.0) * 0.5; // Normalize 0-1

    // 컬러 팔레트 명도/채도 강화
    vec3 color1 = vec3(1.0, 0.9, 0.65);  // 더 노란 크림색
    vec3 color2 = vec3(0.9, 0.75, 0.5);  // 진한 베이지
    vec3 color3 = vec3(0.7, 0.5, 0.35);  // 더 진한 브라운

    // Blend colors based on bands
    vec3 surfaceColor = mix(color1, color2, smoothstep(0.3, 0.6, band));
    surfaceColor = mix(surfaceColor, color3, smoothstep(0.7, 0.8, sin(distortedUv.y * 20.0 + bandNoise * 1.2)));

    // Blend with the original star color for variation
    surfaceColor = mix(surfaceColor, baseColor, 0.2); // Blend 20% of original color

    // Add very subtle high-frequency noise for texture
    float fineNoise = snoise(distortedUv * 50.0 + time * 0.02);
    surfaceColor *= (0.95 + 0.05 * fineNoise);

    return surfaceColor;
}

void main() {
  vec3 saturnColor = createSaturnBands(vUv, time, color);

  // Basic lighting
  float light = dot(vNormal, normalize(vec3(0.5, 0.5, 1.0)));
  light = smoothstep(0.0, 1.0, light);
  vec3 finalColor = saturnColor * (0.65 + 0.35 * light); // Slightly different lighting emphasis

  gl_FragColor = vec4(finalColor, 1.0);
}
