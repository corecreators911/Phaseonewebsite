import{r as w,j as h}from"./index-CEnxoe5D.js";import{S as g,O as y,W as z,a as b,V as R,P as k,M as C,C as E}from"./vendor-three-CQgtocpM.js";import"./vendor-react-labSKdyf.js";import"./vendor-gsap-DDlvirwQ.js";import"./vendor-motion-C3jKc-Dc.js";const W=()=>{const n=w.useRef(null);return w.useEffect(()=>{if(!n.current)return;const r=new g,s=new y(-1,1,1,-1,.1,10);s.position.z=1;let e;try{e=new z({alpha:!0,antialias:!1}),e.setSize(window.innerWidth,window.innerHeight),e.setPixelRatio(Math.min(window.devicePixelRatio,2)),n.current.appendChild(e.domElement)}catch{console.warn("WebGL not supported, skipping shader background");return}const t={uTime:{value:0},uMouse:{value:new R(.5,.5)}},a=new b({uniforms:t,vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;

        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                             -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x_) - 0.5;
          vec3 ox = floor(x_ + 0.5);
          vec3 a0 = x_ - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 uv = vUv;
          vec2 p = uv * 2.0 - 1.0;
          float r = length(p);

          float n1 = snoise(uv * 3.0 + uTime * 0.08) * 0.5 + 0.5;
          float n2 = snoise(uv * 5.0 - uTime * 0.05 + 10.0) * 0.5 + 0.5;
          float n3 = snoise(uv * 8.0 + uTime * 0.03 + 20.0) * 0.5 + 0.5;

          float mouseDist = length(uv - uMouse);
          float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * 0.15;

          vec3 deepBlack = vec3(0.0, 0.0, 0.0);
          vec3 darkRed = vec3(0.15, 0.01, 0.01);
          vec3 subtleRed = vec3(0.08, 0.005, 0.005);

          vec3 color = mix(deepBlack, subtleRed, n1 * 0.3);

          float wisp = pow(n2 * n3, 2.0) * 0.6;
          color += darkRed * wisp * (1.0 - r * 0.5);

          float pulse = sin(uTime * 0.3) * 0.15 + 0.85;
          float centerGlow = exp(-r * 2.5) * 0.08 * pulse;
          color += vec3(0.35, 0.02, 0.02) * centerGlow;

          color += vec3(0.2, 0.01, 0.01) * mouseInfluence;

          float vignette = smoothstep(0.0, 1.4, r);
          color = mix(color, deepBlack, vignette * 0.8);

          float grain = fract(sin(dot(uv * uTime, vec2(12.9898, 78.233))) * 43758.5453) * 0.02;
          color += grain;

          gl_FragColor = vec4(color, 1.0);
        }
      `}),c=new k(2,2),p=new C(c,a);r.add(p);let i=!1;const v=o=>{i||(i=!0,requestAnimationFrame(()=>{t.uMouse.value.set(o.clientX/window.innerWidth,1-o.clientY/window.innerHeight),i=!1}))};window.addEventListener("mousemove",v,{passive:!0});const l=()=>{e.setSize(window.innerWidth,window.innerHeight),e.setPixelRatio(Math.min(window.devicePixelRatio,2))};window.addEventListener("resize",l,{passive:!0});const f=new E;let m,u=!0;const d=()=>{m=requestAnimationFrame(d),u&&(t.uTime.value=f.getElapsedTime(),e.render(r,s))};d();const x=new IntersectionObserver(([o])=>{u=o.isIntersecting},{threshold:0});return n.current&&x.observe(n.current),()=>{window.removeEventListener("resize",l),window.removeEventListener("mousemove",v),cancelAnimationFrame(m),x.disconnect();const o=n.current;o&&e.domElement.parentNode===o&&o.removeChild(e.domElement),c.dispose(),a.dispose(),e.dispose()}},[]),h.jsx("div",{ref:n,className:"absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none"})};export{W as ShaderBackground};
