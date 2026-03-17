/**
 * Role: 맛집 목 데이터 및 카테고리/무드 설정
 * Key Features: 레스토랑 배열, 카테고리 맵, 무드 맵
 * Notes: 이미지는 Unsplash CDN 실사 사진 사용
 */

/* Unsplash 이미지 베이스 URL 헬퍼 */
const UNS = (id, w = 600, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

/* ─────────────────────────────────────────────
   음식 카테고리 — 실사 이미지·아이콘·테마 색상 매핑
───────────────────────────────────────────── */
const CATEGORIES = {
  한식:     { color: '#FF142D', image: UNS('1498654896293-37aacf113fd9') }, /* 비빔밥 */
  양식:     { color: '#3D7EFF', image: UNS('1567620905732-2d1ec7ab7445') }, /* 파스타 */
  일식:     { color: '#FFD600', image: UNS('1553621042-f6e147245754')    }, /* 스시 */
  분식:     { color: '#FF7A2B', image: UNS('1635363638580-c2809d049eee') }, /* 떡볶이 */
  디저트:   { color: '#B870FF', image: UNS('1565958011703-44f9829ba187') }, /* 케이크 */
  카페:     { color: '#7C3AED', image: UNS('1509042239860-f550ce710b93') }, /* 커피 */
  패스트푸드:{ color: '#EF4444', image: UNS('1568901346375-23c9450c58cd')  }, /* 버거 */
  야식:     { color: '#0EA5E9', image: UNS('1626645738196-c2a7c87a8f58') }, /* 치킨 */
  고기:     { color: '#EA580C', image: UNS('1529193591184-b1d58069ecdd') }, /* BBQ */
  아시안:   { color: '#10B981', image: UNS('1455619452474-d2be8b1e70cd') }, /* 아시안 */
};

/* ─────────────────────────────────────────────
   무드/취향 키워드 — 테마 색상 매핑
───────────────────────────────────────────── */
const MOODS = {
  매콤:     { color: '#FF142D' },
  느끼:     { color: '#FF7A2B' },
  가성비:   { color: '#00C77F' },
  플렉스:   { color: '#FFD600' },
  혼밥:     { color: '#3D7EFF' },
  로컬맛집: { color: '#B870FF' },
};

/* ─────────────────────────────────────────────
   레스토랑 목 데이터 — 14개
───────────────────────────────────────────── */
const RESTAURANTS = [
  {
    id: 1,
    name: '을지로 골뱅이',
    category: '한식',
    tags: ['한식', '매콤', '로컬맛집'],
    rating: 4.8, reviewCount: 342,
    distance: 0.8, walkTime: 12,
    address: '서울 중구 을지로3가 354-1',
    thumbnail: UNS('1583224994559-58b9a96e68c4'), /* 한국 요리 */
    description: '40년 전통의 을지로 골뱅이 전문점. 매콤한 양념과 쫄깃한 면 궁합이 일품.',
    priceRange: '1만원대',
  },
  {
    id: 2,
    name: '스시 나카무라',
    category: '일식',
    tags: ['일식', '플렉스', '혼밥'],
    rating: 4.9, reviewCount: 128,
    distance: 1.4, walkTime: 20,
    address: '서울 강남구 청담동 82-4',
    thumbnail: UNS('1553621042-f6e147245754'), /* 스시 */
    description: '오마카세 스타일의 정통 일식 스시 바. 최상급 재료만 엄선해 사용.',
    priceRange: '10만원대',
  },
  {
    id: 3,
    name: '파스타 소스토',
    category: '양식',
    tags: ['양식', '느끼', '플렉스'],
    rating: 4.7, reviewCount: 256,
    distance: 0.5, walkTime: 8,
    address: '서울 마포구 연남동 391-5',
    thumbnail: UNS('1473093226589-cd3ad3cdc08d'), /* 파스타 */
    description: '이탈리아 직수입 재료로 만드는 정통 파스타와 나폴리 화덕 피자.',
    priceRange: '3만원대',
  },
  {
    id: 4,
    name: '순대국밥 박가네',
    category: '한식',
    tags: ['한식', '매콤', '가성비', '로컬맛집'],
    rating: 4.6, reviewCount: 511,
    distance: 0.3, walkTime: 5,
    address: '서울 중구 황학동 88',
    thumbnail: UNS('1547592166-23ac88972f4d'), /* 국밥/수프 */
    description: '진한 사골 육수에 두툼한 순대. 동네 주민들이 30년째 인정하는 가성비 맛집.',
    priceRange: '8천원대',
  },
  {
    id: 5,
    name: '떡볶이 왕가',
    category: '분식',
    tags: ['분식', '매콤', '가성비'],
    rating: 4.5, reviewCount: 890,
    distance: 0.2, walkTime: 3,
    address: '서울 서대문구 신촌동 63-1',
    thumbnail: UNS('1635363638580-c2809d049eee'), /* 떡볶이 */
    description: '쫄깃한 쌀떡에 매콤달콤한 양념. 신촌 터줏대감 30년 전통.',
    priceRange: '5천원대',
  },
  {
    id: 6,
    name: '카페 드 마르',
    category: '디저트',
    tags: ['디저트', '느끼', '플렉스', '혼밥'],
    rating: 4.8, reviewCount: 203,
    distance: 1.0, walkTime: 15,
    address: '서울 종로구 익선동 40-1',
    thumbnail: UNS('1558618666-fcd25c85cd64'), /* 마카롱 */
    description: '프랑스 파티시에가 직접 만드는 수제 케이크와 마카롱. 아늑한 단독 건물.',
    priceRange: '2만원대',
  },
  {
    id: 7,
    name: '라멘 히로',
    category: '일식',
    tags: ['일식', '느끼', '혼밥', '로컬맛집'],
    rating: 4.7, reviewCount: 445,
    distance: 0.7, walkTime: 10,
    address: '서울 용산구 이태원동 218-6',
    thumbnail: UNS('1569718212165-3a8278d5f624'), /* 라멘 */
    description: '18시간 우려낸 진한 돈코츠 육수. 면의 쫄깃함과 차슈가 조화롭다.',
    priceRange: '1만 5천원대',
  },
  {
    id: 8,
    name: '버거 프레스',
    category: '양식',
    tags: ['양식', '느끼', '가성비'],
    rating: 4.4, reviewCount: 667,
    distance: 0.5, walkTime: 7,
    address: '서울 마포구 홍대 402-3',
    thumbnail: UNS('1568901346375-23c9450c58cd'), /* 버거 */
    description: '매일 직접 패티를 갈아 만드는 수제 버거 전문점. 두툼한 패티가 자랑.',
    priceRange: '1만 2천원대',
  },
  {
    id: 9,
    name: '냉면 평양옥',
    category: '한식',
    tags: ['한식', '로컬맛집', '가성비'],
    rating: 4.9, reviewCount: 289,
    distance: 1.0, walkTime: 14,
    address: '서울 중구 을지로 221',
    thumbnail: UNS('1498654896293-37aacf113fd9'), /* 한국 면 요리 */
    description: '순수 메밀로 만드는 전통 평양냉면. 심플하지만 깊고 진한 사골 육수.',
    priceRange: '1만 2천원대',
  },
  {
    id: 10,
    name: '단팥빵 토키',
    category: '디저트',
    tags: ['디저트', '가성비', '혼밥'],
    rating: 4.6, reviewCount: 178,
    distance: 1.2, walkTime: 18,
    address: '서울 성동구 성수동 291-25',
    thumbnail: UNS('1555507036-ab1f4038808a'), /* 빵/베이커리 */
    description: '매일 아침 굽는 신선한 수제 단팥빵. 국내산 통팥과 건강한 재료만 사용.',
    priceRange: '3천원대',
  },
  {
    id: 11,
    name: '김밥 명인',
    category: '분식',
    tags: ['분식', '가성비', '혼밥'],
    rating: 4.3, reviewCount: 1024,
    distance: 0.3, walkTime: 4,
    address: '서울 광진구 건대입구 15-8',
    thumbnail: UNS('1504674900247-0877df9cc836'), /* 한국 길거리 음식 */
    description: '11가지 특제 김밥과 라볶이를 합리적인 가격에. 언제나 긴 줄이 증명.',
    priceRange: '5천원대',
  },
  {
    id: 12,
    name: '이자카야 사쿠라',
    category: '일식',
    tags: ['일식', '느끼', '플렉스', '로컬맛집'],
    rating: 4.7, reviewCount: 312,
    distance: 1.8, walkTime: 25,
    address: '서울 강남구 압구정 119-2',
    thumbnail: UNS('1617196034099-f24a9f1bbf6c'), /* 일식 요리 */
    description: '오사카 스타일 이자카야. 엄선한 사케와 창작 안주의 완벽한 조합.',
    priceRange: '4만원대',
  },
  {
    id: 13,
    name: '마라탕 홍',
    category: '한식',
    tags: ['한식', '매콤', '혼밥'],
    rating: 4.5, reviewCount: 732,
    distance: 0.6, walkTime: 9,
    address: '서울 강남구 역삼동 814-6',
    thumbnail: UNS('1574484284602-d250ce90c526'), /* 마라탕/스파이시 */
    description: '얼얼한 마라 향신료의 깊은 맛. 재료를 직접 고르는 자유로운 한 끼.',
    priceRange: '1만 8천원대',
  },
  {
    id: 14,
    name: '피자 마르게리타',
    category: '양식',
    tags: ['양식', '느끼', '로컬맛집'],
    rating: 4.6, reviewCount: 421,
    distance: 0.9, walkTime: 13,
    address: '서울 송파구 잠실동 212-5',
    thumbnail: UNS('1565299624946-b28f40a0ae38'),
    description: '나폴리 정통 방식으로 구워내는 화덕 피자. 얇고 바삭한 크러스트가 특징.',
    priceRange: '2만 5천원대',
  },

  /* ── 카페 ── */
  {
    id: 15,
    name: '블루보틀 삼청동',
    category: '카페',
    tags: ['카페', '플렉스', '혼밥'],
    rating: 4.7, reviewCount: 534,
    distance: 1.1, walkTime: 16,
    address: '서울 종로구 삼청동 35-8',
    thumbnail: UNS('1509042239860-f550ce710b93'),
    description: '핸드드립 스페셜티 커피와 시그니처 라떼. 고즈넉한 삼청동 분위기.',
    priceRange: '7천원대',
  },
  {
    id: 16,
    name: '연남동 커피한약방',
    category: '카페',
    tags: ['카페', '로컬맛집', '혼밥'],
    rating: 4.5, reviewCount: 287,
    distance: 0.6, walkTime: 9,
    address: '서울 마포구 연남동 228-4',
    thumbnail: UNS('1461023058943-07fcbe16d735'),
    description: '한옥을 개조한 독특한 공간. 직접 블렌딩한 원두로 내리는 드립 커피.',
    priceRange: '6천원대',
  },

  /* ── 패스트푸드 ── */
  {
    id: 17,
    name: '쉐이크쉑 강남',
    category: '패스트푸드',
    tags: ['패스트푸드', '느끼', '가성비'],
    rating: 4.4, reviewCount: 1203,
    distance: 0.4, walkTime: 6,
    address: '서울 강남구 강남대로 지하',
    thumbnail: UNS('1568901346375-23c9450c58cd'),
    description: '두툼한 앵거스 비프 패티와 감자튀김의 정석. 항상 줄 서도 먹는 버거.',
    priceRange: '1만 5천원대',
  },
  {
    id: 18,
    name: '맘스터치 홍대점',
    category: '패스트푸드',
    tags: ['패스트푸드', '가성비', '혼밥'],
    rating: 4.2, reviewCount: 876,
    distance: 0.2, walkTime: 3,
    address: '서울 마포구 홍대 45-2',
    thumbnail: UNS('1561758033-d89a2468a576'),
    description: '국내산 닭고기로 만든 싸이버거. 가성비 최고의 프리미엄 패스트푸드.',
    priceRange: '8천원대',
  },

  /* ── 야식 ── */
  {
    id: 19,
    name: '교촌치킨 신촌본점',
    category: '야식',
    tags: ['야식', '느끼', '가성비'],
    rating: 4.6, reviewCount: 2104,
    distance: 0.3, walkTime: 4,
    address: '서울 서대문구 신촌동 77-1',
    thumbnail: UNS('1527090526205-beaac8dc3595'),
    description: '간장 양념이 스며든 바삭한 닭날개. 맥주와 궁합이 최고인 야식 치킨.',
    priceRange: '2만원대',
  },
  {
    id: 20,
    name: '족발보쌈 대장',
    category: '야식',
    tags: ['야식', '로컬맛집', '플렉스'],
    rating: 4.7, reviewCount: 418,
    distance: 0.8, walkTime: 11,
    address: '서울 중구 을지로 58-3',
    thumbnail: UNS('1504674900247-0877df9cc836'),
    description: '매일 새벽 직접 삶는 부드러운 족발과 수육. 새벽 2시까지 운영.',
    priceRange: '3만원대',
  },

  /* ── 고기 ── */
  {
    id: 21,
    name: '연남동 돼지갈비',
    category: '고기',
    tags: ['고기', '로컬맛집', '플렉스'],
    rating: 4.8, reviewCount: 623,
    distance: 0.7, walkTime: 10,
    address: '서울 마포구 연남동 562-1',
    thumbnail: UNS('1544025162-d76538764a5a'),
    description: '숯불 향 가득한 생 돼지갈비. 직접 잡아 당일 바로 올리는 신선한 고기.',
    priceRange: '2만원대',
  },
  {
    id: 22,
    name: '한우마을 정육식당',
    category: '고기',
    tags: ['고기', '플렉스', '로컬맛집'],
    rating: 4.9, reviewCount: 311,
    distance: 1.3, walkTime: 19,
    address: '서울 강남구 논현동 145-7',
    thumbnail: UNS('1558030006-f6307a06a4ba'),
    description: '1++ 등급 한우를 정육 가격으로. 마블링 가득한 꽃등심과 채끝.',
    priceRange: '6만원대',
  },

  /* ── 아시안 ── */
  {
    id: 23,
    name: '팟타이 방콕',
    category: '아시안',
    tags: ['아시안', '느끼', '혼밥'],
    rating: 4.6, reviewCount: 389,
    distance: 0.9, walkTime: 13,
    address: '서울 용산구 이태원동 130-5',
    thumbnail: UNS('1455619452474-d2be8b1e70cd'),
    description: '태국 현지 셰프가 만드는 정통 팟타이. 새우와 땅콩의 고소한 조화.',
    priceRange: '1만 5천원대',
  },
  {
    id: 24,
    name: '하노이 쌀국수',
    category: '아시안',
    tags: ['아시안', '가성비', '혼밥'],
    rating: 4.5, reviewCount: 512,
    distance: 0.5, walkTime: 7,
    address: '서울 마포구 연남동 87-4',
    thumbnail: UNS('1569718212165-3a8278d5f624'),
    description: '12시간 우린 진한 소뼈 육수. 현지 직수입 쌀면으로 만드는 정통 쌀국수.',
    priceRange: '1만원대',
  },
];
