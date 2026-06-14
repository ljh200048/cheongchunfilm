import React, { useState } from 'react';
import { CalendarDays, Eye, Sparkles, Link as LinkIcon, RefreshCcw, Check, X } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeroProps {
  onTabChange: (tab: ActiveTab) => void;
}

export default function Hero({ onTabChange }: HeroProps) {
  // Staging state for 3 frames (First frame is signature locked, frame 2 and 3 are customizable with HTTP links)
  const [stagedPhotos, setStagedPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80"
  ]);
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);
  const [inputUrl, setInputUrl] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const handleConnectUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFrame === null) return;
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
      setStatusMessage("올바른 HTTP 또는 HTTPS 주소를 입력해주세요.");
      return;
    }
    
    const updated = [...stagedPhotos];
    updated[selectedFrame] = inputUrl;
    setStagedPhotos(updated);
    setInputUrl("");
    setStatusMessage("성공적으로 웹 주소(HTTP)의 사진이 연결되었습니다!");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const applyPreset = (url: string) => {
    if (selectedFrame === null) return;
    const updated = [...stagedPhotos];
    updated[selectedFrame] = url;
    setStagedPhotos(updated);
    setStatusMessage("프리셋 사진이 성공적으로 연결되었습니다.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const resetAll = () => {
    setStagedPhotos([
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80"
    ]);
    setSelectedFrame(null);
    setInputUrl("");
    setStatusMessage("초기 설정 사진으로 리셋되었습니다.");
    setTimeout(() => setStatusMessage(""), 3000);
  };
  return (
    <section className="relative overflow-hidden bg-[#0c0a09] py-20 sm:py-32 film-grain border-b border-[#1c1917]">
      {/* Background radial gradient accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center text-center">
        {/* Accent Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[11px] font-mono tracking-widest uppercase mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          당신의 청춘을 영화처럼
        </div>

        {/* Headings */}
        <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-[64px] tracking-tight text-[#fafaf9] max-w-4xl leading-[1.12] mb-6">
          오늘의 짧았던 일상이 <br />
          <span className="text-amber-500 inline-block relative mt-2">
            가장 낭만적인 영화가 됩니다
          </span>
        </h1>

        {/* Sub-text containing the exact copwrite */}
        <p className="font-sans text-xs sm:text-sm md:text-base text-stone-300 max-w-3xl leading-relaxed mb-10">
          평범한 사진 한 장도, 무심히 지나치는 영상 한 컷도 <strong>CHEONGCHUN FILM</strong>을 만나면 사람들의 영혼을 울리는 하나의 시네마틱 장면이 됩니다. 
          고해상도 맞춤 이미지 제작부터 시선을 사로잡는 포스터 디자인, 트렌디한 3초 매직 릴스/숏폼, 감동적인 모임 예고편, 전문 영화급 컬러 그레이딩 전체 편집까지—
          <br className="hidden sm:inline" />
          마음에 오래 머무를 당신만의 따스한 하이라이트를 가장 압도적이고 완벽한 색채로 소장해 보세요.
        </p>

        {/* Action Buttons with highly highlighted booking style */}
        <div className="flex flex-col sm:flex-row gap-4.5 justify-center w-full max-w-lg">
          <button
            onClick={() => onTabChange('Reservation')}
            className="flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-8 py-4 rounded-xl text-xs sm:text-xs tracking-widest uppercase transition-all duration-300 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-98 cursor-pointer ring-4 ring-amber-500/10"
          >
            <CalendarDays className="w-4 h-4 text-stone-900 group-hover:scale-110 transition-transform" />
            원하는 날짜로 제작 예약하기 ⟶
          </button>
          <button
            onClick={() => onTabChange('Portfolio')}
            className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-855 border border-[#292524] text-stone-200 hover:text-white px-8 py-4 rounded-xl text-xs tracking-wider transition-all duration-300 hover:-translate-y-0.5 cursor-pointer hover:border-stone-500 active:scale-98"
          >
            <Eye className="w-4 h-4" />
            제작 포트폴리오 전체 감상
          </button>
        </div>

        {/* Interactive Stats Grid (Subtle, non-tech-larp) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 mt-20 max-w-3xl w-full border-t border-[#1c1917]/80 pt-10 text-[#fafaf9]">
          <div className="flex flex-col items-center">
            <span className="font-display text-2xl sm:text-3xl font-bold text-stone-100">120+</span>
            <span className="text-stone-500 text-[11px] mt-1 tracking-widest font-medium uppercase">완성된 프로젝트</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display text-2xl sm:text-3xl font-bold text-amber-500">99.2%</span>
            <span className="text-stone-500 text-[11px] mt-1 tracking-widest font-medium uppercase">고객 감동 리뷰</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display text-2xl sm:text-3xl font-bold text-stone-100">2기</span>
            <span className="text-stone-500 text-[11px] mt-1 tracking-widest font-medium uppercase">서포터즈 모집 예정</span>
          </div>
        </div>

        {/* Analog Film Strip Graphics visual element - Beautiful layout addition! */}
        <div className="w-full mt-20 max-w-5xl rounded-xl overflow-hidden border border-[#292524] bg-[#0c0a09] relative shadow-2xl p-4 sm:p-5">
          
          {/* Header Info Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#1c1917] pb-3.5 mb-5 text-stone-500 text-[10px] font-mono px-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-stone-300 font-bold tracking-wider uppercase">CINEMATIC COLOR SIMULATOR</span>
              <span className="bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-amber-400 font-bold">PREVIEW READY</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center">
              <span>ANALOG_35MM_50D.ISO</span>
              <span>•</span>
              <span>SHUTTER SPEED 1/60s</span>
              <span>•</span>
              <button 
                onClick={resetAll}
                className="flex items-center gap-1 text-stone-500 hover:text-amber-500 transition cursor-pointer text-[10px]"
                title="기본 설정으로 사진 연결 초기화"
              >
                <RefreshCcw className="w-3 h-3" />
                <span>시네마틱 샘플 복원</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* 3 Active frames */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
              {stagedPhotos.map((photoUrl, index) => {
                const isSelected = selectedFrame === index;

                return (
                  <div 
                    key={index}
                    onClick={() => {
                      setSelectedFrame(index);
                      setInputUrl(stagedPhotos[index]);
                    }}
                    className={`relative aspect-video rounded-xl overflow-hidden border transition-all duration-300 select-none ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-500/35 ring-offset-2 ring-offset-stone-950 scale-[1.015] cursor-pointer'
                        : 'border-[#1c1917] hover:border-amber-500/30 hover:scale-[1.005] cursor-pointer'
                    }`}
                  >
                    <img 
                      src={photoUrl} 
                      alt={`Staged Scene ${index + 1}`} 
                      className="w-full h-full object-cover transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                    
                    {/* Badge identifying scene */}
                    <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-mono select-none border transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 font-extrabold border-amber-600'
                        : 'bg-stone-900/85 text-stone-400 border-stone-800'
                    }`}>
                      {`SCENE 0${index + 1} ${isSelected ? '● 편집 중' : '클릭하여 교체'}`}
                    </span>

                    <span className="absolute bottom-3 left-3 text-[10px] font-mono text-stone-300 tracking-wide font-medium">
                      {index === 0 ? '시네마틱 시그니처 (Warm)' : index === 1 ? '새벽녘 엠버 글로우 (Amber)' : '클래식 필름 그레인 (Grain)'}
                    </span>
                    
                    {/* Retro focus reticle overlays */}
                    <div className="absolute inset-3.5 border border-stone-100/10 pointer-events-none flex items-center justify-center">
                      <div className="w-2 h-2 border border-stone-100/25 rounded-full"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* HTTP connection input field underneath selected card */}
            {selectedFrame !== null && (
              <div className="mt-6 p-4 rounded-xl border border-amber-500/20 bg-[#0c0a09] transition-all duration-300">
                <div className="flex items-center justify-between border-b border-[#1c1917] pb-2.5 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-[11px] font-mono text-stone-200">
                      실시간 프리뷰 이미지 주소 설정: <strong className="text-amber-400">SCENE 0{selectedFrame + 1}</strong>
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedFrame(null)}
                    className="p-1 hover:bg-[#1c1917] rounded text-stone-500 hover:text-stone-300 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleConnectUrl} className="flex gap-2 w-full max-w-4xl">
                  <div className="relative flex-grow">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type="url"
                      placeholder="불러오실 웹 이미지 주소(http:// 또는 https://)를 입력 또는 복사해서 붙여넣어 주세요"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="w-full bg-[#12100f] border border-[#221f1e] rounded-lg pl-10 pr-4 py-2 text-stone-200 placeholder:text-stone-700 text-xs focus:outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4.5 py-2.5 bg-amber-500 hover:bg-amber-650 text-stone-900 font-bold rounded-lg text-xs transition cursor-pointer shrink-0"
                  >
                    프레임 실시간 적용
                  </button>
                </form>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3.5 pt-3 border-t border-[#12100f] text-[11px]">
                  <div className="text-stone-400">
                    {statusMessage ? (
                      <span className="text-amber-500 font-bold flex items-center gap-1.5 animate-pulse">
                        <Check className="w-3.5 h-3.5" />
                        {statusMessage}
                      </span>
                    ) : (
                      <span className="text-stone-400">💡 웹 상의 원하시는 이미지 링크를 연동하여 시네마틱 톤 프리뷰를 실시간으로 확인해볼 수 있습니다.</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-stone-500">
                    <span>추천 테마:</span>
                    <button
                      type="button"
                      onClick={() => applyPreset("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80")}
                      className="text-stone-400 hover:text-amber-500 transition underline decoration-dashed underline-offset-2 cursor-pointer"
                    >
                      콘서트홀
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80")}
                      className="text-stone-400 hover:text-amber-500 transition underline decoration-dashed underline-offset-2 cursor-pointer"
                    >
                      모닥불 캠핑
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80")}
                      className="text-stone-400 hover:text-amber-500 transition underline decoration-dashed underline-offset-2 cursor-pointer"
                    >
                      앤틱 라이브러리
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
