import { PortfolioItem, ScheduleItem } from './types';

export const INITIAL_PORTFOLIOS: PortfolioItem[] = [
  {
    id: 'p1',
    category: '포스터 제작',
    title: '청춘의 소리 클래식 버스킹 포스터',
    description: '여름밤 청계천에서 열린 청년 예술가들의 버스킹 공연 홍보용 포스터. 아날로그 필름 감성과 클래식 선율의 조화를 따뜻한 톤으로 디자인하였습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    client: '서울청년클래식협회',
    date: '2026.05'
  },
  {
    id: 'p2',
    category: '릴스 숏폼',
    title: '대학생 배낭여행 3부작 쇼츠',
    description: '유럽 기차 여행에서의 낭만적인 청춘의 순간들을 3초 이내에 시선을 사로잡는 빠른 컷 전환과 자극적인 자막 구성으로 연출한 모바일 최적화 숏폼 시리즈.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    client: '유스 트래블 단체',
    date: '2026.05'
  },
  {
    id: 'p3',
    category: '예고편',
    title: '청춘MT "더 모먼트" 공식 예고편',
    description: '대학 연합 동아리에서 기획한 1박 2일 MT의 하이라이트 영상. 영화 예고편 연출 기법을 도입하여 기대감을 고조시키는 웅장한 사운드 트랙과 자막을 설계했습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80',
    client: '연합동아리 하랑',
    date: '2026.06'
  },
  {
    id: 'p4',
    category: '전체 편집',
    title: '다큐멘터리 "우리가 사랑했던 여름"',
    description: '청년 스타트업의 1년간의 치열했던 여정과 열정을 담아낸 장편 다큐멘터리 편집 제작물. 인터뷰 컷 구성과 극적인 오디오 믹싱, 부드러운 자막 디자인을 완성했습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
    client: '스타트업 스릴러',
    date: '2026.04'
  },
  {
    id: 'p5',
    category: '이미지 제작',
    title: '북카페 "하루한장" SNS 브랜딩 이미지',
    description: '청춘들이 편안하게 책을 읽고 사색하는 공간의 감성을 따뜻한 브라운 톤의 사진과 소감 구절로 담아낸 인스타그램 게시용 피드 이미지 세트.',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80',
    client: '하루한장 북카페',
    date: '2026.06'
  },
  {
    id: 'p6',
    category: '포스터 제작',
    title: '여름 영화제 초대 포스터',
    description: '야외 스크린 아래 돗자리를 펴고 즐기는 여름 밤 영화 감상제의 아날로그 시네마 포스터. 미니멀한 레이아웃과 필름 디테일로 청춘의 낭만을 자아냅니다.',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    client: '청춘시네마 소모임',
    date: '2026.06'
  }
];

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: 's1',
    date: '2026-06-03',
    title: '첫 예고편 업로드',
    description: '청춘MT "더 모먼트" 예고편 공식 유튜브 및 인스타그램 업로드'
  },
  {
    id: 's2',
    date: '2026-06-06',
    title: '메인 콘텐츠 공개',
    description: '스타트업 다큐멘터리 "우리가 사랑했던 여름" 전체 편집본 릴리즈'
  },
  {
    id: 's3',
    date: '2026-06-10',
    title: '포스터 제작 마감',
    description: '청춘시네마 여름 야외 영화감상회 정식 포스터 인쇄 및 배포 마감'
  },
  {
    id: 's4',
    date: '2026-06-15',
    title: '릴스 숏폼 현장 촬영',
    description: '대학 길거리 버스킹 동아리 콜라보레이션 쇼츠 촬영 진행 (홍대입구역)'
  },
  {
    id: 's5',
    date: '2026-06-20',
    title: '서포터즈 모집 시작',
    description: 'cheongchun_film 2기 영 크리에이터 서포터즈 모집 지원서 오픈 및 접수 시작'
  },
  {
    id: 's6',
    date: '2026-06-30',
    title: '월간 활동 정리 회의',
    description: '상반기 마지막 제작 프로젝트 성과 평가 및 7월 촬영 스케줄 세부 확정'
  }
];
