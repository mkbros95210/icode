
import React, { useRef, useEffect } from 'react';

const AuroraBackground: React.FC<{ theme: string }> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let tick = 0;
    let animationFrameId: number;

    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    if (theme === 'dark') {
      const opts = {
        projectileAlpha: 0.4,
        projectileRadius: 60,
        friction: 0.97,
        hue: 270,
        hueVariation: 20,
        noise: 0.03,
        particleCount: 25,
        mouseRepulsion: 0.3,
        mouseRepulsionRadius: 180,
        flowFieldSpeed: 0.0001,
        flowFieldStrength: 0.05,
      };
      let sparks: Spark[] = [];
      class Spark { /* ... */
        x: number; y: number; vx: number; vy: number; baseHue: number;
        constructor() { this.x = Math.random() * width; this.y = Math.random() * height; this.vx = (Math.random() - 0.5) * opts.noise; this.vy = (Math.random() - 0.5) * opts.noise; this.baseHue = opts.hue + (Math.random() - 0.5) * opts.hueVariation * 2; }
        update() { const angle = (Math.sin(this.x*0.005 + tick*opts.flowFieldSpeed) + Math.cos(this.y*0.005 + tick*opts.flowFieldSpeed)) * 2 * Math.PI; this.vx += Math.cos(angle) * opts.flowFieldStrength; this.vy += Math.sin(angle) * opts.flowFieldStrength; this.vx += (Math.random()-0.5)*opts.noise; this.vy += (Math.random()-0.5)*opts.noise; const dx = this.x - mousePosition.current.x; const dy = this.y - mousePosition.current.y; const dist = Math.sqrt(dx*dx + dy*dy); if (dist < opts.mouseRepulsionRadius) { const force = (opts.mouseRepulsionRadius - dist) / opts.mouseRepulsionRadius; const angleRepel = Math.atan2(dy, dx); this.vx += Math.cos(angleRepel) * force * opts.mouseRepulsion; this.vy += Math.sin(angleRepel) * force * opts.mouseRepulsion; } this.x += this.vx; this.y += this.vy; this.vx *= opts.friction; this.vy *= opts.friction; if(this.x<-opts.projectileRadius)this.x=width+opts.projectileRadius;if(this.x>width+opts.projectileRadius)this.x=-opts.projectileRadius;if(this.y<-opts.projectileRadius)this.y=height+opts.projectileRadius;if(this.y>height+opts.projectileRadius)this.y=-opts.projectileRadius; }
        draw() { if(!ctx)return; ctx.beginPath(); const gradient = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,opts.projectileRadius); const sparkHue = this.baseHue+Math.sin(tick*0.015)*opts.hueVariation; gradient.addColorStop(0,`hsla(${sparkHue}, 80%, 60%, ${opts.projectileAlpha})`); gradient.addColorStop(1, `hsla(${sparkHue}, 80%, 60%, 0)`); ctx.fillStyle = gradient; ctx.globalCompositeOperation = 'lighter'; ctx.fillRect(this.x-opts.projectileRadius,this.y-opts.projectileRadius,opts.projectileRadius*2,opts.projectileRadius*2); }
      }
      const resizeSparks = () => { sparks = Array.from({ length: opts.particleCount }, () => new Spark()); };
      window.addEventListener('resize', resizeSparks);
      resizeSparks();
      const loop = () => { if(!ctx)return; ctx.globalCompositeOperation='source-over'; ctx.fillStyle='rgb(13, 9, 20)'; ctx.fillRect(0,0,width,height); sparks.forEach(s => {s.update(); s.draw();}); tick++; animationFrameId = requestAnimationFrame(loop); };
      loop();
      return () => { window.removeEventListener('resize', resizeSparks); cancelAnimationFrame(animationFrameId); };
    } else { // NEW Light theme 'Aura' effect - MORE VIBRANT
      const opts = {
        projectileAlpha: 0.2, // Increased for more presence
        projectileRadius: 400, // Larger, softer orbs
        friction: 0.98, // Slow, graceful movement
        noise: 0.01,
        particleCount: 12, // More particles
        mouseRepulsion: 0.2,
        mouseRepulsionRadius: 220,
        flowFieldSpeed: 0.00005, // Slower field
        flowFieldStrength: 0.02, // Weaker field
        baseHues: [205, 55, 290], // Sky Blue, Pale Yellow, Vibrant Lavender
      };
      let particles: Particle[] = [];
      class Particle { /* ... */
        x: number; y: number; vx: number; vy: number; baseHue: number;
        constructor() { this.x = Math.random() * width; this.y = Math.random() * height; this.vx = 0; this.vy = 0; this.baseHue = opts.baseHues[Math.floor(Math.random() * opts.baseHues.length)]; }
        update() { const angle = (Math.sin(this.x*0.001 + tick*opts.flowFieldSpeed) + Math.cos(this.y*0.001 + tick*opts.flowFieldSpeed)) * 2 * Math.PI; this.vx += Math.cos(angle) * opts.flowFieldStrength; this.vy += Math.sin(angle) * opts.flowFieldStrength; this.vx += (Math.random()-0.5)*opts.noise; this.vy += (Math.random()-0.5)*opts.noise; const dx = this.x - mousePosition.current.x; const dy = this.y - mousePosition.current.y; const dist = Math.sqrt(dx*dx + dy*dy); if (dist < opts.mouseRepulsionRadius) { const force = (opts.mouseRepulsionRadius - dist) / opts.mouseRepulsionRadius; const angleRepel = Math.atan2(dy, dx); this.vx += Math.cos(angleRepel) * force * opts.mouseRepulsion; this.vy += Math.sin(angleRepel) * force * opts.mouseRepulsion; } this.x += this.vx; this.y += this.vy; this.vx *= opts.friction; this.vy *= opts.friction; if(this.x<-opts.projectileRadius)this.x=width+opts.projectileRadius;if(this.x>width+opts.projectileRadius)this.x=-opts.projectileRadius;if(this.y<-opts.projectileRadius)this.y=height+opts.projectileRadius;if(this.y>height+opts.projectileRadius)this.y=-opts.projectileRadius; }
        draw() { if(!ctx)return; ctx.beginPath(); const gradient = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,opts.projectileRadius); const particleHue = this.baseHue+Math.sin(tick*0.005)*5; gradient.addColorStop(0,`hsla(${particleHue}, 90%, 85%, ${opts.projectileAlpha})`); gradient.addColorStop(0.3, `hsla(${particleHue}, 90%, 85%, ${opts.projectileAlpha * 0.5})`); gradient.addColorStop(1, `hsla(${particleHue}, 90%, 85%, 0)`); ctx.fillStyle = gradient; ctx.globalCompositeOperation = 'lighter'; ctx.arc(this.x,this.y,opts.projectileRadius,0,Math.PI*2); ctx.fill(); }
      }
      const resizeParticles = () => { particles = Array.from({ length: opts.particleCount }, () => new Particle()); };
      window.addEventListener('resize', resizeParticles);
      resizeParticles();
      const loop = () => { if(!ctx)return; ctx.globalCompositeOperation='source-over'; ctx.fillStyle='rgb(249, 250, 251)'; ctx.fillRect(0,0,width,height); particles.forEach(p => {p.update(); p.draw();}); tick++; animationFrameId = requestAnimationFrame(loop); };
      loop();
      return () => { window.removeEventListener('resize', resizeParticles); cancelAnimationFrame(animationFrameId); };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
};

export default AuroraBackground;
