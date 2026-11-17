import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeDCanvas({ className = '', style = {} }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Dimensions
    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 350;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 6.5);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Group for the 3D dish / cloche
    const clocheGroup = new THREE.Group();
    scene.add(clocheGroup);

    // Materials
    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0x263141, // Dark charcoal
      metalness: 0.8,
      roughness: 0.2,
    });

    const silverDomeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8f9fa, // Polished silver / chrome
      metalness: 0.9,
      roughness: 0.15,
    });

    const goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xf58237, // Brand warm orange / gold
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x3d1a00,
    });

    // 1. Serving Plate Base
    const plateGeo = new THREE.CylinderGeometry(2.2, 1.8, 0.15, 64);
    const plate = new THREE.Mesh(plateGeo, plateMaterial);
    plate.position.y = -0.5;
    plate.receiveShadow = true;
    clocheGroup.add(plate);

    // Plate Outer Rim
    const rimGeo = new THREE.TorusGeometry(2.2, 0.08, 16, 64);
    const rim = new THREE.Mesh(rimGeo, goldAccentMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = -0.42;
    clocheGroup.add(rim);

    // 2. Dome (Hemisphere)
    const domeGeo = new THREE.SphereGeometry(1.6, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const dome = new THREE.Mesh(domeGeo, silverDomeMaterial);
    dome.position.y = -0.42;
    dome.castShadow = true;
    clocheGroup.add(dome);

    // Dome Lower Trim Ring
    const trimGeo = new THREE.TorusGeometry(1.6, 0.06, 16, 64);
    const trim = new THREE.Mesh(trimGeo, goldAccentMaterial);
    trim.rotation.x = Math.PI / 2;
    trim.position.y = -0.42;
    clocheGroup.add(trim);

    // 3. Top Knob Handle
    const knobStemGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.35, 32);
    const knobStem = new THREE.Mesh(knobStemGeo, goldAccentMaterial);
    knobStem.position.y = 1.25;
    clocheGroup.add(knobStem);

    const knobTopGeo = new THREE.SphereGeometry(0.24, 32, 32);
    const knobTop = new THREE.Mesh(knobTopGeo, goldAccentMaterial);
    knobTop.position.y = 1.48;
    clocheGroup.add(knobTop);

    // 4. Steam / Aroma Particles
    const particleCount = 45;
    const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      emissive: 0xf58237,
      emissiveIntensity: 0.3,
    });

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      p.position.set(
        (Math.random() - 0.5) * 2.2,
        0.5 + Math.random() * 2.5,
        (Math.random() - 0.5) * 2.2
      );
      p.userData = {
        speedY: 0.008 + Math.random() * 0.012,
        driftX: (Math.random() - 0.5) * 0.006,
        driftZ: (Math.random() - 0.5) * 0.006,
        initialY: 0.5 + Math.random() * 0.5,
        maxY: 3.2,
      };
      scene.add(p);
      particles.push(p);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const warmLight = new THREE.PointLight(0xf58237, 2.5, 10);
    warmLight.position.set(-3, 2, 3);
    scene.add(warmLight);

    const rimLight = new THREE.DirectionalLight(0x70c0ff, 1.2);
    rimLight.position.set(-5, -2, -5);
    scene.add(rimLight);

    // Mouse Interaction
    let targetRotationX = 0.2;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotationY = x * 0.7;
      targetRotationX = 0.2 - y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Cloche rotation & floating bob
      clocheGroup.rotation.y += (targetRotationY - clocheGroup.rotation.y) * 0.05;
      clocheGroup.rotation.x += (targetRotationX - clocheGroup.rotation.x) * 0.05;
      clocheGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Gentle auto-rotation
      targetRotationY += 0.004;

      // Animate aroma particles
      particles.forEach((p) => {
        p.position.y += p.userData.speedY;
        p.position.x += p.userData.driftX + Math.sin(elapsedTime + p.position.y) * 0.003;
        p.position.z += p.userData.driftZ;

        // Reset if reached ceiling
        if (p.position.y > p.userData.maxY) {
          p.position.y = p.userData.initialY;
          p.position.x = (Math.random() - 0.5) * 1.6;
          p.position.z = (Math.random() - 0.5) * 1.6;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      plateGeo.dispose();
      rimGeo.dispose();
      domeGeo.dispose();
      trimGeo.dispose();
      knobStemGeo.dispose();
      knobTopGeo.dispose();
      particleGeo.dispose();
      plateMaterial.dispose();
      silverDomeMaterial.dispose();
      goldAccentMaterial.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '340px',
        position: 'relative',
        cursor: 'grab',
        ...style,
      }}
    />
  );
}
