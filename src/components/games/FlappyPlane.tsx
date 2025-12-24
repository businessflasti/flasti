'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface FlappyPlaneProps {
  onScoreUpdate: (score: number) => void;
  targetScore: number;
  onGameComplete: () => void;
}

type GameState = 'menu' | 'playing' | 'gameover';

export default function FlappyPlane({ onScoreUpdate, targetScore, onGameComplete }: FlappyPlaneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Load high score from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skyPilotHighScore');
      if (saved) setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const gameRef = useRef({
    plane: { x: 80, y: 200, velocity: 0, width: 40, height: 30 },
    buildings: [] as { x: number; topHeight: number; gap: number; passed: boolean }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    clouds: [] as { x: number; y: number; size: number; speed: number }[],
    frameId: 0,
    lastBuildingTime: 0,
  });

  const GRAVITY = 0.9;
  const JUMP_FORCE = -9;
  const BUILDING_SPEED = 6;
  const BUILDING_GAP = 100;
  const BUILDING_WIDTH = 80;
  const BUILDING_INTERVAL = 1000;

  const resetGame = useCallback(() => {
    const game = gameRef.current;
    game.plane = { x: 80, y: 200, velocity: 0, width: 40, height: 30 };
    game.buildings = [];
    game.particles = [];
    game.lastBuildingTime = 0;
    // Initialize clouds
    game.clouds = Array.from({ length: 5 }, () => ({
      x: Math.random() * 350,
      y: Math.random() * 150 + 50,
      size: Math.random() * 30 + 20,
      speed: Math.random() * 0.5 + 0.2
    }));
    setScore(0);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setGameState('playing');
  }, [resetGame]);

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      gameRef.current.plane.velocity = JUMP_FORCE;
      // Add jump particles
      const game = gameRef.current;
      for (let i = 0; i < 5; i++) {
        game.particles.push({
          x: game.plane.x,
          y: game.plane.y + game.plane.height / 2,
          vx: -Math.random() * 3 - 1,
          vy: (Math.random() - 0.5) * 2,
          life: 20,
          color: '#74b9ff'
        });
      }
    }
  }, [gameState]);

  const handleCanvasClick = () => {
    if (gameState === 'playing') {
      jump();
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      if (gameState === 'playing') {
        jump();
      }
    }
  }, [gameState, jump]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Save high score
  useEffect(() => {
    if (highScore > 0 && typeof window !== 'undefined') {
      localStorage.setItem('skyPilotHighScore', highScore.toString());
    }
  }, [highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const game = gameRef.current;

    const drawBackground = (timestamp: number) => {
      // Gradient sky
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f0c29');
      gradient.addColorStop(0.5, '#302b63');
      gradient.addColorStop(1, '#24243e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 80; i++) {
        const x = (i * 73 + timestamp * 0.005) % canvas.width;
        const y = (i * 37) % (canvas.height * 0.6);
        const size = (i % 3 === 0) ? 2 : 1;
        const alpha = 0.3 + Math.sin(timestamp * 0.003 + i) * 0.3;
        ctx.globalAlpha = alpha;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;

      // Clouds
      game.clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x < -cloud.size) cloud.x = canvas.width + cloud.size;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.6, cloud.y - cloud.size * 0.2, cloud.size * 0.7, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 1.2, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawBuilding = (building: typeof game.buildings[0]) => {
      // Top building
      const gradient1 = ctx.createLinearGradient(building.x, 0, building.x + BUILDING_WIDTH, 0);
      gradient1.addColorStop(0, '#1a1a2e');
      gradient1.addColorStop(0.3, '#16213e');
      gradient1.addColorStop(0.7, '#16213e');
      gradient1.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = gradient1;
      ctx.fillRect(building.x, 0, BUILDING_WIDTH, building.topHeight);
      
      // Building edge highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(building.x, 0, 2, building.topHeight);
      
      // Windows top building
      for (let row = 0; row < building.topHeight / 25; row++) {
        for (let col = 0; col < 3; col++) {
          const isLit = Math.random() > 0.4;
          ctx.fillStyle = isLit ? '#ffeaa7' : 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(building.x + 12 + col * 20, row * 25 + 8, 10, 14);
          if (isLit) {
            ctx.fillStyle = 'rgba(255, 234, 167, 0.3)';
            ctx.fillRect(building.x + 10 + col * 20, row * 25 + 6, 14, 18);
          }
        }
      }

      // Bottom building
      const bottomY = building.topHeight + building.gap;
      ctx.fillStyle = gradient1;
      ctx.fillRect(building.x, bottomY, BUILDING_WIDTH, canvas.height - bottomY);
      
      // Building edge highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(building.x, bottomY, 2, canvas.height - bottomY);
      
      // Windows bottom building
      for (let row = 0; row < (canvas.height - bottomY) / 25; row++) {
        for (let col = 0; col < 3; col++) {
          const isLit = Math.random() > 0.4;
          ctx.fillStyle = isLit ? '#ffeaa7' : 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(building.x + 12 + col * 20, bottomY + row * 25 + 8, 10, 14);
          if (isLit) {
            ctx.fillStyle = 'rgba(255, 234, 167, 0.3)';
            ctx.fillRect(building.x + 10 + col * 20, bottomY + row * 25 + 6, 14, 18);
          }
        }
      }

      // Antenna on top building
      ctx.fillStyle = '#2d3436';
      ctx.fillRect(building.x + BUILDING_WIDTH / 2 - 2, building.topHeight - 20, 4, 20);
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(building.x + BUILDING_WIDTH / 2, building.topHeight - 22, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawPlane = () => {
      ctx.save();
      ctx.translate(game.plane.x + game.plane.width / 2, game.plane.y + game.plane.height / 2);
      ctx.rotate(Math.min(Math.max(game.plane.velocity * 0.05, -0.5), 0.5));
      
      // Engine glow
      ctx.fillStyle = 'rgba(255, 165, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(-game.plane.width / 2 - 8, 0, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Body gradient
      const bodyGradient = ctx.createLinearGradient(0, -game.plane.height / 2, 0, game.plane.height / 2);
      bodyGradient.addColorStop(0, '#e74c3c');
      bodyGradient.addColorStop(0.5, '#c0392b');
      bodyGradient.addColorStop(1, '#922b21');
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, game.plane.width / 2, game.plane.height / 3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Body highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.ellipse(5, -5, game.plane.width / 3, game.plane.height / 6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Wings with gradient
      const wingGradient = ctx.createLinearGradient(0, -25, 0, 25);
      wingGradient.addColorStop(0, '#95a5a6');
      wingGradient.addColorStop(0.5, '#7f8c8d');
      wingGradient.addColorStop(1, '#95a5a6');
      ctx.fillStyle = wingGradient;
      ctx.fillRect(-5, -2, 15, 25);
      ctx.fillRect(-5, -23, 15, 21);
      
      // Wing details
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(-3, 0, 11, 2);
      ctx.fillRect(-3, -22, 11, 2);
      
      // Tail
      ctx.fillStyle = '#c0392b';
      ctx.beginPath();
      ctx.moveTo(-game.plane.width / 2, 0);
      ctx.lineTo(-game.plane.width / 2 - 12, -14);
      ctx.lineTo(-game.plane.width / 2 - 12, 14);
      ctx.closePath();
      ctx.fill();
      
      // Cockpit window
      const windowGradient = ctx.createRadialGradient(10, -2, 0, 10, -2, 8);
      windowGradient.addColorStop(0, '#a8e6cf');
      windowGradient.addColorStop(1, '#74b9ff');
      ctx.fillStyle = windowGradient;
      ctx.beginPath();
      ctx.ellipse(10, -2, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Window reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.ellipse(12, -4, 3, 2, -0.3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const drawParticles = () => {
      game.particles = game.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        
        ctx.globalAlpha = p.life / 20;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        return p.life > 0;
      });
    };

    const gameLoop = (timestamp: number) => {
      drawBackground(timestamp);

      if (gameState !== 'playing') {
        game.frameId = requestAnimationFrame(gameLoop);
        return;
      }

      // Physics
      game.plane.velocity += GRAVITY;
      game.plane.y += game.plane.velocity;

      // Generate buildings
      if (timestamp - game.lastBuildingTime > BUILDING_INTERVAL) {
        const minTop = 50;
        const maxTop = canvas.height - BUILDING_GAP - 100;
        const topHeight = Math.random() * (maxTop - minTop) + minTop;
        
        game.buildings.push({
          x: canvas.width,
          topHeight,
          gap: BUILDING_GAP,
          passed: false
        });
        game.lastBuildingTime = timestamp;
      }

      // Move and draw buildings
      game.buildings = game.buildings.filter(building => {
        building.x -= BUILDING_SPEED;
        drawBuilding(building);

        // Score
        if (!building.passed && building.x + BUILDING_WIDTH < game.plane.x) {
          building.passed = true;
          const newScore = score + 1;
          setScore(newScore);
          onScoreUpdate(newScore);
          
          // Score particles
          for (let i = 0; i < 8; i++) {
            game.particles.push({
              x: game.plane.x + game.plane.width,
              y: game.plane.y,
              vx: Math.random() * 4 + 1,
              vy: (Math.random() - 0.5) * 4,
              life: 25,
              color: '#ffeaa7'
            });
          }
          
          if (newScore >= targetScore) {
            onGameComplete();
          }
        }

        return building.x > -BUILDING_WIDTH;
      });

      drawParticles();
      drawPlane();

      // Collisions
      const planeBox = {
        x: game.plane.x + 5,
        y: game.plane.y + 5,
        width: game.plane.width - 10,
        height: game.plane.height - 10
      };

      // Border collision
      if (game.plane.y < 0 || game.plane.y + game.plane.height > canvas.height) {
        if (score > highScore) setHighScore(score);
        setGameState('gameover');
      }

      // Building collision
      for (const building of game.buildings) {
        const topBuilding = { x: building.x, y: 0, width: BUILDING_WIDTH, height: building.topHeight };
        const bottomBuilding = { x: building.x, y: building.topHeight + building.gap, width: BUILDING_WIDTH, height: canvas.height };

        if (
          (planeBox.x < topBuilding.x + topBuilding.width &&
           planeBox.x + planeBox.width > topBuilding.x &&
           planeBox.y < topBuilding.height) ||
          (planeBox.x < bottomBuilding.x + bottomBuilding.width &&
           planeBox.x + planeBox.width > bottomBuilding.x &&
           planeBox.y + planeBox.height > bottomBuilding.y)
        ) {
          if (score > highScore) setHighScore(score);
          setGameState('gameover');
        }
      }

      game.frameId = requestAnimationFrame(gameLoop);
    };

    game.frameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(game.frameId);
  }, [gameState, score, highScore, onScoreUpdate, targetScore, onGameComplete]);

  return (
    <div className="flex flex-col items-center" ref={containerRef} style={{ background: isFullscreen ? '#0f0c29' : 'transparent' }}>
      <div className="relative" style={{ width: isFullscreen ? '100vw' : 'auto', height: isFullscreen ? '100vh' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          width={350}
          height={500}
          onClick={handleCanvasClick}
          className="rounded-2xl cursor-pointer"
          style={{ 
            touchAction: 'manipulation',
            boxShadow: isFullscreen ? 'none' : '0 0 40px rgba(116, 185, 255, 0.3), 0 10px 30px rgba(0, 0, 0, 0.5)',
            maxHeight: isFullscreen ? '100vh' : 'auto',
            maxWidth: isFullscreen ? '100vw' : 'auto'
          }}
        />
        
        {/* Fullscreen button - siempre visible */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 hover:scale-110 z-20"
          style={{ 
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-white" />
          ) : (
            <Maximize2 className="w-5 h-5 text-white" />
          )}
        </button>
        
        {/* Menu de inicio */}
        {gameState === 'menu' && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
            style={{ 
              background: 'linear-gradient(180deg, rgba(15, 12, 41, 0.95) 0%, rgba(48, 43, 99, 0.95) 50%, rgba(36, 36, 62, 0.95) 100%)',
              backdropFilter: 'blur(4px)'
            }}
          >
            {/* Logo/Title */}
            <div className="relative mb-2">
              <div className="text-6xl mb-2" style={{ filter: 'drop-shadow(0 0 20px rgba(116, 185, 255, 0.5))' }}>✈️</div>
            </div>
            <h1 className="text-3xl font-black text-white mb-1 tracking-wider" style={{ textShadow: '0 0 20px rgba(116, 185, 255, 0.5)' }}>
              SKY PILOT
            </h1>
            <p className="text-gray-400 text-xs mb-6">Esquiva los rascacielos</p>
            
            {/* High Score */}
            <div className="mb-6 px-6 py-3 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-lg">🏆</span>
                <div>
                  <p className="text-gray-400 text-xs">RÉCORD</p>
                  <p className="text-white text-xl font-bold">{highScore}</p>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="mb-6 text-center">
              <p className="text-gray-400 text-xs">META</p>
              <p className="text-white text-lg font-bold">{targetScore} <span className="text-gray-400 text-sm font-normal">puntos</span></p>
            </div>
            
            {/* Play Button */}
            <button
              onClick={startGame}
              className="px-10 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
              }}
            >
              JUGAR
            </button>
            
            {/* Controls hint */}
            <p className="text-gray-500 text-xs mt-6">
              Toca la pantalla o presiona ESPACIO
            </p>
          </div>
        )}

        {/* Game Over */}
        {gameState === 'gameover' && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
            style={{ 
              background: 'linear-gradient(180deg, rgba(15, 12, 41, 0.95) 0%, rgba(48, 43, 99, 0.95) 50%, rgba(36, 36, 62, 0.95) 100%)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <div className="text-5xl mb-4" style={{ filter: 'drop-shadow(0 0 10px rgba(231, 76, 60, 0.5))' }}>💥</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">GAME OVER</h2>
            
            {/* Score display */}
            <div className="mb-4 text-center">
              <p className="text-gray-400 text-xs">PUNTUACIÓN</p>
              <p className="text-white text-4xl font-black">{score}</p>
            </div>
            
            {/* High score */}
            {score >= highScore && score > 0 && (
              <div className="mb-4 px-4 py-2 rounded-lg" style={{ background: 'rgba(255, 215, 0, 0.2)' }}>
                <p className="text-yellow-400 text-sm font-bold">🎉 ¡NUEVO RÉCORD!</p>
              </div>
            )}
            
            <div className="mb-6 px-4 py-2 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <p className="text-gray-400 text-xs">RÉCORD: <span className="text-white font-bold">{highScore}</span></p>
            </div>
            
            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={startGame}
                className="px-8 py-3 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
                }}
              >
                REINTENTAR
              </button>
              <button
                onClick={() => setGameState('menu')}
                className="px-8 py-3 rounded-xl text-gray-300 font-medium transition-all duration-300 hover:text-white"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                MENÚ
              </button>
            </div>
            
            <p className="text-gray-500 text-xs mt-4">
              Meta: {targetScore} puntos
            </p>
          </div>
        )}

        {/* Score durante el juego */}
        {gameState === 'playing' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div 
              className="px-5 py-2 rounded-full flex items-center gap-2"
              style={{ 
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <span className="text-white text-2xl font-black">{score}</span>
              <span className="text-gray-400 text-sm">/ {targetScore}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
