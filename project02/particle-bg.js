/**
 * Role: 인터랙티브 파티클 배경 — 마우스에 반응해 입자가 흩어지고 원위치로 복귀
 * Key Features: 마우스 반발력, 스프링 복귀, 물리 감쇠, DPR 대응 리사이즈
 * Dependencies: index.html #particle-canvas
 */

(function () {
  /* ── 상수 ── */
  const PARTICLE_DENSITY   = 0.00015; /* 화면 면적 대비 입자 수 비율 */
  const MOUSE_RADIUS       = 150;     /* 마우스 영향 반경 (px) */
  const RETURN_SPEED       = 0.05;    /* 원위치 복귀 스프링 강도 */
  const DAMPING            = 0.95;    /* 속도 감쇠 계수 */
  const REPULSION_STRENGTH = 1.0;     /* 반발력 배율 */

  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');

  let particles = [];
  /* pointer-events:none이라 document 레벨에서 마우스 위치 수신 */
  const mouse = { x: -1000, y: -1000, isActive: false };

  /* ── 입자 초기화 ── */
  function initParticles(width, height) {
    const count = Math.floor(width * height * PARTICLE_DENSITY);
    particles = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x, y,
        originX: x, originY: y,
        vx: 0, vy: 0,
        size:  Math.random() * 2 + 1,
        /* 10% 확률로 파란 강조색, 나머지는 흰색 */
        color: Math.random() > 0.9 ? '#4285F4' : '#ffffff',
      });
    }
  }

  /* ── 애니메이션 루프 ── */
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p  = particles[i];
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const d  = Math.sqrt(dx * dx + dy * dy);

      /* 1. 마우스 반발력 */
      if (mouse.isActive && d < MOUSE_RADIUS && d > 0) {
        const force = (MOUSE_RADIUS - d) / MOUSE_RADIUS;
        p.vx -= (dx / d) * force * 10 * REPULSION_STRENGTH;
        p.vy -= (dy / d) * force * 10 * REPULSION_STRENGTH;
      }

      /* 2. 원위치 복귀 스프링 */
      p.vx += (p.originX - p.x) * RETURN_SPEED;
      p.vy += (p.originY - p.y) * RETURN_SPEED;

      /* 3. 감쇠 & 위치 업데이트 */
      p.vx *= DAMPING;
      p.vy *= DAMPING;
      p.x  += p.vx;
      p.y  += p.vy;

      /* 4. 렌더링 */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle   = p.color;
      ctx.globalAlpha = 0.6;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  /* ── 캔버스 크기 동기화 (DPR 대응) ── */
  function handleResize() {
    const dpr    = window.devicePixelRatio || 1;
    const width  = window.innerWidth;
    const height = window.innerHeight;

    canvas.width          = width  * dpr;
    canvas.height         = height * dpr;
    canvas.style.width    = width  + 'px';
    canvas.style.height   = height + 'px';
    ctx.scale(dpr, dpr);

    initParticles(width, height);
  }

  /* ── 이벤트 등록 ── */
  window.addEventListener('resize', handleResize);

  /* document 레벨 수신 — canvas는 pointer-events:none */
  document.addEventListener('mousemove', e => {
    mouse.x        = e.clientX;
    mouse.y        = e.clientY;
    mouse.isActive = true;
  });
  document.addEventListener('mouseleave', () => {
    mouse.isActive = false;
  });

  /* ── 초기 실행 ── */
  handleResize();
  animate();
}());
