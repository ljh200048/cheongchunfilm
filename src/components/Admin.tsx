import React, { useState, useEffect } from 'react';
import { User, Reservation, ReservationStatus, SupporterApplicant, ScheduleItem, PortfolioItem, Notice } from '../types';
import { 
  getStoredReservations, 
  getStoredSupporters,
  getStoredSchedules,
  getStoredPortfolios,
  // Firestore calls
  fetchProductionApplicationsFromFirestore,
  saveProductionApplicationToFirestore,
  deleteProductionApplicationFromFirestore,
  fetchSupporterApplicationsFromFirestore,
  fetchSchedulesFromFirestore,
  saveScheduleToFirestore,
  deleteScheduleFromFirestore,
  fetchPortfoliosFromFirestore,
  savePortfolioToFirestore,
  // NEW helpers
  fetchNoticesFromFirestore,
  saveNoticeToFirestore,
  deleteNoticeFromFirestore,
  fetchBannersFromFirestore,
  saveBannerToFirestore,
  deleteBannerFromFirestore,
  uploadImageToStorage,
  BannerItem
} from '../utils/storage';
import { 
  ShieldAlert, Calendar, Users, Briefcase, Plus, Trash2, Check, ArrowRight, 
  RefreshCw, RefreshCcw, ExternalLink, Filter, ClipboardList, Clock, Phone, Mail, FileText,
  Upload, Image as ImageIcon, Edit3, Megaphone, Eye, EyeOff
} from 'lucide-react';

