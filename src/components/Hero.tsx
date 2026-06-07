import React, { useState } from 'react';
import { Film, CalendarDays, Rocket, Eye, Sparkles, Sliders, Upload, Image as ImageIcon, Link as LinkIcon, RefreshCcw } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeroProps {
  onTabChange: (tab: ActiveTab) => void;
}

export default function Hero({ onTabChange }: HeroProps) {
  // Staging state for 3 frames
  const [stagedPhotos, setStagedPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1542204172-e7052809f852?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80"
  ]);

  const [selectedFrame, setSelectedFrame] = useState<number>(0);
  const [imageUrlInput, setImageUrlInput] = useState<string>("");

  // Preset cinematic high-quality film stock options
  const presets = [
    {
      name: "여름 클래식 (버스킹)",
      url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
    },
    {
      name: "노을빛 낭만 (해변)",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
    },
    {
      name: "네온 시네마 (야외)",
      url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80"
    },
    {
      name: "아날로그 캠핑 (불멍)",
      url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80"
    },
    {
      name: "필름 감성 북카페",
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80"
    },
    {
      name: "클래식 로드트립 (차)",
      url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop&q=80"
    }
  ];

  // Local File Upload reader
  const handleLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          const updated = [...stagedPhotos];
          updated[selectedFrame] = event.target.result;
          setStagedPhotos(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // URL input change confirmation
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    const updated = [...stagedPhotos];
    updated[selectedFrame] = imageUrlInput;
    setStagedPhotos(updated);
    setImageUrlInput("");
  };

  const resetToDefault = () => {
    setStagedPhotos([
      "https://images.unsplash.com/photo-1542204172-e7052809f852?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80"
    ]);
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
        <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#fafaf9] max-w-3xl leading-[1.1] mb-6">
          오늘의 짧은 순간이 <br />
          <span className="text-amber-500 inline-block relative">
            하나의 영화가 됩니다
          </span>
        </h1>

        {/* Sub-text containing the exact copwrite */}
        <p className="font-sans text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed mb-10">
          평범한 사진 한 장도, 짧은 영상 한 컷도 cheongchun_film을 만나면 마음을 요동치게 하는 하나의 장면이 됩니다. 
          이미지 제작부터 포스터 디자인, 릴스/숏폼, 특별한 모임 예고편, 전문 전체 편집까지 필요한 순간에 맞춘 
          감성 가득한 콘텐츠를 제작해 드립니다. 
          <br className="hidden sm:inline" />
          지금 남기고 싶은 청춘의 장면이 있다면, cheongchun_film이 가장 시네마틱하게 만들어드릴게요.
        </p>

        {/* Action Buttons with the explicit text recommendation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <button
            onClick={() => onTabChange('Reservation')}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold px-6 py-3.5 rounded-lg text-xs tracking-wider transition-all duration-300 shadow-lg shadow-amber-500/10 hover:-translate-y-0.5 cursor-pointer"
          >
            <CalendarDays className="w-4 h-4" />
            원하는 날짜로 제작 예약하기
          </button>
          <button
            onClick={() => onTabChange('Portfolio')}
            className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 border border-[#292524] text-stone-200 hover:text-white px-6 py-3.5 rounded-lg text-xs tracking-wider transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            제작 포트폴리오 보기
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
              <span className="text-stone-300 font-bold tracking-wider uppercase">LIVE VIEWER STAGING</span>
              <span className="bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800 text-stone-500">STAGING_ACTIVE</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center">
              <span>CHEONGCHUN_ANALOG_50D.ISO</span>
              <span>•</span>
              <span>SHUTTER SPEED 1/60s</span>
              <span>•</span>
              <button 
                onClick={resetToDefault}
                className="flex items-center gap-1 text-amber-500 hover:text-amber-400 transition cursor-pointer"
                title="기본 사진으로 리셋"
              >
                <RefreshCcw className="w-3 h-3" />
                기본값 리셋
              </button>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* Guide message */}
            <p className="text-stone-400 text-xs text-left px-2 leading-relaxed max-w-3xl">
              💡 <strong>사진 넣기 도구:</strong> 아래 프레임 중 하나를 <span className="text-amber-500">클릭해 선택(Active)</span>한 후, 
              준비된 6가지 낭만 감성 프리셋 이미지를 주입하거나 여러분 휴대폰/컴퓨터 안의 로컬 파일을 직접 업로드 해보세요!
            </p>

            {/* 3 Active frames */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
              {stagedPhotos.map((photoUrl, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedFrame(index)}
                  className={`relative aspect-video rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer group select-none ${
                    selectedFrame === index 
                      ? 'border-amber-500 ring-2 ring-amber-500/35 ring-offset-2 ring-offset-stone-950 scale-[1.015]' 
                      : 'border-[#1c1917] hover:border-stone-700 hover:scale-[1.005]'
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
                    selectedFrame === index 
                      ? 'bg-amber-500 text-stone-950 font-extrabold border-amber-600' 
                      : 'bg-stone-900/85 text-stone-400 border-stone-800'
                  }`}>
                    FRAME 0{index + 1} {selectedFrame === index ? '● 수정 중' : '클릭시 선택'}
                  </span>

                  <span className="absolute bottom-3 left-3 text-[10px] font-mono text-stone-300 tracking-wide font-medium">
                    {index === 0 ? 'SCENE_01 / BEIGE_MOOD' : index === 1 ? 'SCENE_02 / AMBER_GLOW' : 'SCENE_03 / FILM_GRAIN'}
                  </span>
                  
                  {/* Retro focus reticle overlays */}
                  <div className="absolute inset-3.5 border border-stone-100/10 pointer-events-none flex items-center justify-center">
                    <div className="w-2 h-2 border border-stone-100/25 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Control Panel */}
            <div className="bg-[#0f0d0c]/80 border border-[#1c1917] p-4.5 rounded-xl space-y-4 text-xs text-left">
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#1c1917] pb-3">
                <span className="font-semibold text-stone-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  기획 제어 콘솔 : <span className="text-amber-500 font-mono font-bold">FRAME 0{selectedFrame + 1}번 프레임</span> 제어 중
                </span>
                <span className="text-[11px] text-stone-500">
                  대상 프레임을 변경하려면 상단 사진 카드를 클릭해주세요.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5.5 items-start">
                
                {/* Left hand: Preset buttons */}
                <div className="md:col-span-7 space-y-2.5">
                  <span className="block text-stone-400 font-semibold text-[11px] flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    감성 사진 프리셋 한 번에 주입하기 (원클릭 등록)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {presets.map((pr, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const updated = [...stagedPhotos];
                          updated[selectedFrame] = pr.url;
                          setStagedPhotos(updated);
                        }}
                        className="px-2.5 py-2.5 bg-[#12100f] hover:bg-stone-900 border border-[#221f1e] hover:border-amber-500/40 rounded-lg text-stone-300 text-[11px] font-medium transition text-left truncate cursor-pointer block w-full hover:text-amber-400"
                      >
                        🎥 {pr.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right hand: Custom upload & URLs */}
                <div className="md:col-span-5 space-y-4">
                  
                  {/* File Upload Trigger */}
                  <div className="space-y-2">
                    <span className="block text-stone-400 font-semibold text-[11px] flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5 text-amber-500" />
                      내 컴퓨터 / 모바일 파일로 사진 넣기
                    </span>
                    <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#12100f] hover:bg-stone-900 border border-[#221f1e] hover:border-amber-500/40 text-stone-300 font-bold rounded-lg cursor-pointer transition text-xs select-none">
                      <Upload className="w-3.5 h-3.5 text-amber-500" />
                      파일 선택 및 사진 업로드하기
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLocalUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {/* Web URL input */}
                  <div className="space-y-1.5">
                    <span className="block text-stone-400 font-semibold text-[11px] flex items-center gap-1">
                      <LinkIcon className="w-3.5 h-3.5 text-amber-500" />
                      인터넷 웹 이미지 주소(URL) 기입하기
                    </span>
                    <form onSubmit={handleUrlSubmit} className="flex gap-2 w-full">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="flex-grow bg-[#12100f] border border-[#221f1e] rounded-lg px-3 py-2 text-stone-200 placeholder:text-stone-700 text-xs focus:outline-none focus:border-amber-500 text-ellipsis font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded-lg text-xs transition shrink-0 cursor-pointer"
                      >
                        적용
                      </button>
                    </form>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
