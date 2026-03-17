/**
 * Role: 메인 페이지 — 무한 캔버스 인터랙션
 * Key Features:
 *   - 드래그(Grab & Drag) + 마우스 휠 패닝
 *   - 관성(Inertia) — 드래그 해제 후 속도가 점차 감쇠
 *   - 무한 루프 — 3×3 타일 복사 후 Seamless Wrap-around
 *   - 가상화(Virtualization) — 뷰포트 밖 요소 display:none 처리
 *   - 부유 애니메이션 — 각 요소가 sin 함수로 자연스럽게 위아래 흔들림
 *   - 커스텀 커서 + 클릭/드래그 판별
 * Dependencies: data.js (CATEGORIES, MOODS)
 */

/* ─────────────────────────────────────────────
   1. 타일 설정
   TILE_W × TILE_H : 하나의 '타일' 크기 (px)
   GRID            : 가로·세로 몇 개 복사할지 (3 = 3×3 = 9개)
   시작 오프셋은 중앙 타일(1,1)을 가리키도록 설정
───────────────────────────────────────────── */
const TILE_W = 2800;
const TILE_H = 1900;
const GRID   = 3;   /* 3×3 = 9 타일 */

/* ─────────────────────────────────────────────
   2. 캔버스 상태
───────────────────────────────────────────── */
let offsetX     = TILE_W;  /* 초기 오프셋 = 중앙 타일 시작 */
let offsetY     = TILE_H;
let velX        = 0;       /* 관성 속도 */
let velY        = 0;
const FRICTION  = 0.88;    /* 감쇠 계수 — 낮을수록 빨리 멈춤 */
const MIN_VEL   = 0.4;     /* 이 속도 이하면 정지 */

let isDragging  = false;
let lastPtrX    = 0;
let lastPtrY    = 0;
let startPtrX   = 0;       /* 드래그 시작 지점 (클릭 판별용) */
let startPtrY   = 0;
let didDrag     = false;   /* true면 클릭 이벤트 무시 */

/* ─────────────────────────────────────────────
   3. 커서 추적
───────────────────────────────────────────── */
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-follower');
let   mouseX     = window.innerWidth  / 2;
let   mouseY     = window.innerHeight / 2;
let   ringX      = mouseX;
let   ringY      = mouseY;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function tickCursorRing() {
  /* lerp 보간으로 커서 링이 부드럽게 따라오도록 */
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(tickCursorRing);
}
tickCursorRing();

/* ─────────────────────────────────────────────
   4. 타일 기본 요소 정의 (월드 좌표 px)
   x, y : 하나의 타일 안에서의 위치
   phase : 부유 애니메이션 sin 파 위상 (요소마다 다르게)
───────────────────────────────────────────── */
const ITEMS_BASE = [
  /* ── 음식 이미지 ── */
  /* 로고 안전 구역: 중앙 x≈350~1050, y≈200~720 → 이 범위를 피해 배치 */
  { type: 'image', tag: '한식',      x:   60, y:   80, rot: -5, size: 200, phase: 0.0 }, /* 좌측 확보 */
  { type: 'image', tag: '양식',      x: 1250, y:   55, rot:  4, size: 185, phase: 1.2 }, /* 로고 우측 여유 */
  { type: 'image', tag: '일식',      x: 2380, y:  140, rot: -3, size: 210, phase: 2.4 },
  { type: 'image', tag: '분식',      x:  100, y: 1080, rot:  6, size: 190, phase: 0.8 },
  { type: 'image', tag: '디저트',    x: 1380, y: 1490, rot: -7, size: 175, phase: 1.6 },
  { type: 'image', tag: '카페',      x:   55, y:  460, rot: -4, size: 195, phase: 0.4 }, /* 로고 좌측 아래로 이동 */
  { type: 'image', tag: '패스트푸드', x: 2100, y:  400, rot:  3, size: 185, phase: 1.3 },
  { type: 'image', tag: '야식',      x: 1680, y:  750, rot: -6, size: 200, phase: 2.5 },
  { type: 'image', tag: '고기',      x:  300, y:  900, rot:  5, size: 205, phase: 0.9 },
  { type: 'image', tag: '아시안',    x: 2400, y: 1350, rot: -2, size: 190, phase: 1.8 },

  /* ── 스티커 이미지 (장식용) ── */
  { type: 'sticker', src: 'img/icon/img002.png', x:  720, y:  750, rot: -8, size: 120, phase: 0.6 }, /* 로고 아래로 이동 */
  { type: 'sticker', src: 'img/icon/img003.png', x: 1540, y:  290, rot:  6, size: 110, phase: 1.7 },
  { type: 'sticker', src: 'img/icon/img004.png', x:  900, y: 1270, rot: -5, size: 125, phase: 2.8 },
  { type: 'sticker', src: 'img/icon/img005.png', x: 2190, y: 1090, rot:  9, size: 115, phase: 0.2 },
  { type: 'sticker', src: 'img/icon/img006.png', x:  460, y: 1650, rot: -7, size: 120, phase: 2.1 },

  /* ── 무드 키워드 텍스트 ── */
  { type: 'text', tag: '매콤',     x:   20, y:  370, rot: -2, phase: 0.3 },
  { type: 'text', tag: '느끼',     x:  810, y:   38, rot:  1, phase: 1.5 },
  { type: 'text', tag: '가성비',   x: 1880, y:  590, rot: -3, phase: 2.2 },
  { type: 'text', tag: '플렉스',   x:   20, y:  810, rot:  2, phase: 0.7 },
  { type: 'text', tag: '혼밥',     x: 1350, y:  160, rot: -1, phase: 1.9 },
  { type: 'text', tag: '로컬맛집', x: 1740, y: 1080, rot:  3, phase: 3.1 },

];

