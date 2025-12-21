import { useEffect, useRef } from "react";

/* ============================================================
   INTERACTIVE BACKGROUND ENGINE
   ------------------------------------------------------------
   • Particle Core System
   • Trail Memory System
   • Ripple Shockwave System
   • Mouse Force System
   • Color Harmonics Engine
   • Render Pipeline (multi-pass)
   • Stability-safe RAF loop
   ============================================================ */

function InteractiveBackground() {
  const canvasRef = useRef(null);

  /* ====================== GLOBAL STATE ====================== */
  const mouse = useRef({
    x: -1000,
    y: -1000,
    active: false,
    isDown: false,
    velocityX: 0,
    velocityY: 0,
    lastX: 0,
    lastY: 0,
  });

  const engine = useRef({
    running: true,
    frame: 0,
    time: 0,
  });

  /* ====================== MAIN EFFECT ====================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    /* ====================== CONFIG ====================== */
    const CONFIG = {
      screen: {
        dpr: window.devicePixelRatio || 1,
      },

      particles: {
        baseCount: 120,
        maxCount: 600,
        burstCount: 30,
        baseRadius: 2.8,
        radiusVariance: 10,
        friction: 0.965,
        drift: 0.28,
      },

      pulse: {
        minSpeed: 0.02,
        maxSpeed: 0.07,
        strength: 0.7,
      },

      mouse: {
        influenceRadius: 220,
        gravityRadius: 800,
        gravityStrength: 0.00018,
        repulsionStrength: 1.6,
      },

      color: {
        baseHue: 260,
        hueSpeed: 0.55,
        saturation: 90,
        lightness: 65,
      },

      trails: {
        permanentLength: 7,
        burstLength: 14,
      },

      ripples: {
        speed: 11,
        decay: 0.018,
        lineWidth: 2,
      },
    };

    /* ====================== RUNTIME DATA ====================== */
    let particles = [];
    let ripples = [];
    let globalHue = CONFIG.color.baseHue;
    let rafId = null;

    /* ====================== RESIZE SYSTEM ====================== */
    const resize = () => {
      const dpr = CONFIG.screen.dpr;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ====================== UTILITY FUNCTIONS ====================== */
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const rand = (min, max) => Math.random() * (max - min) + min;

    /* ====================== PARTICLE CLASS ====================== */
    class Particle {
      constructor(x, y, permanent = true) {
        this.reset(x, y, permanent);
      }

      reset(x, y, permanent) {
        this.x = x ?? Math.random() * canvas.width;
        this.y = y ?? Math.random() * canvas.height;
        this.permanent = permanent;

        this.vx = rand(-1, 1) * (permanent ? 1.4 : 8);
        this.vy = rand(-1, 1) * (permanent ? 1.4 : 8);

        this.baseR =
          rand(0, CONFIG.particles.radiusVariance) +
          CONFIG.particles.baseRadius;
        this.r = this.baseR;

        this.pulse = rand(0, Math.PI * 2);
        this.pulseSpeed = rand(
          CONFIG.pulse.minSpeed,
          CONFIG.pulse.maxSpeed
        );

        this.life = 1;
        this.decay = rand(0.006, 0.014);

        this.history = [];
        this.maxHistory = permanent
          ? CONFIG.trails.permanentLength
          : CONFIG.trails.burstLength;
      }

      applyMouseForces() {
        if (!mouse.current.active) return;

        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const dist = Math.hypot(dx, dy) || 1;

        // Gravity (mouse down)
        if (mouse.current.isDown && dist < CONFIG.mouse.gravityRadius) {
          const force =
            (CONFIG.mouse.gravityRadius - dist) *
            CONFIG.mouse.gravityStrength;
          this.vx += dx * force;
          this.vy += dy * force;
        }

        // Repulsion (hover)
        if (dist < CONFIG.mouse.influenceRadius) {
          const force =
            (CONFIG.mouse.influenceRadius - dist) /
            CONFIG.mouse.influenceRadius;
          this.vx -= (dx / dist) * force * CONFIG.mouse.repulsionStrength;
          this.vy -= (dy / dist) * force * CONFIG.mouse.repulsionStrength;
        }
      }

      updatePhysics() {
        this.vx *= CONFIG.particles.friction;
        this.vy *= CONFIG.particles.friction;

        this.x +=
          this.vx + Math.sin(this.pulse + engine.current.time) * CONFIG.particles.drift;
        this.y +=
          this.vy + Math.cos(this.pulse + engine.current.time) * CONFIG.particles.drift;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      updatePulse() {
        this.pulse += this.pulseSpeed;
        this.r =
          this.baseR +
          Math.sin(this.pulse) * this.baseR * CONFIG.pulse.strength;
      }

      updateTrail() {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > this.maxHistory) this.history.shift();
      }

      updateLife() {
        if (!this.permanent) this.life -= this.decay;
      }

      update() {
        this.applyMouseForces();
        this.updatePhysics();
        this.updatePulse();
        this.updateTrail();
        this.updateLife();
      }

      drawTrail() {
        if (this.history.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        this.history.forEach(p => ctx.lineTo(p.x, p.y));

        ctx.strokeStyle = `hsla(${globalHue},80%,60%,${this.life * 0.25})`;
        ctx.lineWidth = this.r * 0.5;
        ctx.stroke();
      }

      drawBody() {
        const alpha = this.permanent ? 0.45 : this.life;

        const g = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.r * 2.6
        );

        g.addColorStop(
          0,
          `hsla(${globalHue},${CONFIG.color.saturation}%,75%,${alpha})`
        );
        g.addColorStop(
          1,
          `hsla(${globalHue},${CONFIG.color.saturation}%,55%,0)`
        );

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      draw() {
        this.drawTrail();
        this.drawBody();
      }
    }

    /* ====================== RIPPLE SYSTEM ====================== */
    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 4;
        this.a = 0.85;
      }

      update() {
        this.r += CONFIG.ripples.speed;
        this.a -= CONFIG.ripples.decay;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${globalHue},100%,80%,${this.a})`;
        ctx.lineWidth = CONFIG.ripples.lineWidth;
        ctx.stroke();
      }
    }

    /* ====================== INIT ====================== */
    const init = () => {
      particles = [];
      for (let i = 0; i < CONFIG.particles.baseCount; i++) {
        particles.push(new Particle());
      }
    };

    /* ====================== ANIMATION LOOP ====================== */
    const animate = () => {
      engine.current.frame++;
      engine.current.time += 0.01;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "screen";

      globalHue += CONFIG.color.hueSpeed;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        if (!p.permanent && p.life <= 0) particles.splice(i, 1);
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].draw();
        if (ripples[i].a <= 0) ripples.splice(i, 1);
      }

      rafId = requestAnimationFrame(animate);
    };

    /* ====================== EVENTS ====================== */
    const onMove = e => {
      mouse.current.velocityX = e.clientX - mouse.current.lastX;
      mouse.current.velocityY = e.clientY - mouse.current.lastY;
      mouse.current.lastX = e.clientX;
      mouse.current.lastY = e.clientY;

      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
    };

    const onDown = e => {
      mouse.current.isDown = true;
      ripples.push(new Ripple(e.clientX, e.clientY));
      for (let i = 0; i < CONFIG.particles.burstCount; i++) {
        particles.push(new Particle(e.clientX, e.clientY, false));
      }
      particles = particles.slice(-CONFIG.particles.maxCount);
    };

    const onUp = () => (mouse.current.isDown = false);

    /* ====================== START ====================== */
    resize();
    init();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: "transparent",
        pointerEvents: "none",
      }}
    />
  );
}

export default InteractiveBackground;
