import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const ShaderBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;

        // Simplex noise functions
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

          // Multi-layered noise for organic flow
          float n1 = snoise(uv * 3.0 + uTime * 0.08) * 0.5 + 0.5;
          float n2 = snoise(uv * 5.0 - uTime * 0.05 + 10.0) * 0.5 + 0.5;
          float n3 = snoise(uv * 8.0 + uTime * 0.03 + 20.0) * 0.5 + 0.5;

          // Mouse influence - subtle
          float mouseDist = length(uv - uMouse);
          float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * 0.15;

          // Deep red accent colors
          vec3 deepBlack = vec3(0.0, 0.0, 0.0);
          vec3 darkRed = vec3(0.15, 0.01, 0.01);
          vec3 subtleRed = vec3(0.08, 0.005, 0.005);

          // Base: mostly black with very subtle noise variation
          vec3 color = mix(deepBlack, subtleRed, n1 * 0.3);

          // Add red nebula-like wisps
          float wisp = pow(n2 * n3, 2.0) * 0.6;
          color += darkRed * wisp * (1.0 - r * 0.5);

          // Central glow (subtle pulsing)
          float pulse = sin(uTime * 0.3) * 0.15 + 0.85;
          float centerGlow = exp(-r * 2.5) * 0.08 * pulse;
          color += vec3(0.35, 0.02, 0.02) * centerGlow;

          // Mouse reactive glow
          color += vec3(0.2, 0.01, 0.01) * mouseInfluence;

          // Vignette
          float vignette = smoothstep(0.0, 1.4, r);
          color = mix(color, deepBlack, vignette * 0.8);

          // Film grain
          float grain = fract(sin(dot(uv * uTime, vec2(12.9898, 78.233))) * 43758.5453) * 0.02;
          color += grain;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      uniforms.uMouse.value.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none"
    />
  );
};