/* ─────────────────────────────────────────────
   5. DOM 요소 생성 — 3×3 타일로 복사
───────────────────────────────────────────── */
const worldEl  = document.getElementById('canvas-world');
const allItems = []; /* 가상화 및 bob 애니메이션용 */

ITEMS_BASE.forEach((cfg, baseIdx) => {
  const meta  = CATEGORIES[cfg.tag] || MOODS[cfg.tag] || {};
  const color = meta.color || '#ffffff';

  for (let gy = 0; gy < GRID; gy++) {
    for (let gx = 0; gx < GRID; gx++) {
      /* 이 복사본의 월드 절대 위치 */
      const wx = cfg.x + gx * TILE_W;
      const wy = cfg.y + gy * TILE_H;

      const el = document.createElement('div');
      el.className = 'float-item';
      el.style.setProperty('--item-color', color);
      el.style.left = wx + 'px';
      el.style.top  = wy + 'px';

      if (cfg.type === 'image') {
        el.className += ' img-item';
        el.style.width = cfg.size + 'px';
        el.innerHTML = `<img src="${meta.image}" alt="${cfg.tag}" draggable="false">`;
      }
      else if (cfg.type === 'icon') {
        el.className += ' img-item icon-item';
        el.style.width = cfg.size + 'px';
        el.innerHTML = `<img src="${meta.icon}" alt="${cfg.tag}" draggable="false">`;
      }
      else if (cfg.type === 'text') {
        el.className += ' text-item';
        el.innerHTML = `<span>${cfg.tag}</span>`;
      }
      else if (cfg.type === 'sticker') {
        /* 스티커: 장식용 이미지, 클릭 불가 (rotation은 애니메이션 루프에서 처리) */
        el.className += ' sticker-item';
        el.style.width = cfg.size + 'px';
        el.innerHTML = `<img src="${cfg.src}" alt="sticker" draggable="false">`;
      }
      else if (cfg.type === 'deco') {
        el.className += ' deco-item';
        el.style.fontSize = cfg.size + 'px';
        el.textContent = cfg.text;
      }

      /* 클릭 이벤트 — deco·sticker는 제외, 드래그와 구분 */
      if (cfg.type !== 'deco' && cfg.type !== 'sticker') {
        el.addEventListener('click', () => {
          if (didDrag) return; /* 드래그였으면 무시 */
          navigateTo(`detail.html?tag=${encodeURIComponent(cfg.tag)}`);
        });
      }

      worldEl.appendChild(el);

      /* 중앙 타일(1,1) 요소만 로드 직후 순차 등장 */
      const isCenterTile = gx === 1 && gy === 1;
      if (isCenterTile) {
        setTimeout(() => el.classList.add('visible'), 350 + baseIdx * 80);
      }

      allItems.push({ el, wx, wy, cfg, phase: cfg.phase });
    }
  }
});

