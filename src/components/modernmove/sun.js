import * as THREE from 'three' 

// SUN
var sunGeom = new THREE.CircleGeometry(26, 32);
var sunMat = new THREE.MeshBasicMaterial({color: 'orange', fog: false, transparent: true});
sunMat.onBeforeCompile = shader => {
    shader.uniforms.time = {value: 0};
    shader.vertexShader =
        `
        varying vec2 vUv;
    ` + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
        vUv = uv;
        `
    );
    shader.fragmentShader = `
        varying vec2 vUv;
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
        // `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
        // `gl_FragColor = vec4( outgoingLight, diffuseColor.a * smoothstep(0.5, 0.7, vUv.y));`

        `vec4 diffuseColor = vec4( diffuse, opacity );`,
        `
        vec3 col = diffuse;
        vec2 uv = abs((gl_PointCoord - 0.5) * 4.);
        float d = length(uv - vec2(1));
        float f = 1. - step(d, 1.2);
        if (f < 0.1) discard;
        col = col * f;
        vec4 diffuseColor = vec4( col, f );
        `
    );
    
    // shader.uniforms.time.value
}
var sun = new THREE.Mesh(sunGeom, sunMat);

export { sun };