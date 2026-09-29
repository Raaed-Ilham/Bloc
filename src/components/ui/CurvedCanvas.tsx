import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface CurvedCanvasProps {
  imageUrl: string;
  bendIntensity?: number;
}

// Vertex Shader: Bends the 3D plane along X and Y axes
const vertexShader = `
  uniform float uBend;
  uniform float uProgress;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Curved paper distortion based on UV coordinates
    float curveX = sin(uv.x * 3.14159265) * uBend;
    float curveY = cos(uv.y * 3.14159265) * (uBend * 0.4);

    pos.z += curveX + curveY;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment Shader: Maps image texture onto the mesh
const fragmentShader = `
  uniform sampler2D uTexture;
  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    gl_FragColor = texColor;
  }
`;

export default function CurvedCanvas({
  imageUrl,
  bendIntensity = 0.45,
}: CurvedCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const textureLoader = useRef(new THREE.TextureLoader());

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Mobile DPR cap
    container.appendChild(renderer.domElement);

    // 2. Subdivided Geometry (32x32 grid for smooth bending)
    const geometry = new THREE.PlaneGeometry(2.2, 2.8, 32, 32);

    // 3. Shader Material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uBend: { value: bendIntensity },
        uTexture: { value: null },
      },
      side: THREE.DoubleSide,
      transparent: true,
    });
    materialRef.current = material;

    // Load initial texture
    textureLoader.current.load(imageUrl, (tex) => {
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      material.uniforms.uTexture.value = tex;
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // 5. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Update texture dynamically when project image changes
  useEffect(() => {
    if (materialRef.current && imageUrl) {
      textureLoader.current.load(imageUrl, (tex) => {
        materialRef.current!.uniforms.uTexture.value = tex;
      });
    }
  }, [imageUrl]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full pointer-events-none touch-pan-y"
    />
  );
}
