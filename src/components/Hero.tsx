import React from 'react';
import { Film, CalendarDays, Rocket, Eye, Sparkles, Sliders } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeroProps {
  onTabChange: (tab: ActiveTab) => void;
}

export default function Hero({ onTabChange }: HeroProps) {
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
          평범한 사진 한 장도, 짧은 영상 한 컷도 청춘필름을 만나면 마음을 요동치게 하는 하나의 장면이 됩니다. 
          이미지 제작부터 포스터 디자인, 릴스/숏폼, 특별한 모임 예고편, 전문 전체 편집까지 필요한 순간에 맞춘 
          감성 가득한 콘텐츠를 제작해 드립니다. 
          <br className="hidden sm:inline" />
          지금 남기고 싶은 청춘의 장면이 있다면, 청춘필름이 가장 시네마틱하게 만들어드릴게요.
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
            <span className="font-display text-2xl sm:text-3xl font-bold text-stone-100">3기</span>
            <span className="text-stone-500 text-[11px] mt-1 tracking-widest font-medium uppercase">서포터즈 모집 예정</span>
          </div>
        </div>

        {/* Analog Film Strip Graphics visual element - Beautiful layout addition! */}
        <div className="w-full mt-20 max-w-5xl rounded-xl overflow-hidden border border-[#1c1917] bg-[#0c0a09] relative shadow-2xl p-4">
          <div className="flex items-center justify-between border-b border-[#1c1917] pb-3 mb-4 text-stone-500 text-[10px] font-mono px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>LIVE VIEWER STAGING</span>
            </div>
            <span>CHEONGCHUN_ANALOG_50D.ISO</span>
            <span>SHUTTER SPEED 1/60s</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-[#292524] group">
              <img 
                src="https://images.unsplash.com/photo-1542204172-e7052809f852?w=600&auto=format&fit=crop&q=80" 
                alt="Film Scene Warm" 
                className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80"></div>
              <span className="absolute bottom-3 left-3 text-[10px] font-mono text-stone-300">SCENE_01 / BEIGE_MOOD</span>
            </div>
            
            <div className="relative aspect-video rounded-lg overflow-hidden border border-[#292524] group">
              <img 
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80" 
                alt="Film Scene Lights" 
                className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80"></div>
              <span className="absolute bottom-3 left-3 text-[10px] font-mono text-stone-300">SCENE_02 / AMBER_GLOW</span>
            </div>
            
            <div className="relative aspect-video rounded-lg overflow-hidden border border-[#292524] group">
              <img 
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80" 
                alt="Film Scene Cinema" 
                className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80"></div>
              <span className="absolute bottom-3 left-3 text-[10px] font-mono text-stone-300">SCENE_03 / FILM_GRAIN</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
