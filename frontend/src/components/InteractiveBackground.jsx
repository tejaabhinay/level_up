import { useEffect, useRef } from "react";

function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // ✅ particles MUST be defined first
  const particles = Array.from({ length: 60 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 3 + 1.5,
  dx: (Math.random() - 0.5) * 0.5,
  dy: (Math.random() - 0.5) * 0.5,
  life: 300,
  maxLife: 300,
}));


    // ✅ click interaction (now safe)
const handleClick = (e) => {
  for (let i = 0; i < 12; i++) {
    particles.push({
      x: e.clientX + (Math.random() - 0.5) * 10,
      y: e.clientY + (Math.random() - 0.5) * 10,

      r: Math.random() * 3 + 2,
      dx: (Math.random() - 0.5) * 3,
      dy: (Math.random() - 0.5) * 3,
      life: 120,
      maxLife: 120,
    });
  }

  // ✅ HARD LIMIT (optional extra safety)
  if (particles.length > 120) {
    particles.splice(0, particles.length - 120);
  }
};


    canvas.addEventListener("click", handleClick);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
for (let i = particles.length - 1; i >= 0; i--) {
  const p = particles[i];

  p.x += p.dx;
  p.y += p.dy;
  p.life--;

  if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
  if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

  // ❌ remove dead particles
  if (p.life <= 0) {
    particles.splice(i, 1);
    continue;
  }

  const alpha = p.life / p.maxLife;

  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(139,92,246,${alpha})`;
  ctx.fill();
}


      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // ✅ cleanup (VERY IMPORTANT in React)
    return () => {
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
      }}
    />
  );
}

export default InteractiveBackground;
