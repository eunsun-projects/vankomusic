precision mediump float;

uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise; // Noise from vertex shader (0.0 to 1.0)

// Noise functions (Simplex Noise from Book of Shaders)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;
    i = mod289(i);
    vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

// Fractional Brownian Motion (FBM) for texture
float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 2.0;
    for (int i = 0; i < 4; i++) { // 4 octaves
        value += amplitude * snoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// Function for intense Solar base color (red/yellow/orange focused)
vec3 solarBaseColor(float time, vec3 pos, float noise) {
    float speed = 0.6;
    float colorSeparation = 2.0;
    float noiseInfluence = 0.5;

    // Emphasize Red and Yellow/Orange tones, minimize Blue/Green
    float r = 0.7 + 0.3 * sin(time * speed * 1.0 + pos.x * colorSeparation + noise * noiseInfluence + 0.5);
    float g = 0.4 + 0.3 * sin(time * speed * 1.2 + pos.y * colorSeparation + noise * noiseInfluence + 1.5); // Green acts more like Orange component
    float b = 0.1 + 0.1 * cos(time * speed * 0.8 + pos.z * colorSeparation + noise * noiseInfluence + 3.0); // Blue is minimal

    vec3 base = vec3(r, g, b);

    // Noise color shift also focused on warm tones
    vec3 noiseColorShift = vec3(
        0.5 + 0.5 * sin(noise * 8.0 + time * 0.2),
        0.3 + 0.3 * cos(noise * 10.0 + time * 0.3),
        0.05 + 0.05 * sin(noise * 12.0 + time * 0.1)
    );

    vec3 mixed = mix(base, noiseColorShift, 0.4 + 0.2 * sin(time * 0.4));

    // Ensure strong yellow/red dominance
    mixed.r = max(mixed.r, mixed.g * 1.2); // Ensure Red is generally higher than Green/Orange part
    mixed.b *= 0.5; // Further suppress blue

    return clamp(mixed, 0.0, 1.0);
}

void main() {
    // Base Solar color
    vec3 color = solarBaseColor(uTime, vPosition, vNoise);

    // Solar texture using FBM (adjusted for solar look)
    float textureSpeed = 0.25;
    float textureScale = 3.5; // Slightly larger scale features
    float textureIntensity = 0.6;
    vec3 textureCoord = vPosition * textureScale + vec3(uTime * textureSpeed);
    float solarTexture = fbm(textureCoord);
    solarTexture = (solarTexture + 1.0) * 0.5; // Normalize to 0-1

    // Modulate color with the solar texture (more contrast)
    vec3 textureColor = mix(vec3(0.8, 0.3, 0.1), vec3(1.0, 0.9, 0.4), solarTexture); // Dark red to bright yellow
    color = mix(color * 0.6, textureColor, textureIntensity);
    color *= (1.0 + solarTexture * 0.5); // Add brightness based on texture peaks

    // Solar Flare Effect (more intense and warmer)
    float flareTime = sin(uTime * 1.8 + vPosition.x * 6.0) * 0.5 + 0.5;
    float flareNoiseCoordScale = 9.0;
    float flareNoise = snoise(vPosition * flareNoiseCoordScale + uTime * 0.6);
    flareNoise = (flareNoise + 1.0) * 0.5;

    float flareIntensity = pow(max(0.0, flareTime - 0.96) * 25.0, 3.5);
    flareIntensity *= pow(flareNoise, 4.5);

    vec3 flareColor = vec3(1.2, 1.0, 0.6); // Very bright yellow/white flare
    color += flareColor * flareIntensity * 1.8;

    // Subtle glow based on vertex noise (warm color)
    color += vec3(1.0, 0.6, 0.2) * vNoise * 0.1;

    // Rim Glow / Halo Effect (Warm Color)
    vec3 viewDirection = normalize(-vPosition);
    float rimPower = 3.0;
    float rimIntensity = 1.5;
    float rim = pow(1.0 - max(dot(normalize(vNormal), viewDirection), 0.0), rimPower);
    vec3 rimColor = vec3(1.0, 0.7, 0.3); // Warm orange glow color
    color += rimColor * rim * rimIntensity;

    // Final adjustments for intense solar look
    color = pow(color, vec3(0.9)); // Slightly increase contrast
    color = clamp(color, 0.0, 2.5); // Allow higher values for intense glow/flares

    gl_FragColor = vec4(color, 1.0);
}
