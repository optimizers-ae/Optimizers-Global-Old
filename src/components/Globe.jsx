import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { UAE_PLANAR_DOTS } from './uaePlanarDots';

/**
 * 3D Stylized Tech Globe Component
 * - Stylized Futuristic Aesthetic (Not realistic satellite photo; sleek digital cyber aesthetic)
 * - Theme Palette: #3DADEC (Cyan), #e26d22 (Orange), #363636 (Charcoal)
 * - Fixed Full-Viewport Scroll Transition (Physically glides & shifts across sections as user scrolls)
 * - Smooth Cursor Following & Tilt
 * - 100% Mathematically Flawless Sphere & Zero Border Artifacts
 */
const Globe = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // --- Theme Palette ---
    const COLOR_CYAN = 0x3dadec;     // #3DADEC
    const COLOR_ORANGE = 0xe26d22;   // #e26d22
    const COLOR_CHARCOAL = 0x242424; // #242424
    const COLOR_DEEP_OCEAN = 0x11161d;


    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 1000);

    // --- WebGL Renderer ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.75;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x263d56, 3.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.4);
    mainLight.position.set(3, 6, 4);
    scene.add(mainLight);

    const cyanLight = new THREE.PointLight(COLOR_CYAN, 5.5, 40);
    cyanLight.position.set(-4, -1, 4);
    scene.add(cyanLight);
    const orangeLight = new THREE.PointLight(COLOR_ORANGE, 5.0, 40);
    orangeLight.position.set(5, 3, -4);
    scene.add(orangeLight);

    // --- Master Pivot Group ---
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const earthRadius = 1.5;

    // Helper: Create Luminous Glowing Matrix Dot Texture (Radiant White/Cyan Core + Smooth Bloom Aura)
    const createDotTexture = () => {
      dotCanvas.width = 128;
      dotCanvas.height = 128;
      const ctx = dotCanvas.getContext('2d');

      ctx.clearRect(0, 0, 128, 128);

      // 1. Soft Outer Luminous Cyan Bloom Aura
      const outerBloom = ctx.createRadialGradient(64, 64, 18, 64, 64, 52);
      outerBloom.addColorStop(0, 'rgba(61, 173, 236, 0.75)');
      outerBloom.addColorStop(0.45, 'rgba(61, 173, 236, 0.35)');
      outerBloom.addColorStop(1, 'rgba(61, 173, 236, 0.0)');
      ctx.fillStyle = outerBloom;
      ctx.beginPath();
      ctx.arc(64, 64, 52, 0, Math.PI * 2);
      ctx.fill();

      // 2. High-Tech Cyber Cyan Ring Accent
      const midGrad = ctx.createRadialGradient(64, 64, 8, 64, 64, 28);
      midGrad.addColorStop(0, 'rgba(127, 227, 255, 1.0)');
      midGrad.addColorStop(0.7, 'rgba(61, 173, 236, 0.95)');
      midGrad.addColorStop(1, 'rgba(40, 130, 200, 0.8)');
      ctx.fillStyle = midGrad;
      ctx.beginPath();
      ctx.arc(64, 64, 26, 0, Math.PI * 2);
      ctx.fill();

      // 3. Crisp Brilliant White-Cyan Core (Gives intense sharpness and luxury high-tech fidelity)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(64, 64, 14, 0, Math.PI * 2);
      ctx.fill();

      const texture = new THREE.CanvasTexture(dotCanvas);
      return texture;
    };

    const dotTexture = createDotTexture();

    // --- Textures: Stylized Dark Digital Landmask ---
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    // High contrast dark stylized landmask
    const earthDarkMap = textureLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-dark.jpg'
    );
    const earthBumpMap = textureLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-topology.png'
    );

    // 1. Stylized Core Earth (Dark charcoal land with luminous cyan emissive matrix)
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 96, 96);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthDarkMap,
      bumpMap: earthBumpMap,
      bumpScale: 0.04,
      roughness: 0.42,
      metalness: 0.45,
      color: new THREE.Color(0x354c68),
      emissive: new THREE.Color(0x182c42),
      emissiveIntensity: 0.85,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earth);

    // 2. Futuristic Digital Dot-Matrix Outer Shell
    const createDotMatrixShell = () => {
      const dotCount = isMobile ? 1200 : 2800;
      const dotGeo = new THREE.BufferGeometry();
      const dotPositions = new Float32Array(dotCount * 3);
      const dotColors = new Float32Array(dotCount * 3);
      const r = earthRadius + 0.008;

      const cyanColor = new THREE.Color(COLOR_CYAN);
      const orangeColor = new THREE.Color(COLOR_ORANGE);

      for (let i = 0; i < dotCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        dotPositions[i * 3] = x;
        dotPositions[i * 3 + 1] = y;
        dotPositions[i * 3 + 2] = z;

        const isOrange = Math.random() > 0.82;
        const color = isOrange ? orangeColor : cyanColor;
        dotColors[i * 3] = color.r;
        dotColors[i * 3 + 1] = color.g;
        dotColors[i * 3 + 2] = color.b;
      }

      dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
      dotGeo.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));

      const dotMat = new THREE.PointsMaterial({
        size: 0.024,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      });

      return new THREE.Points(dotGeo, dotMat);
    };
    globeGroup.add(createDotMatrixShell());

    // 3. Glowing Coordinate Tech Grid (#3DADEC)
    const createGrid = () => {
      const gridGroup = new THREE.Group();
      const r = earthRadius + 0.006;
      const segments = 64;

      // Meridians
      for (let i = 0; i < 18; i++) {
        const lon = (i / 18) * Math.PI * 2;
        const pts = [];
        for (let j = 0; j <= segments; j++) {
          const lat = -Math.PI / 2 + (j / segments) * Math.PI;
          pts.push(
            new THREE.Vector3(
              r * Math.cos(lat) * Math.cos(lon),
              r * Math.sin(lat),
              r * Math.cos(lat) * Math.sin(lon)
            )
          );
        }
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({
          color: COLOR_CYAN,
          opacity: 0.16,
          transparent: true,
        });
        gridGroup.add(new THREE.Line(geom, mat));
      }

      // Parallels
      for (let i = 1; i < 12; i++) {
        const lat = -Math.PI / 2 + (i / 12) * Math.PI;
        const radiusLat = r * Math.cos(lat);
        const y = r * Math.sin(lat);
        const pts = [];
        for (let j = 0; j <= segments; j++) {
          const lon = (j / segments) * Math.PI * 2;
          pts.push(new THREE.Vector3(radiusLat * Math.cos(lon), y, radiusLat * Math.sin(lon)));
        }
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({
          color: COLOR_CYAN,
          opacity: 0.1,
          transparent: true,
        });
        gridGroup.add(new THREE.Line(geom, mat));
      }
      return gridGroup;
    };
    globeGroup.add(createGrid());

    // 4. Smooth Borderless Atmosphere Halo Shader
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const worldUp = new THREE.Vector3(0, 1, 0);
    const tangentRight = new THREE.Vector3().crossVectors(worldUp, heroVisibleNormal).normalize();
    const tangentUp = new THREE.Vector3().crossVectors(heroVisibleNormal, tangentRight).normalize();

    // Map physical scale - calibrated to fit 100% on the visible dome without cutoff
    const mapScale = 0.95;
    const uaeRadius = earthRadius + 0.015;
    const dotPositions = [];

    UAE_PLANAR_DOTS.forEach(([u, v]) => {
      // Tangent plane position
      const p = centerPos.clone()
        .addScaledVector(tangentRight, u * mapScale)
        .addScaledVector(tangentUp, v * mapScale);

      // Project smoothly onto the sphere surface
      const pSphere = p.normalize().multiplyScalar(uaeRadius);
      dotPositions.push(pSphere.x, pSphere.y, pSphere.z);
    });

    const uaeDotsGeometry = new THREE.BufferGeometry();
    uaeDotsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));

    const baseDotSize = isMobile ? 0.048 : 0.062;
    const uaeDotsMaterial = new THREE.PointsMaterial({
      size: baseDotSize,
      map: dotTexture,
      transparent: true,
      opacity: 0.98,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const uaePoints = new THREE.Points(uaeDotsGeometry, uaeDotsMaterial);
    globeGroup.add(uaePoints);

    // 5. Global Cities & Pulsating Hubs
    const latLngToVector3 = (lat, lng, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    const hubs = [
      { name: 'New York', lat: 40.7128, lng: -74.006, color: COLOR_ORANGE },
      { name: 'San Francisco', lat: 37.7749, lng: -122.4194, color: COLOR_CYAN },
      { name: 'London', lat: 51.5074, lng: -0.1278, color: COLOR_CYAN },
      { name: 'Frankfurt', lat: 50.1109, lng: 8.6821, color: COLOR_ORANGE },
      { name: 'Dubai', lat: 25.2048, lng: 55.2708, color: COLOR_ORANGE },
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503, color: COLOR_CYAN },
      { name: 'Singapore', lat: 1.3521, lng: 103.8198, color: COLOR_ORANGE },
      { name: 'Sydney', lat: -33.8688, lng: 151.2093, color: COLOR_CYAN },
      { name: 'São Paulo', lat: -23.5505, lng: -46.6333, color: COLOR_ORANGE },
      { name: 'Mumbai', lat: 19.076, lng: 72.8777, color: COLOR_CYAN },
      { name: 'Cape Town', lat: -33.9249, lng: 18.4241, color: COLOR_ORANGE },
      { name: 'Toronto', lat: 43.6532, lng: -79.3832, color: COLOR_CYAN },
      { name: 'Seoul', lat: 37.5665, lng: 126.978, color: COLOR_ORANGE },
      { name: 'Paris', lat: 48.8566, lng: 2.3522, color: COLOR_CYAN },
    ];

    const pointsGroup = new THREE.Group();
    const pointPositions = [];
    const rippleRings = [];

    hubs.forEach((hub) => {
      const pos = latLngToVector3(hub.lat, hub.lng, earthRadius + 0.015);
      pointPositions.push(pos);

      // Glowing Center Point
      const beaconGeo = new THREE.SphereGeometry(0.028, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: hub.color,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.copy(pos);
      pointsGroup.add(beaconMesh);

      // Inner Core
      const coreGeo = new THREE.SphereGeometry(0.012, 8, 8);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, blending: THREE.AdditiveBlending });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.copy(pos);
      pointsGroup.add(coreMesh);
    });
    globeGroup.add(pointsGroup);

    // 6. Glowing Orange & Cyan Data Arcs (#e26d22 & #3DADEC)
    const arcsGroup = new THREE.Group();
    const arcCurves = [];
    const connections = [
      [0, 1, COLOR_ORANGE],
      [0, 2, COLOR_CYAN],
      [0, 11, COLOR_CYAN],
      [0, 8, COLOR_ORANGE],
      [2, 3, COLOR_ORANGE],
      [2, 13, COLOR_CYAN],
      [3, 4, COLOR_ORANGE],
      [4, 9, COLOR_CYAN],
      [4, 6, COLOR_ORANGE],
      [9, 6, COLOR_CYAN],
      [6, 5, COLOR_CYAN],
      [5, 12, COLOR_ORANGE],
      [5, 7, COLOR_CYAN],
      [6, 7, COLOR_ORANGE],
      [1, 5, COLOR_CYAN],
      [3, 10, COLOR_ORANGE],
    ];

    connections.forEach(([i1, i2, arcColor]) => {
      if (!pointPositions[i1] || !pointPositions[i2]) return;
      const p1 = pointPositions[i1];
      const p2 = pointPositions[i2];
      const dist = p1.distanceTo(p2);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const altitude = 1.0 + dist * 0.45;
      const control = mid.clone().normalize().multiplyScalar(earthRadius * altitude);

      const curve = new THREE.QuadraticBezierCurve3(p1, control, p2);
      const pts = curve.getPoints(50);
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: arcColor,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      arcsGroup.add(new THREE.Line(geom, mat));
      arcCurves.push({ curve, speed: 0.3 + Math.random() * 0.35, color: arcColor });
    });
    globeGroup.add(arcsGroup);

    // 7. Flowing Light Packets along Arcs
    const travelParticles = [];
    const packetGeo = new THREE.SphereGeometry(0.026, 8, 8);
    const packetCount = isMobile ? 8 : 18;

    for (let i = 0; i < packetCount; i++) {
      const arc = arcCurves[i % arcCurves.length];
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? COLOR_ORANGE : 0xffffff,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      });
      const particle = new THREE.Mesh(packetGeo, mat);
      const t = (i / packetCount) % 1;
      particle.position.copy(arc.curve.getPoint(t));
      particle.userData = { arc, t, speed: arc.speed };
      travelParticles.push(particle);
      globeGroup.add(particle);
    }

    // 8. Orbiting Star Constellations
    const orbitGroup = new THREE.Group();
    const orbitCount = isMobile ? 30 : 60;
    const orbitParticles = [];

    for (let i = 0; i < orbitCount; i++) {
      const radius = earthRadius + 0.35 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const geo = new THREE.SphereGeometry(0.012 + Math.random() * 0.016, 6, 6);
      const isOrange = Math.random() > 0.65;
      const mat = new THREE.MeshBasicMaterial({
        color: isOrange ? COLOR_ORANGE : COLOR_CYAN,
        transparent: true,
        opacity: 0.5 + Math.random() * 0.5,
        blending: THREE.AdditiveBlending,
      });

      const particle = new THREE.Mesh(geo, mat);
      particle.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      particle.userData = { radius, theta, phi, speed: 0.08 + Math.random() * 0.15 };
      orbitGroup.add(particle);
      orbitParticles.push(particle);
    }
    globeGroup.add(orbitGroup);

    // 9. Stars Deep Space Particles
    const starCount = isMobile ? 200 : 450;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 16 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);
    }
    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: COLOR_CYAN,
      size: 0.14,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeom, starMat);
    scene.add(stars);

    // --- 10. Mouse Cursor Tracking & Scroll-Driven Physical Shift ---
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let dragOffset = { x: 0, y: 0 };

    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    const onPointerMove = (e) => {
      if (prefersReducedMotion) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (clientX === undefined || clientY === undefined) return;

      if (isDragging) {
        const deltaX = clientX - dragStart.x;
        const deltaY = clientY - dragStart.y;
        dragOffset.y += deltaX * 0.005;
        dragOffset.x += deltaY * 0.005;
        dragStart = { x: clientX, y: clientY };
      } else {
        const normX = (clientX / window.innerWidth) * 2 - 1;
        const normY = -(clientY / window.innerHeight) * 2 + 1;
        targetRotationY = normX * 0.85;
        targetRotationX = -normY * 0.65;
      }
    };

    const onPointerDown = (e) => {
      isDragging = true;
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      dragStart = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight || 800;
      // Scroll progress from 0 (Hero) to 1.0 (Services) to 2.0+ (Content)
      targetScrollProgress = Math.max(0, scrollY / (vh * 0.85));
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    // --- 11. Full-Window Resize Handler ---
    const handleResize = () => {
      if (!canvas || !renderer || !camera) return;
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.position.set(0, 0, window.innerWidth < 768 ? 6.2 : 5.0);
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // --- 12. Main 60FPS Animation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = performance.now() * 0.001;

      if (!prefersReducedMotion) {
        // Cursor damping
        currentRotationX += (targetRotationX + dragOffset.x - currentRotationX) * 0.06;
        currentRotationY += (targetRotationY + dragOffset.y - currentRotationY) * 0.06;

        // Smooth Scroll Interpolation
        currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.07;
        const p = currentScrollProgress;

        // PHYSICAL SCROLL MOTION:
        // Hero (p = 0): Globe is at (0, 0, 0)
        // Services (p = 1): Globe glides smoothly down and to the right side
        // About (p > 1.5): Globe docks elegantly as ambient anchor
        if (window.innerWidth >= 1024) {
          // Hero (p=0): dynamic bottom-right corner arc
          // Services (p=1): smoothly transitions and docks alongside services cards
          const targetX = initialX + Math.min(p, 1.2) * 0.10;
          const targetY = initialY + Math.min(p, 1.2) * 0.70 + Math.sin(time * 0.8) * 0.03;
          const targetScale = initialScale + Math.min(p, 1.0) * 0.10;

          globeGroup.position.x = targetX;
          globeGroup.position.y = targetY;
          globeGroup.scale.set(targetScale, targetScale, targetScale);
        } else {
          // Mobile: glide upward into background on scroll
          const targetY = initialY + Math.min(p, 1.2) * 0.65 + Math.sin(time * 0.8) * 0.03;
          globeGroup.position.x = initialX;
          globeGroup.position.y = targetY;
          const targetScale = initialScale + Math.min(p, 1.0) * 0.10;
          globeGroup.scale.set(targetScale, targetScale, targetScale);
        }

        // Auto spin + scroll spin boost
        globeGroup.rotation.y = currentRotationY + time * 0.14 + p * 2.0;
        globeGroup.rotation.x = currentRotationX + p * 0.2;
      }

      // Pulse Beacons
      pointsGroup.children.forEach((child, idx) => {
        if (child.material) {
          const s = 1 + Math.sin(time * 3.5 + idx) * 0.22;
          child.scale.set(s, s, s);
        }
      });

      // Flowing Light Packets along Arcs
      travelParticles.forEach((particle) => {
        const data = particle.userData;
        if (data && data.arc) {
          data.t += delta * data.speed * 0.65;
          if (data.t > 1) {
            data.t = 0;
            if (arcCurves.length > 0) {
              data.arc = arcCurves[Math.floor(Math.random() * arcCurves.length)];
            }
          }
          particle.position.copy(data.arc.curve.getPoint(data.t));
          const fade = Math.sin(data.t * Math.PI);
          particle.material.opacity = 0.2 + fade * 0.8;
        }
      });

      // Orbiting Particles
      orbitParticles.forEach((p) => {
        const data = p.userData;
        if (!prefersReducedMotion) {
          data.theta += data.speed * delta * 2;
          data.phi += 0.015 * delta;
        }
        const r = data.radius;
        p.position.set(
          r * Math.sin(data.phi) * Math.cos(data.theta),
          r * Math.sin(data.phi) * Math.sin(data.theta),
          r * Math.cos(data.phi)
        );
      });

      // Atmosphere Pulsing
      if (atmosphereMaterial.uniforms) {
        atmosphereMaterial.uniforms.intensity.value = 0.85 + Math.sin(time * 1.8) * 0.15;
      }

      // Background Star Rotation
      stars.rotation.y += 0.00012;

      renderer.render(scene, camera);
    };



    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);

      earthGeometry.dispose();
      earthMaterial.dispose();
      atmosphereMaterial.dispose();
      starGeom.dispose();
      starMat.dispose();
      earthDarkMap.dispose();
      earthBumpMap.dispose();
      dotTexture.dispose();
      uaeDotsGeometry.dispose();
      uaeDotsMaterial.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-10 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-auto cursor-grab active:cursor-grabbing touch-none outline-none border-0"
      />
    </div>
  );
};

export default Globe;

