import React, { useState, useEffect } from 'react';
import { User, Reservation, ReservationStatus, SupporterApplicant, ScheduleItem, PortfolioItem } from '../types';
import { 
  getStoredReservations, 
  saveReservation, 
  deleteReservation,
  getStoredSupporters,
  getStoredSchedules,
  saveSchedule,
  deleteSchedule,
  getStoredPortfolios,
  savePortfolio
} from '../utils/storage';
import { 
  ShieldAlert, Calendar, Users, Briefcase, Plus, Trash2, Check, ArrowRight, 
  RefreshCw, RefreshCcw, ExternalLink, Filter, ClipboardList, Clock, Phone, Mail, FileText
} from 'lucide-react';

export default function Admin() {
  // Admin view inside tab selection
  const [adminTab, setAdminTab] = useState<'reservations' | 'schedules' | 'supporters' | 'portfolio'>('reservations');
  
  // Stored state lists
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [supporters, setSupporters] = useState<SupporterApplicant[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);

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

  // Load everything
  useEffect(() => {
    loadAllAdminData();
  }, [adminTab]);

  const loadAllAdminData = () => {
    setReservations(getStoredReservations());
    setSupporters(getStoredSupporters());
    setSchedules(getStoredSchedules());
    setPortfolios(getStoredPortfolios());
  };

  // Status Change trigger
  const handleUpdateStatus = (id: string, newStatus: ReservationStatus) => {
    const found = reservations.find(r => r.id === id);
    if (!found) return;

    const updated: Reservation = {
      ...found,
      status: newStatus
    };
    saveReservation(updated);
    setReservations(getStoredReservations());
  };

  // Delete Reservation
  const handleDeleteRes = (id: string) => {
    if (window.confirm('정말로 이 예약 신청 건을 완전히 영구 삭제하시겠습니까?')) {
      deleteReservation(id);
      setReservations(getStoredReservations());
    }
  };

  // Create Milestone
  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schTitle || !schDate) return;

    const newItem: ScheduleItem = {
      id: 'sch_' + Date.now(),
      date: schDate,
      title: schTitle,
      description: schDescription
    };

    saveSchedule(newItem);
    setSchTitle('');
    setSchDescription('');
    setSchedules(getStoredSchedules());
    alert('새 세부 일정이 청춘필름 달력에 등록 배포되었습니다!');
  };

  // Delete Milestone
  const handleDeleteSchedule = (id: string) => {
    if (window.confirm('이 스케줄 마일스톤을 달력에서 삭제제외하시겠습니까?')) {
      deleteSchedule(id);
      setSchedules(getStoredSchedules());
    }
  };

  // Create Portfolio
  const handleCreatePortfolio = (e: React.FormEvent) => {
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
      client: portClient || '청춘필름 자체기획',
      date: portDate || '2026.06'
    };

    savePortfolio(newItem);
    setPortTitle('');
    setPortDesc('');
    setPortImgUrl('');
    setPortClient('');
    setPortCategory('포스터 제작');
    setPortfolios(getStoredPortfolios());
    alert('새 포트폴리오 프로젝트가 공식 갤러리에 업로드 및 등록 마감되었습니다!');
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
                청춘필름 HQ 관리 본부
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
                        <div className="space-y-1 text-xs">
                          <p className="text-[10px] text-stone-600 uppercase tracking-widest font-bold">의뢰 상세 목적 및 비고</p>
                          <p className="text-stone-400 bg-[#12100f] p-3 rounded-lg border border-[#1c1917] leading-relaxed overflow-y-auto max-h-24 white-space-pre-wrap text-[11px]">
                            {res.request}
                          </p>
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

      </div>
    </section>
  );
}