/* ─────────────────────────────────────────────
   6. 로고 아이템 — 진입 시 뷰포트 정중앙에 배치
   ITEMS_BASE와 별도로 동적 좌표를 계산해
   중앙 타일(1,1) 기준 위치를 설정
───────────────────────────────────────────── */
const LOGO_W    = 570;
const LOGO_H    = Math.round(LOGO_W * 0.62); /* PNG 비율 추정 */
/* 타일 좌표 = 스크린 좌표 (초기 오프셋이 TILE_W, TILE_H이므로 1:1 대응) */
const logoTileX = Math.round(window.innerWidth  / 2 - LOGO_W / 2);
const logoTileY = Math.round(window.innerHeight / 2 - LOGO_H / 2);
const logoCfg   = { type: 'logo', rot: 0, phase: 1.4 };

for (let gy = 0; gy < GRID; gy++) {
  for (let gx = 0; gx < GRID; gx++) {
    const wx = logoTileX + gx * TILE_W;
    const wy = logoTileY + gy * TILE_H;

    const el = document.createElement('div');
    el.className   = 'float-item logo-item';
    el.style.left  = wx + 'px';
    el.style.top   = wy + 'px';
    el.style.width = LOGO_W + 'px';
    el.innerHTML   = `<img src="img/title-logo.png" alt="오늘 뭐 먹지?" draggable="false">`;

    worldEl.appendChild(el);

    /* 중앙 타일은 즉시 표시 — 다른 타일은 가상화가 관리 */
    if (gx === 1 && gy === 1) el.classList.add('visible');

    allItems.push({ el, wx, wy, cfg: logoCfg, phase: logoCfg.phase });
  }
}

/* ─────────────────────────────────────────────
   7. 포인터 이벤트 (마우스 + 터치 통합)
───────────────────────────────────────────── */
const canvasEl = document.getElementById('canvas');

canvasEl.addEventListener('pointerdown', e => {
  isDragging = true;
  didDrag    = false;
  lastPtrX   = e.clientX;
  lastPtrY   = e.clientY;
  startPtrX  = e.clientX;
  startPtrY  = e.clientY;
  velX = 0;
  velY = 0;
  canvasEl.setPointerCapture(e.pointerId);
  document.body.classList.add('is-dragging');
  hideDragHint();
});

canvasEl.addEventListener('pointermove', e => {
  if (!isDragging) return;

  const dx = e.clientX - lastPtrX;
  const dy = e.clientY - lastPtrY;

  /* 속도 기록 (관성용) */
  velX = -dx;
  velY = -dy;

  /* 오프셋 즉시 이동 */
  offsetX -= dx;
  offsetY -= dy;

  lastPtrX = e.clientX;
  lastPtrY = e.clientY;

  /* 5px 이상 이동하면 드래그로 판정 */
  if (Math.hypot(e.clientX - startPtrX, e.clientY - startPtrY) > 5) {
    didDrag = true;
  }
});

canvasEl.addEventListener('pointerup', () => {
  isDragging = false;
  document.body.classList.remove('is-dragging');
  /* pointerup 다음 프레임에 didDrag 리셋 (click 이벤트 먼저 처리) */
  setTimeout(() => { didDrag = false; }, 50);
});

canvasEl.addEventListener('pointercancel', () => {
  isDragging = false;
  document.body.classList.remove('is-dragging');
});

/* ─────────────────────────────────────────────
   7. 마우스 휠 — 양방향 패닝 + 관성 추가
───────────────────────────────────────────── */
canvasEl.addEventListener('wheel', e => {
  e.preventDefault();
  /* 트랙패드의 경우 deltaX(좌우)도 그대로 반영 */
  offsetX += e.deltaX;
  offsetY += e.deltaY;
  /* 휠 관성 — 현재 속도에 누적 */
  velX = e.deltaX * 0.4;
  velY = e.deltaY * 0.4;
  hideDragHint();
}, { passive: false });

