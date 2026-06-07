import { User, Reservation, SupporterApplicant, ScheduleItem, PortfolioItem } from '../types';
import { INITIAL_PORTFOLIOS, INITIAL_SCHEDULES } from '../data';

const STORAGE_KEYS = {
  CURRENT_USER: 'cf_current_user',
  USERS: 'cf_users',
  RESERVATIONS: 'cf_reservations',
  SUPPORTERS: 'cf_supporters',
  SCHEDULES: 'cf_schedules',
  PORTFOLIOS: 'cf_portfolios'
};

const DEFAULT_USERS: User[] = [
  {
    id: 'u_admin',
    name: 'cheongchun_film 관리자',
    email: 'admin@cheongchun.com',
    phone: '010-1234-5678',
    role: 'admin'
  },
  {
    id: 'u_tester',
    name: '이청춘',
    email: 'lch200048@gmail.com',
    phone: '010-8765-4321',
    role: 'user'
  }
];

const DEFAULT_RESERVATIONS: Reservation[] = [
  {
    id: 'res_1',
    userId: 'u_user1',
    userName: '김민지',
    userPhone: '010-1111-2222',
    userEmail: 'minji@gmail.com',
    serviceType: '포스터 제작',
    date: '2026-06-10',
    time: '오후 2시',
    request: '동아리 창립 기념 공연 포스터입니다. 아날로그 필름과 무대 조명의 따뜻한 감성이 느껴지도록 제작 부탁드립니다.',
    status: '대기',
    createdAt: '2026-06-05T12:00:00Z'
  },
  {
    id: 'res_2',
    userId: 'u_user2',
    userName: '이재호',
    userPhone: '010-3333-4444',
    userEmail: 'jaeho@gmail.com',
    serviceType: '예고편 제작',
    date: '2026-06-12',
    time: '오후 6시',
    request: '여름 학술 캠프 및 해커톤 행사 오프닝 예고편입니다. 임팩트 있는 영화 예인처럼 자막과 긴장감 있는 곡으로 연출 원합니다.',
    status: '확정',
    createdAt: '2026-06-06T09:30:00Z'
  },
  {
    id: 'res_3',
    userId: 'u_tester',
    userName: '이청춘',
    userPhone: '010-8765-4321',
    userEmail: 'lch200048@gmail.com',
    serviceType: '릴스 숏폼',
    date: '2026-06-15',
    time: '오후 8시',
    request: '전통시장 청년 상인 인터뷰 및 감성 쇼츠 영상입니다. 첫 3초 시선을 사로잡는 오디오 컷과 센스 있는 속도감을 표현해주세요.',
    status: '진행중',
    createdAt: '2020-06-07T10:15:00Z'
  }
];

const DEFAULT_SUPPORTERS: SupporterApplicant[] = [
  {
    id: 'sup_1',
    name: '김서연',
    phone: '010-5555-6666',
    email: 'seoyeon@daum.net',
    field: '릴스 · 숏폼 제작',
    reason: '인스타그램에서 숏폼 편집을 독학하며 사람들의 하트를 받는 즐거움을 배웠습니다. cheongchun_film만의 독특한 필름 빈티지 톤앤매너로 많은 이들의 찬란한 일상을 엮어내고 싶어 지원합니다.',
    createdAt: '2026-06-07T05:20:00Z'
  },
  {
    id: 'sup_2',
    name: '박도현',
    phone: '010-7777-8888',
    email: 'dohyun_p@naver.com',
    field: '포스터 및 이미지 디자인',
    reason: '시각디자인을 전공 중이며, 아날로그 인화 기법과 필름 영화 포토 카드를 수집하는 취미가 있습니다. 감성을 자극하는 색감과 기발한 레이아웃으로 cheongchun_film의 신뢰도를 빛내겠습니다.',
    createdAt: '2026-06-07T11:40:00Z'
  }
];

export function getStoredUser(): User | null {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
}

export function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function getStoredUsers(): User[] {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  return JSON.parse(users);
}

export function saveUser(user: User) {
  const users = getStoredUsers();
  const existingIndex = users.findIndex(u => u.id === user.id || u.email === user.email);
  if (existingIndex > -1) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getStoredReservations(): Reservation[] {
  const res = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
  if (!res) {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(DEFAULT_RESERVATIONS));
    return DEFAULT_RESERVATIONS;
  }
  return JSON.parse(res);
}

export function saveReservation(reservation: Reservation) {
  const res = getStoredReservations();
  const existingIndex = res.findIndex(r => r.id === reservation.id);
  if (existingIndex > -1) {
    res[existingIndex] = reservation;
  } else {
    res.push(reservation);
  }
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(res));
  return res;
}

export function deleteReservation(id: string) {
  const res = getStoredReservations();
  const filtered = res.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(filtered));
  return filtered;
}

export function getStoredSupporters(): SupporterApplicant[] {
  const sups = localStorage.getItem(STORAGE_KEYS.SUPPORTERS);
  if (!sups) {
    localStorage.setItem(STORAGE_KEYS.SUPPORTERS, JSON.stringify(DEFAULT_SUPPORTERS));
    return DEFAULT_SUPPORTERS;
  }
  return JSON.parse(sups);
}

export function saveSupporter(supporter: SupporterApplicant) {
  const sups = getStoredSupporters();
  sups.push(supporter);
  localStorage.setItem(STORAGE_KEYS.SUPPORTERS, JSON.stringify(sups));
  return sups;
}

export function getStoredSchedules(): ScheduleItem[] {
  const schedules = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
  if (!schedules) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(INITIAL_SCHEDULES));
    return INITIAL_SCHEDULES;
  }
  return JSON.parse(schedules);
}

export function saveSchedule(schedule: ScheduleItem) {
  const schedules = getStoredSchedules();
  const index = schedules.findIndex(s => s.id === schedule.id);
  if (index > -1) {
    schedules[index] = schedule;
  } else {
    schedules.push(schedule);
  }
  localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  return schedules;
}

export function deleteSchedule(id: string) {
  const schedules = getStoredSchedules();
  const filtered = schedules.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(filtered));
  return filtered;
}

export function getStoredPortfolios(): PortfolioItem[] {
  const portfolios = localStorage.getItem(STORAGE_KEYS.PORTFOLIOS);
  if (!portfolios) {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(INITIAL_PORTFOLIOS));
    return INITIAL_PORTFOLIOS;
  }
  return JSON.parse(portfolios);
}

export function savePortfolio(item: PortfolioItem) {
  const portfolios = getStoredPortfolios();
  portfolios.unshift(item); // Add to the top of the portforio
  localStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(portfolios));
  return portfolios;
}
