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

// Function for vibrant base color (similar to power 60 but maybe adjusted)
vec3 vibrantBaseColor(float time, vec3 pos, float noise) {
    float speed = 0.7;
    float colorSeparation = 1.8;
    float noiseInfluence = 0.6;

    float r = 0.6 + 0.4 * sin(time * speed * 1.1 + pos.x * colorSeparation + noise * noiseInfluence + 1.0);
    float g = 0.5 + 0.5 * sin(time * speed * 1.3 + pos.y * colorSeparation + noise * noiseInfluence + 1.0);
    float b = 0.4 + 0.4 * cos(time * speed * 0.9 + pos.z * colorSeparation + noise * noiseInfluence + 5.0);

    vec3 base = vec3(r, g, b);
    // Shift towards yellow/orange
    // base = mix(base, vec3(1.0, 0.7, 0.2), 0.2); // Mix with orange
    return base;
}

void main() {
    // Base vibrant color
    vec3 color = vibrantBaseColor(uTime, vPosition, vNoise);

    // Solar texture using FBM
    float textureSpeed = 0.2;
    float textureScale = 3.0;
    float textureIntensity = 0.5;
    vec3 textureCoord = vPosition * textureScale + vec3(uTime * textureSpeed);
    float solarTexture = fbm(textureCoord);
    solarTexture = (solarTexture + 1.0) * 0.5; // Normalize to 0-1

    // Modulate color with the solar texture
    color *= (1.0 - textureIntensity) + solarTexture * textureIntensity * 1.1; // Make texture brighter
    color = mix(color, vec3(1.0, 0.8, 0.3), solarTexture * 0.2); // Add yellow tint based on texture

    // Solar Flare Effect
    float flareTime = sin(uTime * 1.5 + vPosition.x * 5.0) * 0.5 + 0.5; // Time-based trigger
    float flareNoiseCoordScale = 8.0;
    float flareNoise = snoise(vPosition * flareNoiseCoordScale + uTime * 0.5); // Spatial noise for flare location
    flareNoise = (flareNoise + 1.0) * 0.5; // Normalize 0-1

    float flareIntensity = pow(max(0.0, flareTime - 0.95) * 20.0, 3.0); // Make flares sharp peaks
    flareIntensity *= pow(flareNoise, 4.0); // Make flares localized by noise

    vec3 flareColor = vec3(1.0, 0.9, 0.5); // Bright yellow/white flare
    color += flareColor * flareIntensity * 1.5; // Add flare color additively

    // Subtle glow based on vertex noise (keep from power 60)
    color += vec3(vNoise * 0.08);

    // Rim Glow / Halo Effect
    // vec3 viewDirection = normalize(-vPosition); // Assumes camera at origin in view space
    // float rimPower = 4.0; // Controls the tightness of the glow
    // float rimIntensity = 1.2; // Controls the brightness of the glow
    // float rim = pow(1.0 - max(dot(normalize(vNormal), viewDirection), 0.0), rimPower);
    // vec3 rimColor = vec3(1.0, 0.85, 0.6); // Warm glow color
    // color += rimColor * rim * rimIntensity;

    // Final adjustments (ensure color values don't go excessively high)
    // color = pow(color, vec3(0.8)); // Apply gamma correction if needed
    color = clamp(color, 0.0, 0.8); // Clamp slightly higher to allow for bright glow

    gl_FragColor = vec4(color, 1.0);
}
