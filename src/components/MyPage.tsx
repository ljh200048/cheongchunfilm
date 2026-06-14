import React, { useState, useEffect } from 'react';
import { User, Reservation, ReservationStatus } from '../types';
import { 
  getStoredReservations, 
  saveReservation, 
  deleteReservation,
  // Firestore calls
  fetchProductionApplicationsFromFirestore,
  saveProductionApplicationToFirestore,
  deleteProductionApplicationFromFirestore
} from '../utils/storage';
import { User as UserIcon, Calendar, Film, Check, SquarePen, AlertCircle, Trash2, Clock, Mail, Phone, ExternalLink, X } from 'lucide-react';

interface MyPageProps {
  currentUser: User | null;
  onTabChange: (tab: any) => void;
}

export default function MyPage({ currentUser, onTabChange }: MyPageProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editingRes, setEditingRes] = useState<Reservation | null>(null);

  // Edit fields
  const [editRequest, setEditRequest] = useState('');
  const [editService, setEditService] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  const services = ['이미지 제작', '포스터 제작', '릴스 숏폼', '예고편', '전체 편집'];
  const times = ['오전 10시', '오전 11시', '오후 1시', '오후 3시', '오후 5시', '오후 8시'];

  useEffect(() => {
    loadReservations();
  }, [currentUser]);

  const loadReservations = async () => {
    if (!currentUser) return;
    
    // Initial optimistic load from Local Storage state
    const allLocal = getStoredReservations();
    setReservations(allLocal.filter(r => r.userId === currentUser.id));

    // Secondary sync from live Firestore database
    try {
      const allDb = await fetchProductionApplicationsFromFirestore();
      if (allDb && allDb.length > 0) {
        setReservations(allDb.filter(r => r.userId === currentUser.id));
      }
    } catch (err) {
      console.warn("Utilizing synced local storage backup in MyPage.", err);
    }
  };

  const handleStartEdit = (res: Reservation) => {
    setEditingRes(res);
    setEditService(res.serviceType);
    setEditDate(res.date);
    setEditTime(res.time);
    
    // Parse the requests string to pop values if possible, otherwise just display the raw text
    setEditRequest(res.request);
  };

  const handleSaveEdit = async () => {
    if (!editingRes) return;

    const updated: Reservation = {
      ...editingRes,
      serviceType: editService,
      date: editDate,
      time: editTime,
      request: editRequest
    };

    // Optimistically update list
    setReservations(prev => prev.map(r => r.id === editingRes.id ? updated : r));
    setEditingRes(null);

    try {
      await saveProductionApplicationToFirestore(updated);
    } catch (err) {
      console.warn("Firestore edit deferred, fallback to local storage sync.", err);
    } finally {
      loadReservations();
    }
  };

  const handleDeleteRes = async (id: string) => {
    if (window.confirm('정말로 이 제작 신청을 철회/취소하시겠습니까?')) {
      // Optimistically update list
      setReservations(prev => prev.filter(r => r.id !== id));

      try {
        await deleteProductionApplicationFromFirestore(id);
      } catch (err) {
        console.warn("Firestore delete deferred.", err);
      } finally {
        loadReservations();
      }
    }
  };

  const getStatusBadgeClass = (status: ReservationStatus) => {
    switch (status) {
      case '대기': return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case '확정': return 'bg-green-500/10 border-green-500/20 text-green-400';
      case '진행중': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case '완료': return 'bg-stone-500/10 border-stone-500/20 text-stone-400';
      case '취소': return 'bg-red-500/10 border-red-500/20 text-red-400';
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-[#0c0a09] py-28 text-center text-white">
        <p className="text-stone-500">마이페이지는 로그인이 필요한 공간 영역입니다.</p>
      </div>
    );
  }

  return (
    <section className="bg-[#0c0a09] py-16 sm:py-24 text-white border-b border-[#1c1917]" id="mypage">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Profile Card Summary */}
        <div className="bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-10 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-lg">
              {currentUser.name[0]}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#fafaf9]">{currentUser.name} 님</h2>
                <span className="text-[10px] bg-[#1c1917] px-2 py-0.5 rounded border border-[#292524] text-stone-400 font-mono">
                  {currentUser.role === 'admin' ? '최고 관리자' : '일반 크루 고객'}
                </span>
              </div>
              <p className="text-xs text-stone-500 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {currentUser.email}
                <span className="mx-1">•</span>
                <Phone className="w-3 h-3" /> {currentUser.phone}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onTabChange('Reservation')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-900 transition font-bold text-xs rounded"
            >
              새로운 예약 신청하러 가기
            </button>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => onTabChange('Admin')}
                className="px-4 py-2 bg-stone-900 border border-[#292524] text-stone-300 transition text-xs rounded"
              >
                관리자 콘솔 가기
              </button>
            )}
          </div>
        </div>

        {/* Reservations Block */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#1c1917] pb-3">
            <h3 className="font-display font-black text-sm tracking-wider uppercase text-stone-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              내 콘텐츠 예약 요청 리스트 ({reservations.length})
            </h3>
            <span className="text-[10px] text-stone-500">
              * "대기" 상태인 경우에 한하여 상세 정보 수정 및 신청 철회가 가능합니다.
            </span>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#292524] rounded-xl bg-[#0f0d0c] space-y-4">
              <Film className="w-8 h-8 text-stone-600 mx-auto animate-pulse" />
              <div className="space-y-1">
                <p className="text-stone-400 text-xs">아직 제출 완료하신 감성 제작 예약 건이 없습니다.</p>
                <p className="text-stone-600 text-[11px]">지금 낭만의 날짜를 정하고 cheongchun_film에 의뢰서를 노크해 보세요.</p>
              </div>
              <button 
                onClick={() => onTabChange('Reservation')}
                className="px-4 py-2 bg-[#12100f] text-xs text-amber-500 font-semibold border border-amber-500/20 hover:border-amber-500/50 rounded transition"
              >
                첫 제작 예약 신청하기 ⟶
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reservations.map((res) => (
                <div 
                  key={res.id}
                  className="bg-[#0f0d0c] border border-[#292524] rounded-xl p-5 space-y-4 flex flex-col justify-between"
                >
                  {/* Top line with category, state */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-stone-500 uppercase">예약 고유 ID: {res.id}</span>
                      <h4 className="font-display font-extrabold text-base text-stone-200">
                        {res.serviceType}
                      </h4>
                    </div>
                    <span className={`px-2.5 py-0.5 border text-[10px] font-semibold rounded ${getStatusBadgeClass(res.status)}`}>
                      {res.status}
                    </span>
                  </div>

                  {/* Body Info Card */}
                  <div className="bg-[#12100f] p-3.5 rounded border border-[#1c1917] space-y-2 text-xs">
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-stone-500">희망 일시:</span>
                      <span className="col-span-2 text-stone-300 font-semibold font-mono">{res.date} ({res.time})</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-stone-500 block">동기 및 요청 구문:</span>
                      <p className="text-stone-400 leading-relaxed text-[11px] bg-stone-950/60 p-2.5 rounded border border-stone-900 overflow-y-auto max-h-24 white-space-pre-wrap">
                        {res.request}
                      </p>
                    </div>
                  </div>

                  {/* Action footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#1c1917]">
                    <span className="text-[10px] font-mono text-stone-600">
                      신청 가결: {new Date(res.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex gap-2">
                      {res.status === '대기' ? (
                        <>
                          <button
                            onClick={() => handleStartEdit(res)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1c1917] hover:bg-stone-800 text-xs text-stone-300 rounded border border-[#292524] transition cursor-pointer"
                          >
                            <SquarePen className="w-3.5 h-3.5 text-amber-500" />
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteRes(res.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500/5 hover:bg-red-500/25 border border-red-500/20 text-xs text-red-400 rounded transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            삭제
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-stone-500 flex items-center gap-1 bg-[#12100f] px-2 py-1 rounded">
                          <AlertCircle className="w-3 h-3 text-stone-600" />
                          진행 확정 수락 이후 수정 불가
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Edit Overlay Dialog Modal */}
      {editingRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0c0a09] border border-[#292524] rounded-2xl p-6 sm:p-8 space-y-5 text-white">
            
            <button 
              onClick={() => setEditingRes(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-white rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-display font-black text-base uppercase text-amber-500 tracking-wider">
                예약 내역 변경요청
              </h3>
              <p className="text-[11px] text-stone-500">승인 변경 전에는 희망 시간대 및 요청 내용을 자유롭게 다듬을 수 있습니다.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#a8a29e]">희망 서비스 종류</label>
                <select
                  value={editService}
                  onChange={(e) => setEditService(e.target.value)}
                  className="w-full bg-[#12100f] border border-[#292524] rounded p-2 text-stone-200"
                >
                  {services.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#a8a29e]">희망 날짜</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded p-2 text-stone-200 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#a8a29e]">희망 미팅 시간대</label>
                  <select
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded p-2 text-stone-200"
                  >
                    {times.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#a8a29e]">요청 상세 본문</label>
                <textarea
                  rows={4}
                  value={editRequest}
                  onChange={(e) => setEditRequest(e.target.value)}
                  className="w-full bg-[#12100f] border border-[#292524] rounded p-2 text-stone-200 font-sans"
                ></textarea>
              </div>

              <button
                onClick={handleSaveEdit}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-[#0c0a09] font-bold rounded flex items-center justify-center gap-1 transition"
              >
                <Check className="w-4 h-4" />
                수정 사항 업데이트 적용
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
