import React from 'react';
import { Film, Instagram, ArrowUp, Send, Heart } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  onTabChange: (tab: ActiveTab) => void;
}

export default function Footer({ onTabChange }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0c0a09] border-t border-[#1c1917] text-stone-400 text-xs">
      {/* Upper Brand Promo Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-[#1c1917]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('Home')}>
              <Film className="w-5 h-5 text-amber-500" />
              <span className="font-display text-base font-bold tracking-widest text-[#fafaf9]">
                청춘필름
              </span>
            </div>
            <p className="text-stone-500 leading-relaxed max-w-xs text-[11px]">
              청춘필름은 이미지, 포스터, 릴스 숏폼, 예고편, 영화 연출 기반 전체 영상 편집을 책임지는 감성 콘텐츠 크리에이티브 스튜디오입니다.
            </p>
          </div>

          {/* Col 2: Services Quicklinks */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-stone-200 tracking-wider">제작 서비스</h4>
            <ul className="space-y-2 text-[11px] text-stone-500">
              <li className="hover:text-amber-400 transition cursor-pointer" onClick={() => onTabChange('Service')}>감성 이미지 제작</li>
              <li className="hover:text-amber-400 transition cursor-pointer" onClick={() => onTabChange('Service')}>홍보 및 소모임 포스터</li>
              <li className="hover:text-amber-400 transition cursor-pointer" onClick={() => onTabChange('Service')}>홍보 릴스 / 숏폼 (3초 공략)</li>
              <li className="hover:text-amber-400 transition cursor-pointer" onClick={() => onTabChange('Service')}>행사 티저 예고편</li>
              <li className="hover:text-amber-400 transition cursor-pointer" onClick={() => onTabChange('Service')}>컷편집/자막 전체 편집</li>
            </ul>
          </div>

          {/* Col 3: Quick Tabs Links */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-stone-200 tracking-wider">cheongchun_film 바로가기</h4>
            <ul className="grid grid-cols-2 gap-2 text-[11px] text-stone-500">
              <li className="hover:text-[#fff] transition cursor-pointer" onClick={() => onTabChange('Home')}>홈 (Home)</li>
              <li className="hover:text-[#fff] transition cursor-pointer" onClick={() => onTabChange('Service')}>서비스 (Service)</li>
              <li className="hover:text-[#fff] transition cursor-pointer" onClick={() => onTabChange('Portfolio')}>포트폴리오</li>
              <li className="hover:text-[#fff] transition cursor-pointer" onClick={() => onTabChange('Reservation')}>제작 예약</li>
              <li className="hover:text-[#fff] transition cursor-pointer" onClick={() => onTabChange('Schedule')}>업로드 일정표</li>
              <li className="hover:text-[#fff] transition cursor-pointer" onClick={() => onTabChange('Supporters')}>서포터즈 모집</li>
            </ul>
          </div>

          {/* Col 4: Newsletter or Contact */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-stone-200 tracking-wider">문의 및 예약 안내</h4>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              기록하고 싶은 찬란한 밤이나, 콘텐츠 기획이 필요한 순간 언제든 문의하세요.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => onTabChange('Reservation')}
                className="bg-amber-500 hover:bg-amber-600 text-stone-900 transition font-medium px-3 py-1.5 rounded text-[11px]"
              >
                1:1 맞춤 예약하기
              </button>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-1.5 bg-[#1c1917] hover:bg-[#292524] hover:text-white rounded transition flex items-center justify-center self-start"
              >
                <Instagram className="w-4 h-4 text-stone-400" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Lower Copyright Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-stone-600 text-[10px]">
        <div className="text-center sm:text-left space-y-1">
          <p>© 2026 cheongchun_film. All Rights Reserved.</p>
          <p className="font-mono">상호명: 청춘콘텐츠랩스 | 대표자: 임청춘 | 이메일: lch200048@gmail.com | 서울시 청년창업지구</p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for the Youth
          </span>
          <button 
            onClick={scrollToTop} 
            className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white rounded transition border border-[#1c1917] cursor-pointer"
            title="위로 가기"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
