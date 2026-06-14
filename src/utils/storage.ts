import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { User, Reservation, SupporterApplicant, ScheduleItem, PortfolioItem } from '../types';
import { INITIAL_PORTFOLIOS, INITIAL_SCHEDULES } from '../data';

// Firestore error logging & diagnostics as mandated by Firebase skill instructions
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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
    name: '청춘필름 관리자',
    email: 'lch200048@gmail.com',
    phone: '010-8765-4321',
    role: 'admin'
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
    request: '여름 학술 캠프 및 해커톤 행사 오프닝 예고편입니다. 임팩트 있는 영화 예고편처럼 자막과 긴장감 있는 곡으로 연출 원합니다.',
    status: '확정',
    createdAt: '2026-06-06T09:30:00Z'
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
  }
];

const memoryStore: Record<string, string> = {};

const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return memoryStore[key] || null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      memoryStore[key] = value;
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      delete memoryStore[key];
    }
  }
};

// --- AUTH / USER UTILS ---

export function getStoredUser(): User | null {
  const user = safeLocalStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!user) return null;
  try {
    const parsedUser: User = JSON.parse(user);
    if (parsedUser.email.toLowerCase() === 'lch200048@gmail.com') {
      parsedUser.role = 'admin';
    } else {
      parsedUser.role = 'user';
    }
    return parsedUser;
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user: User | null) {
  if (user) {
    if (user.email.toLowerCase() === 'lch200048@gmail.com') {
      user.role = 'admin';
    } else {
      user.role = 'user';
    }
    safeLocalStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    safeLocalStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function getStoredUsers(): User[] {
  const users = safeLocalStorage.getItem(STORAGE_KEYS.USERS);
  let parsedUsers: User[] = [];
  if (!users) {
    parsedUsers = DEFAULT_USERS;
  } else {
    try {
      parsedUsers = JSON.parse(users);
    } catch {
      parsedUsers = DEFAULT_USERS;
    }
  }

  const updatedUsers = parsedUsers.map(u => {
    const isLch = u.email.toLowerCase() === 'lch200048@gmail.com';
    return {
      ...u,
      role: (isLch ? 'admin' : 'user') as 'admin' | 'user'
    };
  });

  if (!users) {
    safeLocalStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
  }
  return updatedUsers;
}

export function saveUser(user: User) {
  if (user.email.toLowerCase() === 'lch200048@gmail.com') {
    user.role = 'admin';
  } else {
    user.role = 'user';
  }
  const users = getStoredUsers();
  const existingIndex = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIndex > -1) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  safeLocalStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// --- FIRESTORE ACTIVE COLLECTION SERVICES ---

// Firebase Collection Paths defined in the Blueprint
const PATHS = {
  PRODUCTION_APPLICATIONS: 'productionApplications',
  SUPPORTER_APPLICATIONS: 'supporterApplications',
  INQUIRIES: 'inquiries',
  NOTICES: 'notices',
  PORTFOLIOS: 'portfolios',
  SCHEDULES: 'schedules'
};

// 1. 제작 신청 (productionApplications / Reservations)
export async function fetchProductionApplicationsFromFirestore(): Promise<Reservation[]> {
  try {
    const qSnap = await getDocs(collection(db, PATHS.PRODUCTION_APPLICATIONS));
    const items: Reservation[] = [];
    qSnap.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as Reservation);
    });
    // Save to sync local storage copy
    if (items.length > 0) {
      safeLocalStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(items));
    }
    return items;
  } catch (error) {
    console.warn("Could not fetch reservations from Firestore, resolving from local memory.", error);
    return getStoredReservations();
  }
}

export async function saveProductionApplicationToFirestore(reservation: Reservation): Promise<void> {
  const docRef = doc(db, PATHS.PRODUCTION_APPLICATIONS, reservation.id);
  try {
    await setDoc(docRef, reservation);
    // Sync local
    saveReservation(reservation);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PATHS.PRODUCTION_APPLICATIONS}/${reservation.id}`);
  }
}

export async function deleteProductionApplicationFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, PATHS.PRODUCTION_APPLICATIONS, id);
  try {
    await deleteDoc(docRef);
    // Sync local
    deleteReservation(id);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PATHS.PRODUCTION_APPLICATIONS}/${id}`);
  }
}

