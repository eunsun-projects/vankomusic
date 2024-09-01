import {
    BufferGeometry,
    Float32BufferAttribute,
    Points,
    PointsMaterial,
    Vector3
} from "three";

class MovingStars extends Points {
    constructor(w, h, d) {
        super();
        this.totalTime = { value: 0 };
        let phase = [];
        let g = new BufferGeometry().setFromPoints(
            new Array(100).fill().map((p) => {
                phase.push(Math.random() * Math.PI * 2);
                return new Vector3().random().subScalar(0.5).setY(h);
            })
        );
        // console.log(phase);
        g.scale(w, 1, d);
        g.setAttribute("phase", new Float32BufferAttribute(phase, 1));
        let m = new PointsMaterial({
            color: 0xffdfff, //0xffddff 0x80a6ed
            size: 3,
            //transparent: true,
            onBeforeCompile: (shader) => {
            shader.uniforms.time = this.totalTime;
            shader.vertexShader = `
                    uniform float time;
                    attribute float phase;
                    ${shader.vertexShader}
                `
                .replace(
                    `#include <begin_vertex>`,
                    `#include <begin_vertex>
                    transformed.z = mod(position.z + time - ${d / 2}., ${d}.) - ${
                        d / 2
                    }.;
                `
                ) //float twinkle = 0.5 + abs(sin(time * 0.05 + phase)) * 0.5;
                .replace(
                    `gl_PointSize = size;`,
                    `
                    float twinkle = 0.5 + abs(sin(time * 0.05 + phase)) * 0.5;
                    gl_PointSize = size * twinkle;`
                );
            //console.log(shader.vertexShader);
            shader.fragmentShader = `
                ${shader.fragmentShader}
            `.replace(
                `vec4 diffuseColor = vec4( diffuse, opacity );`,
                `
                vec3 col = diffuse;
                vec2 uv = abs((gl_PointCoord - 0.5) * 2.);
                float d = length(uv - vec2(1));
                float f = 1. - step(d, 1.);
                if (f < 0.1) discard;
                col = col * f;
                vec4 diffuseColor = vec4( col, f );
                `
            );
            //console.log(shader.fragmentShader);
            }
        });
        this.geometry = g;
        this.material = m;
        this.update = (t) => {
            this.totalTime.value += t;
        };
        }
}
export { MovingStars };
