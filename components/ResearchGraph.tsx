'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, FlaskConical, Cpu, Database, BarChart3, Code2, Network } from 'lucide-react';

interface NodeItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  iconColor: string;
  r: number; // radius of orbit
  angle: number; // current angle in degrees
}

export default function ResearchGraph() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Define graph nodes with their orbit configurations
  const nodes: NodeItem[] = [
    { id: 'papers', name: 'Papers', icon: FileText, color: 'border-pink-200 hover:border-pink-400 bg-white text-[#FF4D73]', iconColor: 'text-[#FF4D73]', r: 80, angle: 10 },
    { id: 'authors', name: 'Authors', icon: Users, color: 'border-rose-200 hover:border-rose-400 bg-white text-rose-500', iconColor: 'text-rose-500', r: 135, angle: 55 },
    { id: 'labs', name: 'Labs', icon: FlaskConical, color: 'border-pink-200 hover:border-pink-400 bg-white text-pink-500', iconColor: 'text-pink-500', r: 85, angle: 110 },
    { id: 'models', name: 'Models', icon: Cpu, color: 'border-blue-200 hover:border-blue-400 bg-white text-blue-500', iconColor: 'text-blue-500', r: 140, angle: 160 },
    { id: 'datasets', name: 'Datasets', icon: Database, color: 'border-emerald-200 hover:border-emerald-400 bg-white text-emerald-500', iconColor: 'text-emerald-500', r: 85, angle: 215 },
    { id: 'benchmarks', name: 'Benchmarks', icon: BarChart3, color: 'border-rose-200 hover:border-rose-400 bg-white text-rose-500', iconColor: 'text-rose-500', r: 135, angle: 270 },
    { id: 'repositories', name: 'Repositories', icon: Code2, color: 'border-cyan-200 hover:border-cyan-400 bg-white text-cyan-500', iconColor: 'text-cyan-500', r: 90, angle: 320 }
  ];

  const centerCoord = { x: 200, y: 200 };

  const getCoordinates = (r: number, angleDegrees: number) => {
    const angleRadians = (angleDegrees * Math.PI) / 180;
    return {
      x: centerCoord.x + r * Math.cos(angleRadians),
      y: centerCoord.y + r * Math.sin(angleRadians)
    };
  };

  return (
    <div className="w-full max-w-[420px] mx-auto aspect-square relative flex items-center justify-center">
      {/* Background radial soft light */}
      <div className="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none scale-90" />

      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-sm select-none overflow-visible">
        {/* Concentric orbit rings */}
        <circle cx={centerCoord.x} cy={centerCoord.y} r="85" fill="none" stroke="#F3E5DC" strokeWidth="1" strokeDasharray="4 6" className="opacity-80" />
        <circle cx={centerCoord.x} cy={centerCoord.y} r="135" fill="none" stroke="#F3E5DC" strokeWidth="1" strokeDasharray="3 8" className="opacity-60" />

        {/* Orbiting nodes lines & connections */}
        {nodes.map((node, idx) => {
          const { x, y } = getCoordinates(node.r, node.angle);
          const isHovered = hoveredNode === node.id;
          const isAnyHovered = hoveredNode !== null;

          return (
            <g key={node.id}>
              {/* Connection Line */}
              <motion.line
                x1={centerCoord.x}
                y1={centerCoord.y}
                x2={x}
                y2={y}
                stroke={isHovered ? '#FF4D73' : '#F3E5DC'}
                strokeWidth={isHovered ? '2' : '1'}
                strokeDasharray={isHovered ? 'none' : '4 4'}
                animate={{
                  strokeDashoffset: isHovered ? [0, -10] : 0
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: 'linear'
                }}
                className="transition-colors duration-300"
              />

              {/* Particle indicator moving along the line */}
              {!isAnyHovered && (
                <motion.circle
                  r="2.5"
                  fill="#FF708F"
                  animate={{
                    cx: [centerCoord.x, x],
                    cy: [centerCoord.y, y],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + (idx % 3) * 0.8,
                    ease: 'easeInOut'
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Pulsing center node glow effect */}
        <motion.circle
          cx={centerCoord.x}
          cy={centerCoord.y}
          r="42"
          fill="url(#centerGlow)"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'easeInOut'
          }}
        />

        {/* SVG Gradients definitions */}
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FF8A5B" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFF9F5" stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#FF8A5B" />
          </linearGradient>
        </defs>

        {/* Center Node */}
        <motion.g
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer"
        >
          {/* Inner ring */}
          <circle
            cx={centerCoord.x}
            cy={centerCoord.y}
            r="28"
            fill="url(#primaryGrad)"
            className="shadow-inner"
          />
          {/* Central Icon */}
          <foreignObject x={centerCoord.x - 12} y={centerCoord.y - 12} width="24" height="24" className="pointer-events-none">
            <Network className="text-white animate-pulse" size={24} />
          </foreignObject>
        </motion.g>

        {/* Orbiting Nodes */}
        {nodes.map((node) => {
          const { x, y } = getCoordinates(node.r, node.angle);
          const isHovered = hoveredNode === node.id;
          
          return (
            <motion.g
              key={node.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              animate={{
                y: [0, -3, 0, 3, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4 + (node.angle % 3),
                ease: 'easeInOut'
              }}
            >
              {/* Node background shadow circle */}
              <circle
                cx={x}
                cy={y}
                r="20"
                fill="#FFF9F5"
                className="opacity-40"
              />
              
              {/* Node border/fill circle */}
              <motion.circle
                cx={x}
                cy={y}
                r="18"
                fill={isHovered ? 'url(#primaryGrad)' : '#FFFFFF'}
                stroke={isHovered ? '#FF6B35' : '#F3E5DC'}
                strokeWidth="1.5"
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.2 }}
                className="shadow-sm"
              />

              {/* Node Icon */}
              <foreignObject x={x - 10} y={y - 10} width="20" height="20" className="pointer-events-none">
                <node.icon 
                  className={`transition-colors duration-200 ${
                    isHovered ? 'text-white' : node.iconColor
                  }`} 
                  size={20} 
                />
              </foreignObject>

              {/* Tooltip text when hovered */}
              {isHovered && (
                <g>
                  {/* Tooltip rect */}
                  <rect
                    x={x - 45}
                    y={y - 42}
                    width="90"
                    height="20"
                    rx="6"
                    fill="#111827"
                    className="shadow-lg"
                  />
                  {/* Tooltip text */}
                  <text
                    x={x}
                    y={y - 28}
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {node.name}
                  </text>
                </g>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
