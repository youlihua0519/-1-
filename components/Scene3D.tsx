
import React, { useEffect, useRef } from 'react';
import * as THREE from 'theme';
import * as THREE_CORE from 'three';
import { AppState } from '../types';
import { COLORS, PARTICLE_COUNT, PHOTO_COUNT, PHOTO_URLS } from '../constants';

const THREE = THREE_CORE;

interface Scene3DProps {
  appState: AppState;
  currentPhotoIndex: number;
}

const Scene3D: React.FC<Scene3DProps> = ({ appState, currentPhotoIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const treeParticlesRef = useRef<THREE.Points | null>(null);
  const photosRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<THREE.InstancedMesh | null>(null);
  const starRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<number>(0);

  const appStateRef = useRef(appState);
  const currentPhotoIndexRef = useRef(currentPhotoIndex);

  useEffect(() => {
    appStateRef.current = appState;
  }, [appState]);

  useEffect(() => {
    currentPhotoIndexRef.current = currentPhotoIndex;
  }, [currentPhotoIndex]);

  const photoTextures = useRef<THREE.Texture[]>([]);
  const targetPositions = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
  const scatterPositions = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 20);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Load Real Photo Textures ---
    const loader = new THREE.TextureLoader();
    for (let i = 0; i < PHOTO_COUNT; i++) {
      const url = PHOTO_URLS[i] || `https://picsum.photos/id/${i + 20}/512/512`;
      const tex = loader.load(url);
      tex.encoding = THREE.sRGBEncoding;
      photoTextures.current.push(tex);
    }

    // --- Tree Particles ---
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const t = (i / PARTICLE_COUNT) * Math.PI * 24; 
      const y = (i / PARTICLE_COUNT) * 12; 
      const r = (12.5 - y) * 0.45; 

      targetPositions.current[i3] = Math.cos(t) * r;
      targetPositions.current[i3 + 1] = y - 6;
      targetPositions.current[i3 + 2] = Math.sin(t) * r;

      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      scatterPositions.current[i3] = (Math.random() - 0.5) * 60;
      scatterPositions.current[i3 + 1] = (Math.random() - 0.5) * 60;
      scatterPositions.current[i3 + 2] = (Math.random() - 0.5) * 60;

      const mixedColor = new THREE.Color(i % 10 === 0 ? COLORS.GOLD : (i % 3 === 0 ? COLORS.RED : COLORS.LIGHT_GREEN));
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.9,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    treeParticlesRef.current = particles;

    // --- Star ---
    const starGeom = new THREE.IcosahedronGeometry(1.0, 0);
    const starMat = new THREE.MeshStandardMaterial({ 
      color: COLORS.GOLD, 
      emissive: COLORS.GOLD, 
      emissiveIntensity: 2.5,
      metalness: 1, 
      roughness: 0.1 
    });
    const star = new THREE.Mesh(starGeom, starMat);
    star.position.y = 6.8;
    scene.add(star);
    starRef.current = star;

    // --- Lights ---
    const lightGeom = new THREE.SphereGeometry(0.1, 8, 8);
    const lightMat = new THREE.MeshBasicMaterial({ color: COLORS.WHITE });
    const instancedLights = new THREE.InstancedMesh(lightGeom, lightMat, 150);
    const tempMatrix = new THREE.Matrix4();
    for (let i = 0; i < 150; i++) {
        const t = (i / 150) * Math.PI * 18;
        const y = (i / 150) * 11.8;
        const r = (12.2 - y) * 0.48;
        tempMatrix.setPosition(Math.cos(t) * r, y - 5.8, Math.sin(t) * r);
        instancedLights.setMatrixAt(i, tempMatrix);
        instancedLights.setColorAt(i, new THREE.Color(i % 2 === 0 ? COLORS.RED : COLORS.GOLD));
    }
    scene.add(instancedLights);
    lightsRef.current = instancedLights;

    // --- Photos ---
    const photoGroup = new THREE.Group();
    const photoGeom = new THREE.PlaneGeometry(2.5, 2.5);
    for (let i = 0; i < PHOTO_COUNT; i++) {
      const mat = new THREE.MeshBasicMaterial({ 
        map: photoTextures.current[i], 
        side: THREE.DoubleSide, 
        transparent: true,
        opacity: 0
      });
      const photoMesh = new THREE.Mesh(photoGeom, mat);
      photoMesh.scale.set(0.01, 0.01, 0.01);
      photoGroup.add(photoMesh);
    }
    scene.add(photoGroup);
    photosRef.current = photoGroup;

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(15, 15, 15);
    scene.add(pointLight);

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
      const isScatter = appStateRef.current === AppState.SCATTER;

      // Particle Motion
      if (treeParticlesRef.current) {
        const posAttr = treeParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const speed = isScatter ? 0.04 : 0.08; 
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          let tx, ty, tz;
          if (isScatter) {
            tx = scatterPositions.current[i3];
            ty = scatterPositions.current[i3 + 1];
            tz = scatterPositions.current[i3 + 2];
          } else {
            tx = targetPositions.current[i3];
            ty = targetPositions.current[i3 + 1];
            tz = targetPositions.current[i3 + 2];
          }
          posAttr.array[i3] += (tx - posAttr.array[i3]) * speed;
          posAttr.array[i3 + 1] += (ty - posAttr.array[i3 + 1]) * speed;
          posAttr.array[i3 + 2] += (tz - posAttr.array[i3 + 2]) * speed;
        }
        posAttr.needsUpdate = true;
        treeParticlesRef.current.rotation.y += 0.001;
      }

      // Photos Animation
      if (photosRef.current) {
        photosRef.current.children.forEach((mesh, i) => {
          const m = mesh as THREE.Mesh;
          const mMat = m.material as THREE.MeshBasicMaterial;
          if (isScatter && i === currentPhotoIndexRef.current) {
            const camPos = cameraRef.current!.position.clone();
            const camDir = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRef.current!.quaternion);
            const focusPos = camPos.add(camDir.multiplyScalar(6));
            m.position.lerp(focusPos, 0.1);
            m.quaternion.slerp(cameraRef.current!.quaternion, 0.1);
            m.scale.lerp(new THREE.Vector3(1.8, 1.8, 1.8), 0.1);
            mMat.opacity = THREE.MathUtils.lerp(mMat.opacity, 1, 0.1);
          } else {
            const angle = (i / PHOTO_COUNT) * Math.PI * 2 + time * 0.2;
            const orbitPos = new THREE.Vector3(Math.cos(angle) * 8, (i / PHOTO_COUNT) * 12 - 6, Math.sin(angle) * 8);
            m.position.lerp(orbitPos, 0.05);
            m.lookAt(0, m.position.y, 0);
            m.scale.lerp(new THREE.Vector3(0.01, 0.01, 0.01), 0.1);
            mMat.opacity = THREE.MathUtils.lerp(mMat.opacity, 0, 0.1);
          }
        });
      }

      if (starRef.current) {
        starRef.current.rotation.y += 0.015;
        starRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.15);
        starRef.current.visible = !isScatter;
      }

      if (lightsRef.current) {
        lightsRef.current.rotation.y += 0.004;
        const color = new THREE.Color();
        for (let i = 0; i < 150; i++) {
          const intensity = Math.sin(time * 4 + i * 0.2) * 0.5 + 0.5;
          if (i % 2 === 0) color.set(COLORS.RED).multiplyScalar(intensity * 1.5);
          else color.set(COLORS.GOLD).multiplyScalar(intensity * 1.5);
          lightsRef.current.setColorAt(i, color);
        }
        if (lightsRef.current.instanceColor) lightsRef.current.instanceColor.needsUpdate = true;
        lightsRef.current.visible = !isScatter;
      }

      if (cameraRef.current) {
        const targetCamPos = isScatter ? new THREE.Vector3(0, 1, 14) : new THREE.Vector3(0, 4, 22);
        cameraRef.current.position.lerp(targetCamPos, 0.05);
        cameraRef.current.lookAt(0, 2, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      photoTextures.current.forEach(t => t.dispose());
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 bg-black" />;
};

export default Scene3D;
