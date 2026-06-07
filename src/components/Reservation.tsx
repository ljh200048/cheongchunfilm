import React, { useState, useEffect } from 'react';
import { User, Reservation as ReservationType, ReservationStatus } from '../types';
import { getStoredReservations, saveReservation } from '../utils/storage';
import { Calendar, Clock, Edit3, Link, Check, AlertCircle, Sparkles, LogIn, ChevronRight, CheckCircle } from 'lucide-react';

interface ReservationProps {
  currentUser: User | null;
  onOpenAuth: (type: 'login' | 'register') => void;
  onTabChange: (tab: any) => void;
}

export default function Reservation({ currentUser, onOpenAuth, onTabChange }: ReservationProps) {
  // Booking inputs
  const [serviceType, setServiceType] = useState<string>('포스터 제작');
  const [date, setDate] = useState<string>('2026-06-15');
  const [time, setTime] = useState<string>('오후 3시');
  const [request, setRequest] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  
  // Custom states
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdReservation, setCreatedReservation] = useState<ReservationType | null>(null);

  // Suggested copy time slots
  const timeSlots = ['오전 10시', '오전 11시', '오후 1시', '오후 3시', '오후 5시', '오후 8시'];
  
  // Suggested services
  const services = ['이미지 제작', '포스터 제작', '릴스 숏폼', '예고편', '전체 편집'];

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }

    const newRes: ReservationType = {
      id: 'res_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      userEmail: currentUser.email,
      serviceType: serviceType,
      date: date,
      time: time,
      request: `[제작 목적]: ${purpose}\n[참고 자료]: ${reference || '없음'}\n[요청 세부]: ${request || '감성적이고 영화 같은 느낌으로 제작해주세요.'}`,
      status: '대기',
      createdAt: new Date().toISOString()
    };

    saveReservation(newRes);
    setCreatedReservation(newRes);
    setIsSuccess(true);
  };

  return (
    <section className="bg-[#0c0a09] py-20 sm:py-28 text-white border-b border-[#1c1917]" id="reservation-form">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Pitch Headline */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <span className="font-mono text-xs text-amber-500 uppercase tracking-widest block font-bold">
            // EASY RESERVATION ENGINE
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-stone-100">
            원하는 날짜로 제작 예약하기
          </h2>
          <p className="font-sans text-xs text-stone-400">
            좋은 순간은 금방 지나가지만, 잘 만든 콘텐츠는 오래 남습니다. <br />
            정확한 일정을 선점하고 영화 감독처럼 꼼꼼하게 상담을 시작해보세요.
          </p>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="bg-[#0f0d0c] border border-amber-500/30 rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto amber-glow">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display font-black text-xl text-[#fafaf9]">
                제작 예약 신청이 완료되었습니다!
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                신청하신 예약 정보가 청춘필름 중앙 관리 시스템에 접수되었습니다. <br />
                담당 프로듀서가 연락처(<span className="text-amber-400 font-mono">{currentUser?.phone}</span>)나 메일로 가이드안과 일정 조율 시안을 곧 송부해 드립니다.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#12100f] border border-[#292524] rounded-lg p-5 text-left text-xs space-y-3 font-sans max-w-md mx-auto">
              <div className="flex justify-between border-b border-[#1c1917] pb-2 text-[10px] uppercase font-mono text-stone-500">
                <span>예약 명세 내용</span>
                <span>ID: {createdReservation?.id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-500">신청 의뢰인:</span>
                <span className="col-span-2 text-stone-300 font-semibold">{currentUser?.name}님</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-500">제작 서비스:</span>
                <span className="col-span-2 text-amber-400 font-semibold">{createdReservation?.serviceType}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-500">희망 일시:</span>
                <span className="col-span-2 text-stone-300 font-semibold font-mono">{createdReservation?.date} / {createdReservation?.time}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-500">현재 상태:</span>
                <span className="col-span-2 text-stone-400">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px]">
                    ● {createdReservation?.status}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => onTabChange('MyPage')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold text-xs rounded transition cursor-pointer"
              >
                내 예약목록 보러가기 (My Page)
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setRequest('');
                  setPurpose('');
                  setReference('');
                }}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-850 border border-[#292524] text-stone-300 text-xs font-semibold rounded transition cursor-pointer"
              >
                다른 예약 추가 신청
              </button>
            </div>
          </div>
        ) : (
          /* Form Content with Client Guard */
          <div className="bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 sm:p-10 shadow-xl relative">
            {!currentUser ? (
              /* Block for unauthenticated users */
              <div className="absolute inset-0 bg-[#0c0a09]/80 backdrop-blur-md rounded-2xl z-20 flex flex-col justify-center items-center p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border border-[#292524] bg-[#12100f] flex items-center justify-center text-stone-400">
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="font-display font-bold text-base text-stone-200">
                    로그인 후 실시간 예약이 가능합니다
                  </h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    로그인하시면 날짜와 빈 시간 슬롯을 선점하고 마이페이지에서 감독의 매칭 수락 및 제작 상태를 실시간 트래크할 수 있습니다.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded transition cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    간편 로그인 완료하기
                  </button>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-[#292524] text-stone-300 text-xs font-semibold rounded transition cursor-pointer"
                  >
                    10초 회원가입
                  </button>
                </div>
                <p className="text-[10px] text-stone-600 font-mono pt-4">
                  * 상단 로고 위 [테스터 퀵스위치]로 편하게 유저/관리자 전환이 즉시 가능합니다.
                </p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Service selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">
                  01. 희망 제작 서비스 선택
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {services.map((svc) => (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => setServiceType(svc)}
                      className={`py-3.5 px-3 text-center text-xs font-semibold rounded-lg border transition ${
                        serviceType === svc
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-extrabold'
                          : 'bg-[#12100f] border-stone-850 text-stone-400 hover:text-white hover:border-[#292524]'
                      }`}
                    >
                      {svc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Date & Time Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Visual Calendar Selector Input */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    02. 희망 촬영/최종 마감 날짜
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    min="2026-06-01"
                    max="2026-12-31"
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded-lg px-4 py-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500 transition font-mono focus:ring-1 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-stone-500 leading-normal">
                    * 오늘 기준 5월 이후 6월부터 예약 가능 일정이 배치됩니다.
                  </p>
                </div>

                {/* Hour slots */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    03. 상담/미팅 희망 시간
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`py-2 text-center text-xs font-medium rounded-lg border transition ${
                          time === slot
                            ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                            : 'bg-[#12100f] border-stone-850 text-stone-400 hover:text-white hover:border-[#292524]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Step 3: Brief Form details */}
              <div className="space-y-5 border-t border-[#1c1917] pt-6">
                
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                  04. 제작 목적 및 참고 사항 입력
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] text-stone-400 font-medium">제작 목적</label>
                    <input
                      type="text"
                      required
                      placeholder="예시: 동아리 축전 홍보용, 브이로그 추억 기록"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-[#12100f] border border-[#292524] rounded-lg px-4 py-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] text-stone-400 font-medium flex items-center gap-1">
                      참고자료 링크 <span className="text-[10px] text-stone-500">(선택)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="예시: 유튜브 레퍼런스 주소, 노션 링크"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="w-full bg-[#12100f] border border-[#292524] rounded-lg px-4 py-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500 transition font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] text-stone-400 font-medium">세부 요청 사항</label>
                  <textarea
                    rows={4}
                    placeholder="감성적이고 영화 같은 색감으로 제작해주세요. 자막 폰트는 레트로 분위기가 좋겠습니다."
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded-lg px-4 py-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500 transition"
                  ></textarea>
                </div>

                {/* Submitting user metadata display */}
                {currentUser && (
                  <div className="p-3 bg-stone-900 border border-[#292524] rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[11px] text-stone-400">
                    <div className="space-y-0.5">
                      <span className="text-stone-500">신청 고객 정보: </span>
                      <span className="text-stone-200 font-semibold">{currentUser.name} ({currentUser.email})</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-stone-500">연락처: </span>
                      <span className="text-stone-200 font-semibold font-mono">{currentUser.phone}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit triggers */}
              <button
                type="submit"
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs tracking-wider uppercase font-extrabold rounded-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-amber-500/10"
              >
                <span>제작 예약 확정 신청하기</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </form>
          </div>
        )}
        
      </div>
    </section>
  );
}