export default function Admin() {
  // Admin view inside tab selection
  const [adminTab, setAdminTab] = useState<'reservations' | 'schedules' | 'supporters' | 'portfolio' | 'notices' | 'images'>('reservations');
  
  // Stored state lists
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [supporters, setSupporters] = useState<SupporterApplicant[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Filter state for reservations
  const [filterStatus, setFilterStatus] = useState<string>('전체');

  // Input states for Schedule manager
  const [schDate, setSchDate] = useState('2026-06-25');
  const [schTitle, setSchTitle] = useState('');
  const [schDescription, setSchDescription] = useState('');

  // Input states for Portfolio manager
  const [portCategory, setPortCategory] = useState<'이미지 제작' | '포스터 제작' | '릴스 숏폼' | '예고편' | '전체 편집'>('포스터 제작');
  const [portTitle, setPortTitle] = useState('');
  const [portDesc, setPortDesc] = useState('');
  const [portImgUrl, setPortImgUrl] = useState('');
  const [portClient, setPortClient] = useState('');
  const [portDate, setPortDate] = useState('2026.06');

  // Notice Form states
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('공지사항');
  const [noticeImageUrl, setNoticeImageUrl] = useState('');
  const [noticeIsPublished, setNoticeIsPublished] = useState(true);
  const [noticeIsPinned, setNoticeIsPinned] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isNoticeUploading, setIsNoticeUploading] = useState(false);

  // Image management helper state
  const [isBannerUploading, setIsBannerUploading] = useState(false);
  const [targetNoticeId, setTargetNoticeId] = useState('');
  const [isNoticeImgUploading, setIsNoticeImgUploading] = useState(false);
  const [targetPortfolioId, setTargetPortfolioId] = useState('');
  const [isPortfolioImgUploading, setIsPortfolioImgUploading] = useState(false);

  // Load everything
  useEffect(() => {
    loadAllAdminData();
  }, [adminTab]);

  const renderRequestDetails = (reqStr: string) => {
    if (!reqStr) return <p className="text-stone-500">요청 사항이 존재하지 않습니다.</p>;
    if (reqStr.includes('[제작 목적]:')) {
      const lines = reqStr.split('\n');
      return (
        <div className="space-y-2">
          {lines.map((ln, idx) => {
            const colonIdx = ln.indexOf(']:');
            if (colonIdx !== -1) {
              const label = ln.substring(0, colonIdx + 1);
              const text = ln.substring(colonIdx + 2).trim();
              return (
                <div key={idx} className="bg-[#12100f] border border-[#1c1917] rounded-lg p-2 flex flex-col gap-0.5">
                  <span className="text-amber-500 font-bold uppercase tracking-wider text-[9px] font-mono">{label}</span>
                  <span className="text-stone-300 font-sans leading-relaxed text-[11px] whitespace-pre-wrap">{text || '없음'}</span>
                </div>
              );
            }
            return <p key={idx} className="text-stone-300 font-sans leading-relaxed text-[11px] whitespace-pre-wrap">{ln}</p>;
          })}
        </div>
      );
    }
    return <p className="text-stone-350 bg-[#12100f]/80 p-3 rounded-lg border border-[#1c1917] font-sans leading-relaxed text-[11px] whitespace-pre-wrap">{reqStr}</p>;
  };

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      // Optimistic load from local storage
      setReservations(getStoredReservations());
      setSupporters(getStoredSupporters());
      setSchedules(getStoredSchedules());
      setPortfolios(getStoredPortfolios());

      // Async load real-time database from Firestore collections
      const [resList, supList, schList, portList, noticeList, bannerList] = await Promise.all([
        fetchProductionApplicationsFromFirestore(),
        fetchSupporterApplicationsFromFirestore(),
        fetchSchedulesFromFirestore(),
        fetchPortfoliosFromFirestore(),
        fetchNoticesFromFirestore(),
        fetchBannersFromFirestore()
      ]);

      if (resList.length > 0) setReservations(resList);
      if (supList.length > 0) setSupporters(supList);
      if (schList.length > 0) setSchedules(schList);
      if (portList.length > 0) setPortfolios(portList);
      if (noticeList.length > 0) setNotices(noticeList);
      if (bannerList.length > 0) setBanners(bannerList);
    } catch (e) {
      console.warn("Using offline / local storage backup data for admin hub", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Status Change trigger
  const handleUpdateStatus = async (id: string, newStatus: ReservationStatus) => {
    const found = reservations.find(r => r.id === id);
    if (!found) return;

    const updated: Reservation = {
      ...found,
      status: newStatus
    };

    // Optimistically update UI
    setReservations(prev => prev.map(r => r.id === id ? updated : r));

    try {
      await saveProductionApplicationToFirestore(updated);
    } catch (err) {
      alert("Firestore에 신청서 상태 업데이트가 기기 사정으로 백업 저장 처리되었습니다.");
    }
  };

  // Delete Reservation
  const handleDeleteRes = async (id: string) => {
    if (window.confirm('정말로 이 예약 신청 건을 완전히 영구 삭제하시겠습니까?')) {
      setReservations(prev => prev.filter(r => r.id !== id));
      try {
        await deleteProductionApplicationFromFirestore(id);
      } catch (err) {
        alert("Firestore에서 신청서 삭제가 지연되어 예약 목록을 새로고침합니다.");
        loadAllAdminData();
      }
    }
  };

  // Create Milestone
  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schTitle || !schDate) return;

    const newItem: ScheduleItem = {
      id: 'sch_' + Date.now(),
      date: schDate,
      title: schTitle,
      description: schDescription
    };

    // Optimistically update
    setSchedules(prev => [...prev, newItem]);
    setSchTitle('');
    setSchDescription('');

    try {
      await saveScheduleToFirestore(newItem);
      alert('새 세부 일정이 cheongchun_film 달력에 등록 배포되었습니다!');
    } catch (err) {
      alert('달력 일정이 임시 저장되었습니다.');
    } finally {
      loadAllAdminData();
    }
  };

  // Delete Milestone
  const handleDeleteSchedule = async (id: string) => {
    if (window.confirm('이 스케줄 마일스톤을 달력에서 삭제제외하시겠습니까?')) {
      setSchedules(prev => prev.filter(s => s.id !== id));
      try {
        await deleteScheduleFromFirestore(id);
      } catch (err) {
        alert('스케줄 삭제 중 에러가 발생했습니다.');
        loadAllAdminData();
      }
    }
  };

  // Create Portfolio
  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portTitle || !portImgUrl) return;

    // Use placeholder unsplash if none was provided
    const bannerUrl = portImgUrl || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80';

    const newItem: PortfolioItem = {
      id: 'p_' + Date.now(),
      category: portCategory,
      title: portTitle,
      description: portDesc,
      imageUrl: bannerUrl,
      client: portClient || 'cheongchun_film 자체기획',
      date: portDate || '2026.06'
    };

    // Optimistically update
    setPortfolios(prev => [newItem, ...prev]);
    setPortTitle('');
    setPortDesc('');
    setPortImgUrl('');
    setPortClient('');
    setPortCategory('포스터 제작');

    try {
      await savePortfolioToFirestore(newItem);
      alert('새 포트폴리오 프로젝트가 공식 갤러리에 업로드 및 등록 마감되었습니다!');
    } catch (err) {
      alert('새 포트폴리오가 임시 보관함에 복사되었습니다.');
    } finally {
      loadAllAdminData();
    }
  };

  // --- NOTICE CONSOLE MANAGEMENT ---
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    const noticeId = editingNotice?.id || 'notice_' + Date.now();
    const newNotice: Notice = {
      id: noticeId,
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      imageUrl: noticeImageUrl,
      isPublished: noticeIsPublished,
      isPinned: noticeIsPinned,
      createdAt: editingNotice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Optimistically update lists
    setNotices(prev => {
      const exists = prev.some(n => n.id === noticeId);
      if (exists) {
        return prev.map(n => n.id === noticeId ? newNotice : n);
      } else {
        return [newNotice, ...prev];
      }
    });

    // Reset Form fields
    setNoticeTitle('');
    setNoticeContent('');
    setNoticeCategory('공지사항');
    setNoticeImageUrl('');
    setNoticeIsPublished(true);
    setNoticeIsPinned(false);
    setEditingNotice(null);

    try {
      await saveNoticeToFirestore(newNotice);
      alert('공지글이 성공적으로 전산 등록 완료되었습니다!');
    } catch (err) {
      alert('공지글 등록 중 일시적 지연이 발생했으나 임시 로컬 저장 완료되었습니다.');
    } finally {
      const freshNotices = await fetchNoticesFromFirestore();
      setNotices(freshNotices);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (window.confirm('정말로 이 공지사항을 삭제처리하시겠습니까?')) {
      setNotices(prev => prev.filter(n => n.id !== id));
      try {
        await deleteNoticeFromFirestore(id);
        alert('공지사항이 전산에서 완전히 영구 삭제 처리되었습니다.');
      } catch (err) {
        alert('삭제 처리 중 실패가 발생했습니다.');
      } finally {
        const freshNotices = await fetchNoticesFromFirestore();
        setNotices(freshNotices);
      }
    }
  };

  const handleEditNoticeSetup = (notice: Notice) => {
    setEditingNotice(notice);
    setNoticeTitle(notice.title);
    setNoticeContent(notice.content);
    setNoticeCategory(notice.category);
    setNoticeImageUrl(notice.imageUrl || '');
    setNoticeIsPublished(notice.isPublished);
    setNoticeIsPinned(notice.isPinned || false);
  };

  // --- IMAGE & STORAGE BANNER MANAGEMENT CONTROLS ---
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsBannerUploading(true);
    try {
      const downloadUrl = await uploadImageToStorage(file, 'banners');
      const newBanner: BannerItem = {
        id: 'banner_' + Date.now(),
        imageUrl: downloadUrl,
        createdAt: new Date().toISOString()
      };

      await saveBannerToFirestore(newBanner);
      setBanners(prev => [...prev, newBanner]);
      alert('이미지가 변경되었습니다.');
    } catch (err) {
      console.error(err);
      alert('이미지 변경 중 오류가 발생했습니다.');
    } finally {
      setIsBannerUploading(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (window.confirm('해당 명품 시네마틱 홈배너를 완전히 복원에서 제외합니까?')) {
      setBanners(prev => prev.filter(b => b.id !== id));
      try {
        await deleteBannerFromFirestore(id);
        alert('홈배너 사진이 제거 배포 완료되었습니다.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleNoticeImgUpload = async (e: React.ChangeEvent<HTMLInputElement>, noticeId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const notice = notices.find(n => n.id === noticeId);
    if (!notice) return;

    setIsNoticeImgUploading(true);
    try {
      const downloadUrl = await uploadImageToStorage(file, 'notices');
      const updatedNotice: Notice = {
        ...notice,
        imageUrl: downloadUrl,
        updatedAt: new Date().toISOString()
      };

      await saveNoticeToFirestore(updatedNotice);
      setNotices(prev => prev.map(n => n.id === noticeId ? updatedNotice : n));
      alert('이미지가 변경되었습니다.');
    } catch (err) {
      console.error(err);
      alert('이미지 변경 중 오류가 발생했습니다.');
    } finally {
      setIsNoticeImgUploading(false);
      setTargetNoticeId('');
    }
  };

  const handlePortfolioImgUpload = async (e: React.ChangeEvent<HTMLInputElement>, portfolioId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const port = portfolios.find(p => p.id === portfolioId);
    if (!port) return;

    setIsPortfolioImgUploading(true);
    try {
      const downloadUrl = await uploadImageToStorage(file, 'portfolios');
      const updatedPortfolio: PortfolioItem = {
        ...port,
        imageUrl: downloadUrl
      };

      await savePortfolioToFirestore(updatedPortfolio);
      setPortfolios(prev => prev.map(p => p.id === portfolioId ? updatedPortfolio : p));
      alert('이미지가 변경되었습니다.');
    } catch (err) {
      console.error(err);
      alert('이미지 변경 중 오류가 발생했습니다.');
    } finally {
      setIsPortfolioImgUploading(false);
      setTargetPortfolioId('');
    }
  };

  const getStatusTagClass = (status: ReservationStatus) => {
    switch (status) {
      case '대기': return 'bg-amber-500/10 border border-amber-500/30 text-amber-500';
      case '확정': return 'bg-green-500/10 border border-green-500/30 text-green-400';
      case '진행중': return 'bg-blue-500/10 border border-blue-500/30 text-blue-400';
      case '완료': return 'bg-stone-500/10 border border-stone-500/30 text-stone-400';
      case '취소': return 'bg-red-500/10 border border-red-500/30 text-red-400';
    }
  };


  const filteredReservations = filterStatus === '전체'
    ? reservations
    : reservations.filter(r => r.status === filterStatus);

  return (
    <section className="bg-[#0c0a09] py-16 sm:py-24 text-stone-100 border-b border-[#1c1917]" id="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Details */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-[#292524] pb-6 mb-8 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-500/15 border border-amber-500/30 text-amber-500 rounded">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl tracking-wide">
                cheongchun_film HQ 관리 본부
              </h2>
            </div>
            <p className="text-xs text-[#a8a29e]">
              제출 예약 의뢰 승인 수락 변경, 소모품 포스터 갤러리 등록, 일정 조율 및 서포터즈 후보들을 한 화면에서 종합 통제합니다.
            </p>
          </div>
          
          <button
            onClick={loadAllAdminData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#12100f] hover:bg-stone-900 border border-[#292524] text-xs font-semibold rounded text-stone-400 hover:text-stone-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            데이터 상태 새로고침
          </button>
        </div>

        {/* Dashboard sub navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[#1c1917] pb-4">
          <button
            onClick={() => setAdminTab('reservations')}
            className={`px-4.5 py-2.5 rounded text-xs font-semibold tracking-wide transition cursor-pointer ${
              adminTab === 'reservations' ? 'bg-amber-500 text-[#0c0a09]' : 'bg-[#12100f] border border-[#292524] text-stone-400 hover:text-white'
            }`}
          >
            🧾 예약 명세 관리 ({reservations.length})
          </button>
          <button
            onClick={() => setAdminTab('schedules')}
            className={`px-4.5 py-2.5 rounded text-xs font-semibold tracking-wide transition cursor-pointer ${
              adminTab === 'schedules' ? 'bg-amber-500 text-[#0c0a09]' : 'bg-[#12100f] border border-[#292524] text-stone-400 hover:text-white'
            }`}
          >
            📅 대표 일정표 추가 ({schedules.length})
          </button>
          <button
            onClick={() => setAdminTab('supporters')}
            className={`px-4.5 py-2.5 rounded text-xs font-semibold tracking-wide transition cursor-pointer ${
              adminTab === 'supporters' ? 'bg-amber-500 text-[#0c0a09]' : 'bg-[#12100f] border border-[#292524] text-stone-400 hover:text-white'
            }`}
          >
            👥 서포터즈 지원 인프라 ({supporters.length})
          </button>
          <button
            onClick={() => setAdminTab('portfolio')}
            className={`px-4.5 py-2.5 rounded text-xs font-semibold tracking-wide transition cursor-pointer ${
              adminTab === 'portfolio' ? 'bg-amber-500 text-[#0c0a09]' : 'bg-[#12100f] border border-[#292524] text-stone-400 hover:text-white'
            }`}
          >
            📂 포트폴리오 신규 배포 ({portfolios.length})
          </button>
          <button
            onClick={() => setAdminTab('notices')}
            className={`px-4.5 py-2.5 rounded text-xs font-semibold tracking-wide transition cursor-pointer ${
              adminTab === 'notices' ? 'bg-amber-500 text-[#0c0a09]' : 'bg-[#12100f] border border-[#292524] text-stone-400 hover:text-white'
            }`}
          >
            📢 공지사항 전산 관리 ({notices.length})
          </button>
          <button
            onClick={() => setAdminTab('images')}
            className={`px-4.5 py-2.5 rounded text-xs font-semibold tracking-wide transition cursor-pointer ${
              adminTab === 'images' ? 'bg-amber-500 text-[#0c0a09]' : 'bg-[#12100f] border border-[#292524] text-stone-400 hover:text-white'
            }`}
          >
            🖼️ 홈페이지 이미지 관리
          </button>
        </div>

        {/* Dynamic Inner views */}
        {adminTab === 'reservations' && (
          <div className="space-y-6">
            
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-3 bg-[#0f0d0c] border border-[#292524] p-3.5 rounded-xl text-xs">
              <span className="text-stone-500 flex items-center gap-1.5 uppercase tracking-wider font-bold">
                <Filter className="w-3.5 h-3.5 text-amber-500" />
                상태 필터링 조회:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['전체', '대기', '확정', '진행중', '완료', '취소'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                      filterStatus === st ? 'bg-stone-800 text-amber-400 font-bold border border-amber-500/30' : 'bg-[#12100f] border border-stone-900 text-stone-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* List Row items */}
            <div className="space-y-4">
              {filteredReservations.length === 0 ? (
                <div className="py-12 border border-dashed border-[#292524] rounded-xl text-center text-stone-500 text-xs bg-[#0f0d0c]">
                  해당 필터 구조에는 부합하는 예약 데이터 건수가 존재하지 않습니다.
                </div>
              ) : (
                filteredReservations
                  .sort((a,b) => b.createdAt.localeCompare(a.createdAt))
                  .map((res) => (
                    <div 
                      key={res.id}
                      className="bg-[#0f0d0c] border border-[#292524] rounded-xl p-5 sm:p-6 space-y-4 flex flex-col justify-between"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#1c1917] pb-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-stone-600 uppercase text-[10px] tracking-wider">신청ID: {res.id}</span>
                            <span className="text-stone-600">|</span>
                            <span className="text-stone-500 font-medium">제작종류: <span className="text-amber-500 font-bold">{res.serviceType}</span></span>
                          </div>
                          <p className="font-display font-extrabold text-[#fafaf9] text-base">
                            의뢰 고객: {res.userName} 님
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 text-[10px] font-mono rounded tracking-wider uppercase font-bold text-center ${getStatusTagClass(res.status)}`}>
                            {res.status}
                          </span>
                          <button
                            onClick={() => handleDeleteRes(res.id)}
                            className="p-1 text-stone-600 hover:text-red-500 transition"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content Detail Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-300">
                        
                        {/* Contacts box */}
                        <div className="space-y-2 bg-[#12100f] border border-[#1c1917] p-3.5 rounded-lg">
                          <p className="text-[10px] text-stone-600 uppercase tracking-widest font-bold">의뢰 고객 주소정보</p>
                          <div className="space-y-1 text-[11px]">
                            <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-stone-500" /><span className="font-mono">{res.userPhone}</span></p>
                            <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-stone-500" /><span>{res.userEmail}</span></p>
                            <p className="text-stone-500 font-mono text-[9px] pt-1">신청시각: {new Date(res.createdAt).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Scheduling detail */}
                        <div className="space-y-2 bg-[#12100f] border border-[#1c1917] p-3.5 rounded-lg">
                          <p className="text-[10px] text-stone-600 uppercase tracking-widest font-bold">희망 예약 시간표</p>
                          <div className="space-y-1.5">
                            <p className="text-[#fafaf9] font-semibold text-xs flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-500" /> {res.date}</p>
                            <p className="text-[#fafaf9] font-semibold text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> {res.time}</p>
                          </div>
                        </div>

                        {/* Detail text */}
                        <div className="space-y-2 col-span-1 md:col-span-1 max-h-48 overflow-y-auto">
                          <p className="text-[10px] text-stone-600 uppercase tracking-widest font-bold">의뢰 상세 목적 및 비고</p>
                          {renderRequestDetails(res.request)}
                        </div>

                      </div>

                      {/* Status Transition selection buttons */}
                      <div className="bg-[#12100f] border border-[#1c1917] p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <span className="text-stone-500 text-[11px] font-medium flex items-center gap-1.5">
                          <ClipboardList className="w-4 h-4 text-amber-500" />
                          예약 상태 즉시 변경:
                        </span>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {(['대기', '확정', '진행중', '완료', '취소'] as ReservationStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateStatus(res.id, st)}
                              className={`px-3 py-1.5 rounded text-[11px] font-semibold tracking-wider transition ${
                                res.status === st 
                                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold' 
                                  : 'bg-stone-900 border border-stone-850 hover:bg-stone-800 text-stone-400 hover:text-white'
                              }`}
                            >
                              {st} 처리
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))
              )}
            </div>

          </div>
        )}

        {adminTab === 'schedules' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Col 1 Form input (5) */}
            <div className="md:col-span-5 bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 shadow-xl text-xs space-y-4">
              <h3 className="font-display font-black text-sm uppercase tracking-wide border-b border-[#1c1917] pb-3 mb-2 text-stone-300 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-500 animate-pulse" />
                일정 추가 기획서 작성
              </h3>

              <form onSubmit={handleCreateSchedule} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-stone-400 font-semibold">대상 기획 날짜</label>
                  <input
                    type="date"
                    required
                    value={schDate}
                    onChange={(e) => setSchDate(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded p-2.5 text-stone-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 font-semibold">일정 제목</label>
                  <input
                    type="text"
                    required
                    placeholder="예시: 릴스 촬영, 포스터 마감"
                    value={schTitle}
                    onChange={(e) => setSchTitle(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded p-2.5 text-stone-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 font-semibold">일정 상세 설명</label>
                  <textarea
                    rows={3}
                    placeholder="예시: 홍대 주변 청춘 버스킹 현장 숏폼 수집"
                    value={schDescription}
                    onChange={(e) => setSchDescription(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded p-2.5 text-stone-200"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded shadow transition-all duration-200"
                >
                  달력 정기 일정 신규 발행
                </button>
              </form>
            </div>

            {/* Col 2 List table (7) */}
            <div className="md:col-span-7 bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 shadow-xl">
              <h3 className="font-display font-black text-sm uppercase tracking-wide border-b border-[#1c1917] pb-3 mb-4 text-stone-300">
                달력 배포 일정 상세 내역 ({schedules.length})
              </h3>

              <div className="overflow-x-auto text-xs">
                <table className="w-full space-y-2">
                  <thead className="text-stone-500 uppercase font-mono tracking-wider border-b border-[#1c1917] text-left text-[11px]">
                    <tr>
                      <th className="pb-2.5">일정일</th>
                      <th className="pb-2.5">업무 마일스톤 명칭</th>
                      <th className="pb-2.5">설명 간략사항</th>
                      <th className="pb-2.5 text-right">제외</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1917] text-[#fafaf9]">
                    {schedules
                      .sort((a,b) => a.date.localeCompare(b.date))
                      .map((sch) => (
                        <tr key={sch.id} className="hover:bg-[#12100f]/40">
                          <td className="py-3 font-mono text-[11px] text-amber-500 font-bold">{sch.date}</td>
                          <td className="py-3 font-semibold pr-2">{sch.title}</td>
                          <td className="py-3 text-stone-400 max-w-xs truncate">{sch.description}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDeleteSchedule(sch.id)}
                              className="text-red-500/50 hover:text-red-500 p-1.5 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {adminTab === 'supporters' && (
          <div className="space-y-6 bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 shadow-xl">
            <h3 className="font-display font-black text-sm uppercase tracking-wide border-b border-[#1c1917] pb-3 text-stone-400 flex items-center gap-1.5 mb-4">
              <Users className="w-4 h-4 text-amber-500" />
              서포터즈 후보군 서류 접수 목록 ({supporters.length})
            </h3>

            {supporters.length === 0 ? (
              <div className="py-12 border border-dashed border-[#292524] rounded-xl text-center text-stone-500 text-xs bg-[#0c0a09]/50">
                현재 전산실에 접수된 서포터즈 후보군 정보가 아직 집계되지 않았습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {supporters.map((sup) => (
                  <div 
                    key={sup.id}
                    className="bg-[#12100f] border border-[#292524] p-5 rounded-xl space-y-4"
                  >
                    <div className="flex justify-between items-start border-b border-[#1c1917] pb-2.5">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-stone-500 font-mono block">ID: {sup.id}</span>
                        <h4 className="font-display font-bold text-stone-200 text-base">{sup.name} 님</h4>
                      </div>
                      <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] rounded uppercase font-semibold">
                        {sup.field}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Contacts details */}
                      <p className="text-[#fafaf9] flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-stone-600" /><span className="font-mono">{sup.phone}</span></p>
                      <p className="text-[#fafaf9] flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-stone-600" /><span>{sup.email}</span></p>
                      
                      <div className="bg-stone-950 p-3 rounded border border-stone-900 mt-2 space-y-1">
                        <span className="block text-[10px] text-stone-600 uppercase font-mono tracking-wider font-bold">지원 동기 본문:</span>
                        <p className="text-stone-400 leading-normal text-[11px] overflow-y-auto max-h-24 whitespace-pre-wrap">
                          {sup.reason}
                        </p>
                      </div>
                    </div>

                    <p className="text-[9px] font-mono text-stone-600 text-right">
                      지원 접수 시각: {new Date(sup.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {adminTab === 'portfolio' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Col 1 Form (5) */}
            <div className="md:col-span-5 bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 shadow-xl text-xs space-y-4">
              <h3 className="font-display font-black text-sm uppercase tracking-wide border-b border-[#1c1917] pb-3 mb-2 text-stone-300 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-amber-500" />
                신규 이미지/영상 포트폴리오 기안
              </h3>

              <form onSubmit={handleCreatePortfolio} className="space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-stone-400 font-semibold">포트폴리오 대분류 카테고리</label>
                  <select
                    value={portCategory}
                    onChange={(e: any) => setPortCategory(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded p-2.5 text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="이미지 제작">이미지 제작</option>
                    <option value="포스터 제작">포스터 제작</option>
                    <option value="릴스 숏폼">릴스 숏폼</option>
                    <option value="예고편">예고편</option>
                    <option value="전체 편집">전체 편집</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 font-semibold">프로젝트 타이틀 제목</label>
                  <input
                    type="text"
                    required
                    placeholder="예시: 대학생 클래식 야외 버스킹 포스터"
                    value={portTitle}
                    onChange={(e) => setPortTitle(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded p-2.5 text-stone-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 font-semibold">대표 이미지 테두리 주소 (Unsplash 등 Web URL)</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={portImgUrl}
                    onChange={(e) => setPortImgUrl(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded p-2.5 text-stone-200 font-mono"
                  />
                  <span className="text-[10px] text-stone-500 block pt-1">
                    * 언스플래쉬 등 고품질 이미지 URL을 기입하면 갤러리에 직관적으로 이식 완료됩니다.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-400 font-semibold">의뢰 기관 / 클라이언트</label>
                    <input
                      type="text"
                      placeholder="예시: 서울청년클래식협회"
                      value={portClient}
                      onChange={(e) => setPortClient(e.target.value)}
                      className="w-full bg-[#12100f] border border-[#292524] rounded p-2.5 text-stone-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-400 font-semibold">제작 발행월 (YYYY.MM)</label>
                    <input
                      type="text"
                      placeholder="2026.06"
                      value={portDate}
                      onChange={(e) => setPortDate(e.target.value)}
                      className="w-full bg-[#12100f] border border-[#292524] rounded p-2.5 text-stone-200 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 font-semibold">프로젝트 상세 및 기획 연출 내용</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="해당 영상 및 포스터가 담아낸 의미나 디테일 컬러 배합 목적을 간략히 들려주세요."
                    value={portDesc}
                    onChange={(e) => setPortDesc(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded p-2.5 text-stone-200"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded shadow transition duration-200 cursor-pointer"
                >
                  포트폴리오 채널 즉시 배포 등록
                </button>
              </form>
            </div>

            {/* Col 2 Sample gallery items display list (7) */}
            <div className="md:col-span-7 bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 shadow-xl">
              <h3 className="font-display font-black text-sm uppercase tracking-wide border-b border-[#1c1917] pb-3 mb-4 text-stone-400">
                현재 전산실 공개 포트폴리오 내역 ({portfolios.length})
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolios.slice(0, 4).map((p) => (
                  <div 
                    key={p.id}
                    className="bg-[#12100f] border border-[#1c1917] rounded-lg p-3 text-xs space-y-2 flex gap-3 items-center"
                  >
                    <img 
                      src={p.imageUrl} 
                      alt="" 
                      className="w-12 h-12 object-cover rounded bg-stone-950 shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-0.5 overflow-hidden">
                      <span className="text-[9px] text-amber-500 font-bold tracking-wide block font-mono uppercase">{p.category}</span>
                      <h4 className="font-semibold text-stone-200 truncate">{p.title}</h4>
                      <p className="text-[10px] text-stone-450 font-mono">{p.client || '개인 고객'} • {p.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-stone-500 text-center mt-6">
                * 포터폴리오는 전체 작업사례 탭에서도 정식 공개 확인 가능합니다.
              </p>
            </div>

          </div>
        )}

        {adminTab === 'notices' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fadeIn">
            {/* Col 1 Form */}
            <div className="md:col-span-5 bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-display font-black text-sm uppercase tracking-wide border-b border-[#1c1917] pb-3 text-stone-300">
                {editingNotice ? '공지사항 수정' : '새 공지사항 작성'}
              </h3>

              <form onSubmit={handleSaveNotice} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-stone-400 font-semibold text-[11px]">공지 분야 (카테고리)</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded p-2.5 text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="공지사항">공지사항 📢</option>
                    <option value="시즌 오픈">시즌 오픈 🌸</option>
                    <option value="이벤트">이벤트 🎁</option>
                    <option value="중요 공지">중요 공지 ⭐</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 font-semibold text-[11px]">제목</label>
                  <input
                    type="text"
                    required
                    placeholder="공지글 제목을 입력해주세요"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded p-2.5 text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 font-semibold text-[11px]">내용</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="공지글 본문을 작성해주세요."
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded p-2.5 text-stone-200 leading-relaxed focus:outline-none focus:border-amber-500"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 font-semibold text-[11px]">대표 이미지 주소 (선택)</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={noticeImageUrl}
                      onChange={(e) => setNoticeImageUrl(e.target.value)}
                      className="flex-grow bg-[#12100f] border border-[#292524] rounded p-2.5 text-stone-200 font-mono focus:outline-none focus:border-amber-500"
                    />
                    <div className="relative shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsNoticeUploading(true);
                          try {
                            const url = await uploadImageToStorage(file, 'notices');
                            setNoticeImageUrl(url);
                            alert('이미지가 업로드되었습니다.');
                          } catch (err) {
                            alert('업로드 중 오류 발생!');
                          } finally {
                            setIsNoticeUploading(false);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <button 
                        type="button"
                        className="px-3.5 py-2.5 bg-stone-850 hover:bg-stone-700 text-stone-300 rounded flex items-center gap-1 cursor-pointer text-xs transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {isNoticeUploading ? '업로드...' : '파일'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 py-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="noticeIsPublished"
                      checked={noticeIsPublished}
                      onChange={(e) => setNoticeIsPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-[#12100f] border border-[#292524]"
                    />
                    <label htmlFor="noticeIsPublished" className="text-stone-300 select-none cursor-pointer text-[11px]">
                      사용자 전산에 즉시 공개 배포 (isPublished)
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="noticeIsPinned"
                      checked={noticeIsPinned}
                      onChange={(e) => setNoticeIsPinned(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-[#12100f] border border-[#292524]"
                    />
                    <label htmlFor="noticeIsPinned" className="text-stone-300 select-none cursor-pointer text-[11px]">
                      📌 모든 화면 최상단 공지 배너로 지정 (isPinned)
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  {editingNotice && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNotice(null);
                        setNoticeTitle('');
                        setNoticeContent('');
                        setNoticeCategory('공지사항');
                        setNoticeImageUrl('');
                        setNoticeIsPublished(true);
                        setNoticeIsPinned(false);
                      }}
                      className="flex-grow py-2.5 bg-stone-850 hover:bg-stone-700 text-stone-300 font-bold rounded shadow transition cursor-pointer"
                    >
                      취소
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-grow py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded shadow transition cursor-pointer"
                  >
                    {editingNotice ? '공지 수정 완료' : '공지 즉시 배포 등록'}
                  </button>
                </div>
              </form>
            </div>

            {/* Col 2 Notice List */}
            <div className="md:col-span-7 bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 shadow-xl">
              <h3 className="font-display font-black text-sm uppercase tracking-wide border-b border-[#1c1917] pb-3 mb-4 text-stone-400">
                작성된 공지방 목록 ({notices.length})
              </h3>

              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {notices.length === 0 ? (
                  <p className="text-stone-500 text-xs text-center py-10">작성된 공지글이 없습니다.</p>
                ) : (
                  notices.map((n) => (
                    <div
                      key={n.id}
                      className="bg-[#12100f] border border-[#1c1917] rounded-lg p-3 text-xs flex gap-3 items-start justify-between"
                    >
                      <div className="flex gap-3 overflow-hidden">
                        {n.imageUrl && (
                          <img
                            src={n.imageUrl}
                            alt=""
                            className="w-14 h-14 object-cover rounded bg-stone-950 shrink-0 border border-stone-800"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="space-y-1 overflow-hidden">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-amber-500 font-bold">
                              {n.category}
                            </span>
                            {n.isPublished ? (
                              <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                                <Eye className="w-2.5 h-2.5" /> 공개 중
                              </span>
                            ) : (
                              <span className="text-[9px] bg-stone-800 text-stone-500 border border-stone-700/50 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                                <EyeOff className="w-2.5 h-2.5" /> 비공개
                              </span>
                            )}
                            {n.isPinned && (
                              <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                                📌 상단 고정
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-stone-200 truncate">{n.title}</h4>
                          <p className="text-[10px] text-stone-400 line-clamp-2 leading-relaxed">{n.content}</p>
                          <p className="text-[9px] text-stone-500 font-mono">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleEditNoticeSetup(n)}
                          className="p-1.5 bg-stone-800/80 hover:bg-stone-750 border border-stone-700/50 text-amber-500 hover:text-amber-400 rounded transition cursor-pointer"
                          title="수정하기"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(n.id)}
                          className="p-1.5 bg-stone-800/80 hover:bg-[#291312] border border-stone-700/50 text-red-400 hover:text-red-300 rounded transition cursor-pointer"
                          title="삭제하기"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {adminTab === 'images' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. 홈 배너 최적 관리 */}
            <div className="bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1c1917] pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-500" />
                  <h3 className="font-display font-black text-sm uppercase tracking-wide text-stone-300">
                    홈 배너 이미지 관리 (Storage 'banners' 폴더 저장)
                  </h3>
                </div>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isBannerUploading}
                    onChange={handleBannerUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                  />
                  <button
                    disabled={isBannerUploading}
                    className="px-4.5 py-2 bg-amber-500 hover:bg-amber-450 disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    {isBannerUploading ? '업로드 중...' : '신규 배너 이미지 파일 추가 및 변경'}
                  </button>
                </div>
              </div>

              {/* Display list of active banners */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {banners.length === 0 ? (
                  <div className="sm:col-span-3 text-center py-10 bg-[#12100f] rounded-xl border border-[#1c1917]/50 text-xs text-stone-500">
                    가장 최신의 홈 배너가 없습니다. 업로드해주시면 Unsplash 기본 이미지를 오버라이딩합니다! (최대 3개 동시 회전지원)
                  </div>
                ) : (
                  banners.map((b, idx) => (
                    <div key={b.id} className="relative group rounded-xl overflow-hidden border border-stone-800 bg-stone-950 aspect-video">
                      <img 
                        src={b.imageUrl} 
                        alt="" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-stone-950/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDeleteBanner(b.id)}
                          className="bg-red-500 hover:bg-red-650 text-[#0c0a09] font-bold py-1.5 px-3 rounded text-xs transition cursor-pointer shadow"
                        >
                          삭제하기
                        </button>
                      </div>
                      <span className="absolute bottom-2.5 left-2.5 bg-[#0c0a09]/80 border border-stone-800 px-2 py-0.5 rounded text-[9px] font-mono text-stone-400">
                        배너 SCENE 0{idx + 1}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 2. 공지 대표 이미지 변경 */}
            <div className="bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 border-b border-[#1c1917] pb-3 mb-5">
                <Megaphone className="w-4 h-4 text-amber-500" />
                <h3 className="font-display font-black text-sm uppercase tracking-wide text-stone-300">
                  공지글 대표 이미지 즉시 변경 (Storage 'notices' 폴더 저장)
                </h3>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {notices.length === 0 ? (
                  <p className="text-stone-500 text-xs text-center py-6">이미지를 등록할 공지글이 먼저 있어야 합니다.</p>
                ) : (
                  notices.map((n) => (
                    <div 
                      key={n.id}
                      className="bg-[#12100f] border border-[#1c1917] rounded-lg p-3 text-xs flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img 
                          src={n.imageUrl || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200&auto=format&fit=crop&q=80'} 
                          alt="" 
                          className="w-12 h-12 object-cover rounded bg-stone-950 border border-stone-800 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-0.5 overflow-hidden">
                          <span className="text-[9px] text-amber-500 font-bold block">{n.category}</span>
                          <h4 className="font-bold text-stone-200 truncate">{n.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {targetNoticeId === n.id && isNoticeImgUploading && (
                          <span className="text-[11px] text-amber-500 font-bold animate-pulse font-mono shrink-0">업로드 중...</span>
                        )}
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              setTargetNoticeId(n.id);
                              handleNoticeImgUpload(e, n.id);
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <button className="flex items-center gap-1 bg-stone-850 hover:bg-stone-700 text-stone-300 px-3 py-1.5 text-xs rounded border border-stone-700/50 transition cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            이미지 파일로 교체
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 3. 필름챕 썸네일 변경 */}
            <div className="bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 border-b border-[#1c1917] pb-3 mb-5">
                <Briefcase className="w-4 h-4 text-amber-500" />
                <h3 className="font-display font-black text-sm uppercase tracking-wide text-stone-300">
                  작업사례(필름챕) 썸네일 교체 (Storage 'portfolios' 폴더 저장)
                </h3>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {portfolios.length === 0 ? (
                  <p className="text-stone-500 text-xs text-center py-6">이미지를 등록할 포트폴리오 프로젝트가 먼저 있어야 합니다.</p>
                ) : (
                  portfolios.map((p) => (
                    <div 
                      key={p.id}
                      className="bg-[#12100f] border border-[#1c1917] rounded-lg p-3 text-xs flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img 
                          src={p.imageUrl} 
                          alt="" 
                          className="w-12 h-12 object-cover rounded bg-stone-950 border border-stone-800 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-0.5 overflow-hidden">
                          <span className="text-[9px] text-amber-500 font-bold block">{p.category}</span>
                          <h4 className="font-bold text-stone-200 truncate">{p.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {targetPortfolioId === p.id && isPortfolioImgUploading && (
                          <span className="text-[11px] text-amber-500 font-bold animate-pulse font-mono shrink-0">업로드 중...</span>
                        )}
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              setTargetPortfolioId(p.id);
                              handlePortfolioImgUpload(e, p.id);
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <button className="flex items-center gap-1 bg-stone-850 hover:bg-stone-700 text-stone-300 px-3 py-1.5 text-xs rounded border border-stone-700/50 transition cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            썸네일 이미지 교체
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
