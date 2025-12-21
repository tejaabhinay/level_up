import { useEffect, useRef } from "react";

/**
 * InteractiveBackground: STAR-GLOW EDITION
 * - Star-shaped particles with rotation
 * - Full 360-degree rainbow color cycling
 * - Mouse Gravity & Repulsion
 */
function InteractiveBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000, active: false, isDown: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const CONFIG = {
      particleCount: 100,
      burstCount: 25,
      baseRadius: 4,
      radiusVariance: 12,
      pulseSpeedRange: { min: 0.02, max: 0.06 },
      maxParticles: 400,
      driftStrength: 0.3,
      hueSpeed: 0.5, // Controls how fast colors cycle
      mouseRadius: 200,
      friction: 0.97,
    };

    let particles = [];
    let ripples = [];
    let globalHue = 0; // Starts at red and cycles through 360 degrees

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Helper function to draw a star
    const drawStar = (ctx, x, y, spikes, outerRadius, innerRadius) => {
      let rot = (Math.PI / 2) * 3;
      let step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(x, y - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = x + Math.cos(rot) * outerRadius;
        y = y + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = x + Math.cos(rot) * innerRadius;
        y = y + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(x, y - outerRadius);
      ctx.closePath();
    };

    class Particle {
      constructor(x, y, isPermanent = true) {
        this.init(x, y, isPermanent);
      }

      init(x, y, isPermanent) {
        this.x = x ?? Math.random() * canvas.width;
        this.y = y ?? Math.random() * canvas.height;
        this.permanent = isPermanent;
        
        this.vx = (Math.random() - 0.5) * (isPermanent ? 1.5 : 8);
        this.vy = (Math.random() - 0.5) * (isPermanent ? 1.5 : 8);
        
        this.baseR = Math.random() * CONFIG.radiusVariance + CONFIG.baseRadius;
        this.r = this.baseR;
        this.rotation = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.05;
        
        this.pulseStep = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * (CONFIG.pulseSpeedRange.max - CONFIG.pulseSpeedRange.min) + CONFIG.pulseSpeedRange.min;
        
        // This gives each particle a slightly different hue from the global one
        this.hueOffset = Math.random() * 60 - 30; 
        this.life = 1.0;
        this.decay = Math.random() * 0.015 + 0.005;
        
        this.history = [];
        this.maxHistory = isPermanent ? 5 : 12;
      }

      update() {
        if (mouse.current.active) {
          const dx = mouse.current.x - this.x;
          const dy = mouse.current.y - this.y;
          const dist = Math.hypot(dx, dy);

          if (mouse.current.isDown) {
            const force = (500 - dist) / 5000;
            if (dist < 800) {
              this.vx += dx * force;
              this.vy += dy * force;
            }
          } else if (dist < CONFIG.mouseRadius) {
            const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
            this.vx -= (dx / dist) * force * 1.5;
            this.vy -= (dy / dist) * force * 1.5;
          }
        }

        this.vx *= CONFIG.friction;
        this.vy *= CONFIG.friction;
        this.x += this.vx + Math.sin(this.pulseStep) * CONFIG.driftStrength;
        this.y += this.vy + Math.cos(this.pulseStep) * CONFIG.driftStrength;
        this.rotation += this.spin;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1.2;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1.2;

        this.pulseStep += this.pulseSpeed;
        this.r = this.baseR + Math.sin(this.pulseStep) * (this.baseR * 0.5);

        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > this.maxHistory) this.history.shift();

        if (!this.permanent) this.life -= this.decay;
      }

      draw() {
        const currentHue = (globalHue + this.hueOffset) % 360;
        const alpha = (this.permanent ? 0.6 : this.life) * (Math.sin(this.pulseStep) * 0.2 + 0.8);
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // 1. Star Glow
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 3);
        grad.addColorStop(0, `hsla(${currentHue}, 100%, 70%, ${alpha})`);
        grad.addColorStop(1, `hsla(${currentHue}, 100%, 50%, 0)`);
        
        ctx.fillStyle = grad;
        drawStar(ctx, 0, 0, 5, this.r * 3, this.r * 1.2);
        ctx.fill();

        // 2. Star Core
        ctx.fillStyle = `hsla(${currentHue}, 100%, 90%, ${alpha})`;
        drawStar(ctx, 0, 0, 5, this.r, this.r * 0.4);
        ctx.fill();

        ctx.restore();
      }
    }

    class Ripple {
      constructor(x, y) {
        this.x = x; this.y = y; this.r = 2; this.alpha = 0.8;
      }
      update() { this.r += 10; this.alpha -= 0.015; }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${globalHue}, 100%, 80%, ${this.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < CONFIG.particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "screen";
      
      globalHue = (globalHue + CONFIG.hueSpeed) % 360;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (!p.permanent && p.life <= 0) particles.splice(i, 1);
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].draw();
        if (ripples[i].alpha <= 0) ripples.splice(i, 1);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMove = (e) => { 
      mouse.current.x = e.clientX; 
      mouse.current.y = e.clientY; 
      mouse.current.active = true; 
    };
    const handleDown = () => {
      mouse.current.isDown = true;
      ripples.push(new Ripple(mouse.current.x, mouse.current.y));
      for (let i = 0; i < CONFIG.burstCount; i++) {
        particles.push(new Particle(mouse.current.x, mouse.current.y, false));
      }
    };
    const handleUp = () => mouse.current.isDown = false;

    resize();
    init();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "auto",
        background: "#050505" // Dark background makes the glow pop
      }}
    />
  );
}

export default InteractiveBackground;