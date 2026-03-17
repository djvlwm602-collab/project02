/**
 * Role: 상세 페이지 로직 — URL 파라미터 파싱, 필터링, 정렬, 카드 렌더링
 * Key Features: 태그별 필터링, 거리순/평점순 정렬, 스태거 카드 애니메이션
 * Dependencies: data.js (CATEGORIES, MOODS, RESTAURANTS)
 */

/* ===================================
   URL 파라미터 파싱
=================================== */
const params      = new URLSearchParams(window.location.search);
const selectedTag = params.get('tag') || '한식';
let   currentSort = 'distance';

/* ===================================
   태그 색상 가져오기 (카테고리 또는 무드)
=================================== */
function getTagColor(tag) {
  return '#F8481C';
}

/* ===================================
   필터링 — 선택된 태그를 포함하는 레스토랑
=================================== */
function filterRestaurants() {
  return RESTAURANTS.filter(r => r.tags.includes(selectedTag));
}

/* ===================================
   정렬 — 거리순 / 평점순
=================================== */
function sortRestaurants(list, sortBy) {
  return [...list].sort((a, b) => {
    if (sortBy === 'distance') return a.distance - b.distance;
    if (sortBy === 'rating')   return b.rating - a.rating;
    return 0;
  });
}

/* ===================================
   카드 DOM 생성
=================================== */
function createCard(restaurant) {
  const card = document.createElement('article');
  card.className = 'restaurant-card';

  /* 태그 뱃지 HTML */
  const tagsHTML = restaurant.tags.map(tag => {
    const c = getTagColor(tag);
    return `<span class="card-tag" style="background:${c}18; color:${c};">#${tag}</span>`;
  }).join('');

  /* 거리 아이콘 SVG */
  const pinSVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>`;

  /* 주소 앞 3단어만 표시 */
  const shortAddr = restaurant.address.split(' ').slice(0, 3).join(' ');

  card.innerHTML = `
    <div class="card-thumb">
      <img src="${restaurant.thumbnail}" alt="${restaurant.name}" loading="lazy">
      <span class="card-price-badge">${restaurant.priceRange}</span>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <div class="card-rating">
          <span class="star-icon">★</span>
          <span>${restaurant.rating.toFixed(1)}</span>
          <span class="review-count">(${restaurant.reviewCount.toLocaleString()})</span>
        </div>
        <div class="card-distance">
          ${pinSVG}
          도보 ${restaurant.walkTime}분 · ${restaurant.distance}km
        </div>
      </div>
      <h2 class="card-name">${restaurant.name}</h2>
      <p class="card-desc">${restaurant.description}</p>
      <div class="card-tags">${tagsHTML}</div>
    </div>
    <div class="card-footer">
      <span class="card-price">💰 ${restaurant.priceRange}</span>
      <span class="card-address">📍 ${shortAddr}</span>
    </div>
  `;

  return card;
}

/* ===================================
   그리드 렌더링 (정렬 포함)
=================================== */
function renderGrid() {
  const grid     = document.getElementById('restaurant-grid');
  const filtered = filterRestaurants();
  const sorted   = sortRestaurants(filtered, currentSort);

  /* 카운트 업데이트 */
  document.getElementById('hero-count').textContent = `총 ${sorted.length}개의 맛집을 찾았어요`;

  grid.innerHTML = '';

  if (sorted.length === 0) {
    grid.innerHTML = `
      <div class="no-result">
        <p style="font-size:36px; margin-bottom:12px;">🍽</p>
        <p>해당하는 맛집이 없습니다.</p>
        <p style="margin-top:8px; font-size:13px;">다른 카테고리를 탐색해보세요.</p>
      </div>`;
    return;
  }

  sorted.forEach((r, i) => {
    const card = createCard(r);

    /* 초기 상태 — JS로 페이드/슬라이드 애니메이션 */
    card.style.opacity   = '0';
    card.style.transform = 'translateY(22px)';
    card.style.transition = `opacity 0.5s ease ${i * 65}ms, transform 0.5s ease ${i * 65}ms`;

    grid.appendChild(card);

    /* 두 프레임 뒤에 최종 상태로 전환 (브라우저 페인트 보장) */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0)';
      });
    });
  });
}

/* ===================================
   헤더/히어로 초기화
=================================== */
function initHeader() {
  const color = getTagColor(selectedTag);

  /* CSS 변수로 액센트 색상 주입 */
  document.documentElement.style.setProperty('--accent', color);

  document.getElementById('header-tag').textContent = '#' + selectedTag;
  document.title = selectedTag + ' 맛집 — 오늘 뭐 먹지?';

  /* 히어로 타이틀 */
  const heroTitle  = document.getElementById('hero-title');
  heroTitle.innerHTML = `<span class="tag-word">${selectedTag}</span> 맛집`;

  document.getElementById('hero-eyebrow').textContent = '';
}

/* ===================================
   정렬 버튼 이벤트
=================================== */
document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSort = btn.dataset.sort;
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGrid();
  });
});

/* ===================================
   초기 실행
=================================== */
initHeader();
renderGrid();

/* 페이지 페이드인 */
window.addEventListener('load', () => {
  document.body.classList.add('ready');
});
