precision mediump float;

uniform float uTime;
uniform float mixWeight; // 0.0 = Power 60, 1.0 = Power 100 (Solar)

varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise; // Noise value from vertex shader (0.0 to 1.0)

// --- Noise Functions (Simplex Noise from Book of Shaders) ---
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

// FBM function from P100
float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 2.0;
    for (int i = 0; i < 4; i++) {
        value += amplitude * snoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}
// --- End Noise Functions ---

// --- Power 60 Color Calculation (Adjusted) ---
vec3 vibrantColorP60(float time, vec3 pos, float noise) {
    float speed = 0.8;
    float colorSeparation = 1.5;
    float noiseInfluence = 0.8;
    float r = 0.5 + 0.5 * sin(time * speed + pos.x * colorSeparation + noise * noiseInfluence);
    float g = 0.5 + 0.35 * sin(time * speed * 1.2 + pos.y * colorSeparation + noise * noiseInfluence + 2.0);
    float b = 0.5 + 0.5 * sin(time * speed * 1.4 + pos.z * colorSeparation + noise * noiseInfluence + 4.0);
    vec3 baseColor = vec3(r, g, b);
    vec3 noiseColorShift = vec3(sin(noise * 10.0), cos(noise * 12.0) * 0.7, sin(noise * 15.0 + time));
    vec3 mixed = mix(baseColor, noiseColorShift, 0.3 + 0.2 * sin(time));
    vec3 purpleShift = vec3(0.6, 0.3, 0.8);
    mixed = mix(mixed, purpleShift, 0.15);
    return mixed;
}

vec3 calculatePower60Color(float time, vec3 pos, float noise, vec3 normal) {
    vec3 colorP60 = vibrantColorP60(time, pos, noise);
    colorP60 *= 0.85;
    vec3 viewDir = normalize(-pos);
    float fresnel = pow(1.0 - max(dot(normalize(normal), viewDir), 0.0), 3.0);
    vec3 finalColor = colorP60 + vec3(fresnel * 0.15);
    finalColor += vec3(noise * 0.1);
    return finalColor;
}
// --- End Power 60 Calculation ---

// --- Power 100 (Solar) Color Calculation (Adjusted) ---
vec3 solarBaseColorP100(float time, vec3 pos, float noise) {
    float speed = 0.6;
    float colorSeparation = 2.0;
    float noiseInfluence = 0.5;
    float r = 0.7 + 0.3 * sin(time * speed * 1.0 + pos.x * colorSeparation + noise * noiseInfluence + 0.5);
    float g = 0.4 + 0.3 * sin(time * speed * 1.2 + pos.y * colorSeparation + noise * noiseInfluence + 1.5);
    float b = 0.1 + 0.1 * cos(time * speed * 0.8 + pos.z * colorSeparation + noise * noiseInfluence + 3.0);
    vec3 base = vec3(r, g, b);
    vec3 noiseColorShift = vec3(0.5 + 0.5 * sin(noise * 8.0 + time * 0.2), 0.3 + 0.3 * cos(noise * 10.0 + time * 0.3), 0.05 + 0.05 * sin(noise * 12.0 + time * 0.1));
    vec3 mixed = mix(base, noiseColorShift, 0.4 + 0.2 * sin(time * 0.4));
    mixed.r = max(mixed.r, mixed.g * 1.2);
    mixed.b *= 0.5;
    return clamp(mixed, 0.0, 1.0);
}

vec3 calculatePower100Color(float time, vec3 pos, float noise, vec3 normal) {
    vec3 baseSolarColor = solarBaseColorP100(time, pos, noise);

    // Solar texture using FBM
    float textureSpeed = 0.25;
    float textureScale = 3.5;
    float textureIntensity = 0.75; // Increase intensity influence
    vec3 textureCoord = pos * textureScale + vec3(time * textureSpeed);
    float solarTexture = fbm(textureCoord);
    solarTexture = (solarTexture + 1.0) * 0.5;

    // Modulate color with solar texture - More contrast approach
    vec3 darkColor = baseSolarColor * 0.5; // Darker base for texture troughs
    vec3 brightColor = baseSolarColor + vec3(0.4, 0.2, 0.05); // Brighter peaks (Orange/Yellow shifted)
    vec3 texturedColor = mix(darkColor, brightColor, pow(solarTexture, 1.5)); // Use pow for sharper contrast
    vec3 color = mix(baseSolarColor, texturedColor, textureIntensity);

    // Solar Flare Effect (Reduced intensity)
    float flareTime = sin(time * 1.8 + pos.x * 6.0) * 0.5 + 0.5;
    float flareNoiseCoordScale = 9.0;
    float flareNoiseVal = snoise(pos * flareNoiseCoordScale + time * 0.6);
    flareNoiseVal = (flareNoiseVal + 1.0) * 0.5;
    float flareIntensity = pow(max(0.0, flareTime - 0.97) * 30.0, 4.0); // Slightly adjusted timing/power
    flareIntensity *= pow(flareNoiseVal, 5.0); // More localized
    vec3 flareColor = vec3(1.2, 1.0, 0.6);
    color += flareColor * flareIntensity * 0.4; // Further reduced flare brightness multiplier

    // Subtle glow based on vertex noise (Reduced intensity)
    color += vec3(1.0, 0.6, 0.2) * noise * 0.03;

    // Rim Glow / Halo Effect (Reduced intensity)
    vec3 viewDirection = normalize(-pos);
    float rimPower = 3.5; // Slightly tighter glow
    float rimIntensity = 0.6; // Further reduced rim glow intensity
    float rim = pow(1.0 - max(dot(normalize(normal), viewDirection), 0.0), rimPower);
    vec3 rimColor = vec3(1.0, 0.7, 0.3);
    color += rimColor * rim * rimIntensity;

    // Final contrast adjustment (Subtle)
    color = pow(color, vec3(0.98));

    // Clamp is applied after mixing in main
    return color;
}
// --- End Power 100 Calculation ---

void main() {
    // Calculate Power 60 color
    vec3 power60ColorResult = calculatePower60Color(uTime, vPosition, vNoise, vNormal);

    // Calculate Power 100 color
    vec3 power100ColorResult = calculatePower100Color(uTime, vPosition, vNoise, vNormal);

    // Mix the results based on mixWeight
    vec3 mixedColor = mix(power60ColorResult, power100ColorResult, mixWeight);

    // Clamp the final mixed color (Lowered max clamp value again)
    mixedColor = clamp(mixedColor, 0.0, 1.6); // Lowered max clamp from 1.8 to further control brightness

    gl_FragColor = vec4(mixedColor, 1.0);
}