// 2. 서포터즈 신청 (supporterApplications)
export async function fetchSupporterApplicationsFromFirestore(): Promise<SupporterApplicant[]> {
  try {
    const qSnap = await getDocs(collection(db, PATHS.SUPPORTER_APPLICATIONS));
    const items: SupporterApplicant[] = [];
    qSnap.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as SupporterApplicant);
    });
    if (items.length > 0) {
      safeLocalStorage.setItem(STORAGE_KEYS.SUPPORTERS, JSON.stringify(items));
    }
    return items;
  } catch (error) {
    console.warn("Could not fetch supporters from Firestore, using local.", error);
    return getStoredSupporters();
  }
}

export async function saveSupporterApplicationToFirestore(supporter: SupporterApplicant): Promise<void> {
  const docRef = doc(db, PATHS.SUPPORTER_APPLICATIONS, supporter.id);
  try {
    await setDoc(docRef, supporter);
    saveSupporter(supporter);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PATHS.SUPPORTER_APPLICATIONS}/${supporter.id}`);
  }
}

// 3. 문의방 (inquiries)
export interface InquiryPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  message: string;
  createdAt: string;
}

export async function fetchInquiriesFromFirestore(): Promise<InquiryPayload[]> {
  try {
    const qSnap = await getDocs(collection(db, PATHS.INQUIRIES));
    const items: InquiryPayload[] = [];
    qSnap.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as InquiryPayload);
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PATHS.INQUIRIES);
    return [];
  }
}

export async function saveInquiryToFirestore(inquiry: InquiryPayload): Promise<void> {
  const docRef = doc(db, PATHS.INQUIRIES, inquiry.id);
  try {
    await setDoc(docRef, inquiry);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PATHS.INQUIRIES}/${inquiry.id}`);
  }
}

// 4. 공지방 (notices)
export interface NoticePayload {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export async function fetchNoticesFromFirestore(): Promise<NoticePayload[]> {
  try {
    const qSnap = await getDocs(collection(db, PATHS.NOTICES));
    const items: NoticePayload[] = [];
    qSnap.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as NoticePayload);
    });
    return items;
  } catch (error) {
    console.warn("Using public mock notices due to offline state or Firestore initialization.");
    return [
      {
        id: "notice_1",
        title: "청춘필름 6월 기획 시즌 오픈 공지",
        content: "여름 무대의 아날로그 포스터 기획 및 숏폼 릴스 촬영 사전 미팅 접수가 조기 마감될 수 있습니다. 필요하신 날짜를 선점해주세요.",
        author: "프로듀서 이재호",
        createdAt: "2026-06-01T10:00:00Z"
      }
    ];
  }
}

export async function saveNoticeToFirestore(notice: NoticePayload): Promise<void> {
  const docRef = doc(db, PATHS.NOTICES, notice.id);
  try {
    await setDoc(docRef, notice);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PATHS.NOTICES}/${notice.id}`);
  }
}

// 5. 필름챕 (portfolios)
export async function fetchPortfoliosFromFirestore(): Promise<PortfolioItem[]> {
  try {
    const qSnap = await getDocs(collection(db, PATHS.PORTFOLIOS));
    const items: PortfolioItem[] = [];
    qSnap.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as PortfolioItem);
    });
    if (items.length > 0) {
      safeLocalStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(items));
    }
    return items;
  } catch (error) {
    console.warn("Could not fetch portfolios from Firestore, using local.", error);
    return getStoredPortfolios();
  }
}

export async function savePortfolioToFirestore(item: PortfolioItem): Promise<void> {
  const docRef = doc(db, PATHS.PORTFOLIOS, item.id);
  try {
    await setDoc(docRef, item);
    savePortfolio(item);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PATHS.PORTFOLIOS}/${item.id}`);
  }
}