/* ─────────────────────────────────────────────
   8. Seamless Wrap-around (무한 루프)
   offset이 중앙 타일을 벗어나기 전에 한 타일씩 이동
   시각적으로 동일한 타일이 복사돼 있어 사용자가 알 수 없음
───────────────────────────────────────────── */
function wrapOffset() {
  /* offsetX < TILE_W  → 왼쪽 끝에 가까워짐: 오른쪽 타일로 순간이동 */
  if (offsetX < TILE_W)       offsetX += TILE_W;
  /* offsetX >= 2*TILE_W → 오른쪽 끝: 왼쪽 타일로 */
  else if (offsetX >= TILE_W * 2) offsetX -= TILE_W;

  if (offsetY < TILE_H)       offsetY += TILE_H;
  else if (offsetY >= TILE_H * 2) offsetY -= TILE_H;
}

/* ─────────────────────────────────────────────
   9. 가상화 — 뷰포트 밖 요소 숨기기
   매 4프레임마다 실행 (CPU 절약)
───────────────────────────────────────────── */
const VIRT_BUFFER = 500; /* 뷰포트 바깥 버퍼(px) */
let   frameCount  = 0;

function updateVisibility() {
  const VW = window.innerWidth;
  const VH = window.innerHeight;

  allItems.forEach(({ el, wx, wy }) => {
    /* 이 요소의 현재 화면 위치 */
    const sx = wx - offsetX;
    const sy = wy - offsetY;
    const w  = 250; /* 최대 요소 너비 (보수적 추정) */
    const h  = 250;

    const inView =
      sx + w > -VIRT_BUFFER &&
      sx     <  VW + VIRT_BUFFER &&
      sy + h > -VIRT_BUFFER &&
      sy     <  VH + VIRT_BUFFER;

    /* 이미 올바른 상태면 DOM 쓰기 생략 (성능) */
    const wasHidden = el.style.display === 'none';
    if (inView && wasHidden)    el.style.display = '';
    if (!inView && !wasHidden)  el.style.display = 'none';

    /* 뷰포트 진입 시 가시성 켜기 */
    if (inView && !el.classList.contains('visible')) {
      el.classList.add('visible');
    }
  });
}

/* ─────────────────────────────────────────────
   10. 메인 애니메이션 루프
───────────────────────────────────────────── */
let time = 0;

function tick() {
  time += 0.007;
  frameCount++;

  /* 관성 — 드래그 중이 아닐 때 속도 감쇠 */
  if (!isDragging) {
    velX *= FRICTION;
    velY *= FRICTION;
    if (Math.abs(velX) < MIN_VEL) velX = 0;
    if (Math.abs(velY) < MIN_VEL) velY = 0;
    offsetX += velX;
    offsetY += velY;
  }

  /* 무한 루프 Wrap */
  wrapOffset();

  /* 캔버스 월드 이동 */
  worldEl.style.transform = `translate(${-offsetX}px, ${-offsetY}px)`;

  /* 요소별 부유(bob) 애니메이션 */
  allItems.forEach(({ el, cfg, phase }) => {
    if (el.style.display === 'none') return;
    const bob = Math.sin(time + phase) * 9;
    el.style.transform = `translateY(${bob}px) rotate(${cfg.rot}deg)`;
  });

  /* 가시성 업데이트 — 4프레임마다 */
  if (frameCount % 4 === 0) {
    updateVisibility();
    frameCount = 0;
  }

  requestAnimationFrame(tick);
}

tick();

/* ─────────────────────────────────────────────
   11. 페이지 전환
───────────────────────────────────────────── */
function navigateTo(url) {
  const overlay = document.getElementById('page-transition');
  overlay.classList.add('active');
  setTimeout(() => { window.location.href = url; }, 420);
}

/* ─────────────────────────────────────────────
   12. 드래그 힌트 — 첫 조작 시 숨기기
───────────────────────────────────────────── */
const hintEl   = document.getElementById('drag-hint');
let   hintHidden = false;

function hideDragHint() {
  if (hintHidden) return;
  hintHidden = true;
  hintEl.classList.add('hidden');
}

/* 3초 뒤 자동 페이드 */
setTimeout(hideDragHint, 3000);

/* ─────────────────────────────────────────────
   13. 페이지 진입 페이드인
───────────────────────────────────────────── */
document.body.style.opacity = '0';
window.addEventListener('load', () => {
  document.body.style.transition = 'opacity 0.7s ease';
  document.body.style.opacity    = '1';
});
