import { useEffect, useRef } from "react";

function SkillCinematic({ effect, trigger }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const start = performance.now();
let presentationRadius = 0;

function drawPresentationSpotlight() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(2,6,23,0.9)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, presentationRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(250,204,21,0.8)"; // gold
  ctx.lineWidth = 3;
  ctx.shadowColor = "#facc15";
  ctx.shadowBlur = 20;
  ctx.stroke();

  presentationRadius += 12;
}


let designT = 0;

function drawDesignCurves() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(2,6,23,0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#f472b6"; // pinkish design vibe
  ctx.shadowColor = "#f472b6";
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);

  for (let x = 0; x < canvas.width; x += 20) {
    const y =
      canvas.height / 2 +
      Math.sin((x + designT) * 0.01) * 80 +
      Math.cos((x + designT) * 0.02) * 40;
    ctx.lineTo(x, y);
  }

  ctx.stroke();
  designT += 6;
}




let waveOffset = 0;

function drawFrontendWave() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(2,6,23,0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);

  for (let x = 0; x <= canvas.width; x += 10) {
    const y =
      canvas.height / 2 +
      Math.sin((x + waveOffset) * 0.02) * 60;

    ctx.lineTo(x, y);
  }

  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 20;
  ctx.stroke();

  waveOffset += 4;
}

    /* =========================
       MANAGEMENT (TETRIS)
    ========================= */
    const blockSize = 24;
    const cols = Math.floor(canvas.width / blockSize);
    const rows = Math.floor(canvas.height / blockSize);

    const blocks = Array.from({ length: 18 }, () => ({
      x: Math.floor(Math.random() * cols) * blockSize,
      y: -Math.random() * 300,
      targetY: Math.floor((rows - 6 + Math.random() * 4)) * blockSize,
      color: ["#facc15", "#60a5fa", "#34d399", "#f472b6"][
        Math.floor(Math.random() * 4)
      ],
      speed: Math.random() * 4 + 3,
    }));

    function drawManagementBlocks() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(2,6,23,0.9)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blocks.forEach((b) => {
        if (b.y < b.targetY) {
          b.y += b.speed;
          if (b.y > b.targetY) b.y = b.targetY;
        }

        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, blockSize, blockSize);
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.strokeRect(b.x, b.y, blockSize, blockSize);
      });
    }

    /* =========================
       ML (BINARY)
    ========================= */
    function drawBinary() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(2,6,23,0.85)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "16px monospace";
      ctx.fillStyle = "rgba(34,211,238,0.8)";

      for (let x = 0; x < canvas.width; x += 20) {
        for (let y = 0; y < canvas.height; y += 20) {
          ctx.fillText(Math.random() > 0.5 ? "1" : "0", x, y);
        }
      }
    }

    /* =========================
       DATABASE (GRID)
    ========================= */
    function drawGrid() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(2,6,23,0.85)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(34,197,94,0.6)";
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }
    }

    /* =========================
       BACKEND (NETWORK)
    ========================= */
    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
function drawLiteratureReview() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(2,6,23,0.9)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = "rgba(129,140,248,0.6)";
    ctx.fillRect(
      canvas.width / 2 - 120 + i * 4,
      canvas.height / 2 - 60 + i * 6,
      240,
      40
    );
  }
}
let scanY = 0;
function drawPaperReading() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(2,6,23,0.9)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(129,140,248,0.7)";
  ctx.lineWidth = 2;

  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(200, scanY + i * 40);
    ctx.lineTo(canvas.width - 200, scanY + i * 40);
    ctx.stroke();
  }

  scanY += 6;
}
function drawDataAnalysis() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(2,6,23,0.9)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 12; i++) {
    const h = Math.random() * 200 + 40;
    ctx.fillStyle = "rgba(52,211,153,0.7)";
    ctx.fillRect(200 + i * 50, canvas.height - h - 200, 30, h);
  }
}
function drawStatistics() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(2,6,23,0.9)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#38bdf8";
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x += 20) {
    const y =
      canvas.height / 2 +
      Math.sin(x * 0.01) * 120;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}
let cursorX = 200;
function drawScientificWriting() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(2,6,23,0.9)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#e0e7ff";
  ctx.font = "20px monospace";
  ctx.fillText("Writing paper...", 200, 300);

  ctx.fillRect(cursorX, 320, 10, 24);
  cursorX += 4;
}
function drawLogicalReasoning() {
  drawBackendNetwork(); // reuse
}
function drawQuickThinking() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(99,102,241,0.35)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
let waveR = 0;
function drawCommunication() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(168,85,247,0.7)";
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/2, waveR, 0, Math.PI * 2);
  ctx.stroke();
  waveR += 10;
}

    function drawBackendNetwork() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(2,6,23,0.85)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.strokeStyle = `rgba(56,189,248,${1 - dist / 140})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
      });
    }

    /* =========================
       ANIMATION LOOP
    ========================= */
    function animate(time) {
      const elapsed = time - start;

if (effect === "ml") drawBinary();
if (effect === "database") drawGrid();
if (effect === "backend") drawBackendNetwork();
if (effect === "management") drawManagementBlocks();
if (effect === "frontend") drawFrontendWave();
if (effect === "design") drawDesignCurves();
if (effect === "presentation") drawPresentationSpotlight();
if (effect === "literature review") drawLiteratureReview();
if (effect === "paper reading") drawPaperReading();
if (effect === "data analysis") drawDataAnalysis();
if (effect === "statistical methods") drawStatistics();
if (effect === "scientific writing") drawScientificWriting();
if (effect === "logical reasoning") drawLogicalReasoning();
if (effect === "quick thinking") drawQuickThinking();
if (effect === "communication") drawCommunication();

      if (elapsed < 1000) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(animate);
  }, [trigger, effect]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3,
        pointerEvents: "none",
      }}
    />
  );
}

export default SkillCinematic;