// 6. 대표 일정표 (schedules) - supporting
export async function fetchSchedulesFromFirestore(): Promise<ScheduleItem[]> {
  try {
    const qSnap = await getDocs(collection(db, PATHS.SCHEDULES));
    const items: ScheduleItem[] = [];
    qSnap.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as ScheduleItem);
    });
    if (items.length > 0) {
      safeLocalStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(items));
    }
    return items;
  } catch (error) {
    console.warn("Could not fetch schedules from Firestore, using local.", error);
    return getStoredSchedules();
  }
}

export async function saveScheduleToFirestore(schedule: ScheduleItem): Promise<void> {
  const docRef = doc(db, PATHS.SCHEDULES, schedule.id);
  try {
    await setDoc(docRef, schedule);
    saveSchedule(schedule);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PATHS.SCHEDULES}/${schedule.id}`);
  }
}

export async function deleteScheduleFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, PATHS.SCHEDULES, id);
  try {
    await deleteDoc(docRef);
    deleteSchedule(id);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PATHS.SCHEDULES}/${id}`);
  }
}

// --- SYNCHRONOUS FALLBACK UTILITIES ---

export function getStoredReservations(): Reservation[] {
  const res = safeLocalStorage.getItem(STORAGE_KEYS.RESERVATIONS);
  if (!res) {
    safeLocalStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(DEFAULT_RESERVATIONS));
    return DEFAULT_RESERVATIONS;
  }
  try {
    return JSON.parse(res);
  } catch {
    return DEFAULT_RESERVATIONS;
  }
}

export function saveReservation(reservation: Reservation) {
  const res = getStoredReservations();
  const existingIndex = res.findIndex(r => r.id === reservation.id);
  if (existingIndex > -1) {
    res[existingIndex] = reservation;
  } else {
    res.push(reservation);
  }
  safeLocalStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(res));
  return res;
}

export function deleteReservation(id: string) {
  const res = getStoredReservations();
  const filtered = res.filter(r => r.id !== id);
  safeLocalStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(filtered));
  return filtered;
}

export function getStoredSupporters(): SupporterApplicant[] {
  const sups = safeLocalStorage.getItem(STORAGE_KEYS.SUPPORTERS);
  if (!sups) {
    safeLocalStorage.setItem(STORAGE_KEYS.SUPPORTERS, JSON.stringify(DEFAULT_SUPPORTERS));
    return DEFAULT_SUPPORTERS;
  }
  try {
    return JSON.parse(sups);
  } catch {
    return DEFAULT_SUPPORTERS;
  }
}

export function saveSupporter(supporter: SupporterApplicant) {
  const sups = getStoredSupporters();
  sups.push(supporter);
  safeLocalStorage.setItem(STORAGE_KEYS.SUPPORTERS, JSON.stringify(sups));
  return sups;
}

export function getStoredSchedules(): ScheduleItem[] {
  const schedules = safeLocalStorage.getItem(STORAGE_KEYS.SCHEDULES);
  if (!schedules) {
    safeLocalStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(INITIAL_SCHEDULES));
    return INITIAL_SCHEDULES;
  }
  try {
    return JSON.parse(schedules);
  } catch {
    return INITIAL_SCHEDULES;
  }
}

export function saveSchedule(schedule: ScheduleItem) {
  const schedules = getStoredSchedules();
  const index = schedules.findIndex(s => s.id === schedule.id);
  if (index > -1) {
    schedules[index] = schedule;
  } else {
    schedules.push(schedule);
  }
  safeLocalStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  return schedules;
}

export function deleteSchedule(id: string) {
  const schedules = getStoredSchedules();
  const filtered = schedules.filter(s => s.id !== id);
  safeLocalStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(filtered));
  return filtered;
}

export function getStoredPortfolios(): PortfolioItem[] {
  const portfolios = safeLocalStorage.getItem(STORAGE_KEYS.PORTFOLIOS);
  if (!portfolios) {
    safeLocalStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(INITIAL_PORTFOLIOS));
    return INITIAL_PORTFOLIOS;
  }
  try {
    return JSON.parse(portfolios);
  } catch {
    return INITIAL_PORTFOLIOS;
  }
}

export function savePortfolio(item: PortfolioItem) {
  const portfolios = getStoredPortfolios();
  portfolios.unshift(item);
  safeLocalStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(portfolios));
  return portfolios;
}
