export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export type ReservationStatus = '대기' | '확정' | '진행중' | '완료' | '취소';

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  serviceType: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "14:00" or "오후 3시"
  request: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface SupporterApplicant {
  id: string;
  name: string;
  phone: string;
  email: string;
  field: string;
  reason: string;
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
}

export interface PortfolioItem {
  id: string;
  category: '이미지 제작' | '포스터 제작' | '릴스 숏폼' | '예고편' | '전체 편집';
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  client?: string;
  date?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ActiveTab = 'Home' | 'Service' | 'Portfolio' | 'Reservation' | 'Schedule' | 'Supporters' | 'MyPage' | 'Admin';
