'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface OrbitingNodeProps {
  name: string;
  radius: number;
  speed: number;
  yOffset: number;
  phase: number;
}

function OrbitingNode({ name, radius, speed, yOffset, phase }: OrbitingNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + phase;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    // Add dynamic vertical floating motion
    const y = yOffset + Math.sin(t * 1.8) * 0.08;
    
    if (meshRef.current) {
      meshRef.current.position.set(x, y, z);
    }
    
    // Update dynamic line connection from center [0,0,0] to orbiting node [x,y,z]
    if (lineRef.current) {
      const positions = lineRef.current.geometry.attributes.position.array as Float32Array;
      positions[0] = 0;
      positions[1] = 0;
      positions[2] = 0;
      positions[3] = x;
      positions[4] = y;
      positions[5] = z;
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Prepare line geometry once
  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(6); // 2 points * 3 coordinates
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  return (
    <group>
      {/* Thin connection wire from Center Node to Orbiting Node */}
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial 
          color={hovered ? '#FF4D73' : '#888888'} 
          linewidth={1} 
          transparent 
          opacity={hovered ? 0.7 : 0.2} 
        />
      </lineSegments>

      {/* Orbiting glowing node sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.25 : 1.0}
      >
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshPhysicalMaterial
          color={hovered ? '#FFFFFF' : '#FF4D73'}
          roughness={0.1}
          metalness={0.2}
          clearcoat={1.0}
          emissive={hovered ? '#FF4D73' : '#FF4D73'}
          emissiveIntensity={hovered ? 2.0 : 0.5}
        />
        
        {/* HTML Hover Label */}
        <Html
          position={[0, 0.12, 0]}
          center
          distanceFactor={3}
          className="pointer-events-none select-none"
        >
          <div className={`px-1.5 py-0.5 rounded text-[7px] font-serif tracking-wider bg-white select-none whitespace-nowrap transition-all duration-200 border ${
            hovered ? 'text-[#FF4D73] border-[#FF4D73]/40 scale-105 font-bold' : 'text-[#666666] border-[#ECECEC]'
          }`}>
            {name}
          </div>
        </Html>
      </mesh>
    </group>
  );
}

function CenterNode() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Breathe animation
    const scale = (hovered ? 1.2 : 1.0) + Math.sin(t * 1.5) * 0.04;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.1, 24, 24]} />
      <meshPhysicalMaterial
        color={hovered ? '#FFFFFF' : '#FF4D73'}
        roughness={0.05}
        metalness={0.3}
        clearcoat={1.0}
        emissive="#FF4D73"
        emissiveIntensity={hovered ? 2.5 : 1.5}
      />
      <Html
        position={[0, 0.2, 0]}
        center
        distanceFactor={3}
        className="pointer-events-none select-none"
      >
        <div className="px-2 py-0.5 rounded border border-[#FF4D73]/25 text-[8px] font-bold font-serif tracking-wider bg-white text-[#FF4D73] select-none whitespace-nowrap shadow-sm uppercase">
          AI Research
        </div>
      </Html>
    </mesh>
  );
}

function GraphScene() {
  const sceneGroupRef = useRef<THREE.Group>(null);

  // Slow rotational drift of the entire scene coordinate space
  useFrame((state) => {
    if (!sceneGroupRef.current) return;
    sceneGroupRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });

  // Define exactly 6 orbiting nodes symmetrically distributed in phases
  const orbitingNodes = [
    { name: 'Papers', radius: 0.85, speed: 0.2, yOffset: -0.1, phase: 0 },
    { name: 'Models', radius: 1.05, speed: 0.16, yOffset: 0.2, phase: Math.PI / 3 },
    { name: 'Datasets', radius: 0.95, speed: 0.22, yOffset: -0.2, phase: 2 * Math.PI / 3 },
    { name: 'Benchmarks', radius: 1.1, speed: 0.14, yOffset: 0.05, phase: Math.PI },
    { name: 'Authors', radius: 0.8, speed: 0.25, yOffset: -0.05, phase: 4 * Math.PI / 3 },
    { name: 'Organizations', radius: 1.0, speed: 0.18, yOffset: 0.25, phase: 5 * Math.PI / 3 }
  ];

  return (
    <group ref={sceneGroupRef}>
      {/* Center node */}
      <CenterNode />

      {/* Orbiting nodes with connection lines */}
      {orbitingNodes.map((node) => (
        <OrbitingNode
          key={node.name}
          name={node.name}
          radius={node.radius}
          speed={node.speed}
          yOffset={node.yOffset}
          phase={node.phase}
        />
      ))}
    </group>
  );
}

export default function ResearchGraph3D() {
  return (
    <div className="w-full h-full min-h-[90px] max-h-[120px] aspect-square relative flex items-center justify-center cursor-grab active:cursor-grabbing bg-transparent">
      <Canvas
        camera={{ position: [0, 0.3, 2.2], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#FF4D73" />
        <directionalLight position={[0, 4, 1]} intensity={0.8} />

        <GraphScene />

        <OrbitControls
          enableZoom={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
}
