import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../types';
import { getStoredPortfolios } from '../utils/storage';
import { Film, Image, Presentation, Tv, Clapperboard, Video, Filter, Grid, Calendar, User, Eye, X } from 'lucide-react';

interface PortfolioProps {
  onTabChange: (tab: any) => void;
}

export default function Portfolio({ onTabChange }: PortfolioProps) {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    setPortfolios(getStoredPortfolios());
  }, []);

  const categories = ['전체', '이미지 제작', '포스터 제작', '릴스 숏폼', '예고편', '전체 편집'];

  const filteredPortfolios = selectedCategory === '전체'
    ? portfolios
    : portfolios.filter(item => item.category === selectedCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case '이미지 제작': return <Image className="w-4 h-4" />;
      case '포스터 제작': return <Presentation className="w-4 h-4" />;
      case '릴스 숏폼': return <Tv className="w-4 h-4" />;
      case '예고편': return <Clapperboard className="w-4 h-4" />;
      case '전체 편집': return <Video className="w-4 h-4" />;
      default: return <Film className="w-4 h-4" />;
    }
  };

  return (
    <section className="bg-[#0c0a09] py-20 sm:py-28 text-white border-b border-[#1c1917]" id="portfolio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title elements */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="font-mono text-xs text-amber-500 uppercase tracking-widest block font-bold">
            // OUR COMPLETED CINEMAS
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl tracking-tight">
            말보다 먼저 보여드릴게요
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone-400">
            청춘필름이 다듬고 완성한 세련된 장면들을 확인해 보세요. <br />
            모든 이미지는 클릭 시 자세한 제작 동기와 요청 명세를 감상할 수 있습니다.
          </p>
        </div>

        {/* Categories Tab selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-900 shadow-md font-bold'
                  : 'bg-[#12100f] border border-[#292524] text-stone-400 hover:text-white hover:border-stone-600'
              }`}
            >
              {cat !== '전체' && getCategoryIcon(cat)}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPortfolios.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-[#0f0d0c] rounded-xl overflow-hidden border border-[#1c1917] hover:border-amber-500/20 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-2xl"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-stone-950">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-stone-950/20 to-transparent"></div>
                <span className="absolute top-3 left-3 bg-[#0c0a09]/90 backdrop-blur border border-[#292524] text-[10px] text-amber-400 px-2.5 py-1 rounded font-mono uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              {/* Title & Description Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="font-display font-extrabold text-base text-stone-200 group-hover:text-amber-400 transition-colors pointer-events-none line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-stone-400 leading-relaxed line-clamp-2 pointer-events-none">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#1c1917] text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-600" />
                    {item.client || '개인 고객'}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-stone-600" />
                    {item.date || '2026.06'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredPortfolios.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-[#292524] rounded-xl bg-[#0f0d0c] text-stone-500">
              <Film className="w-10 h-10 mx-auto text-stone-600 mb-2 animate-bounce" />
              <p className="text-xs">이 카테고리에는 등록된 작업 사례가 아직 존재하지 않습니다.</p>
              <p className="text-[10px] text-amber-500/75 mt-1">관리자 대시보드에서 마음껏 새로운 사례를 직접 채워보세요!</p>
            </div>
          )}
        </div>

        {/* Pitch Area */}
        <div className="mt-16 bg-gradient-to-r from-[#1c1917]/25 to-[#0c0a09] border border-[#292524] rounded-xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="font-display font-bold text-lg text-stone-200">
              당신의 소중한 낭만도 포트폴리오의 한 장면에 채워보세요
            </h4>
            <p className="text-[11px] text-[#a8a29e] leading-relaxed max-w-xl">
              어떤 포스터와 컷구성이라도 좋습니다. 상징할 수 있는 영화 같은 색상 톤을 가미해, 사람들의 시선을 완전히 고정시키는 맞춤형 콘텐츠로 승화하여 드립니다.
            </p>
          </div>
          <button
            onClick={() => onTabChange('Reservation')}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs font-bold rounded-lg transition duration-200 shrink-0 cursor-pointer"
          >
            포트폴리오 같은 콘텐츠 의뢰하기
          </button>
        </div>

      </div>

      {/* Portfolio Item Detail Overlay Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-[#0c0a09] border border-[#292524] rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Upper Frame Media */}
            <div className="relative aspect-video w-full bg-stone-950">
              <img 
                src={selectedItem.imageUrl} 
                alt={selectedItem.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] to-transparent"></div>
              
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 bg-[#0c0a09]/80 text-[#e7e5e4] hover:text-[#fff] hover:bg-[#1c1917] rounded-full border border-[#292524] transition ring-offset-stone-900 focus:ring-2 focus:ring-amber-500"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="absolute bottom-4 left-6 bg-amber-500 text-stone-900 px-3 py-1 text-xs font-bold tracking-widest uppercase rounded">
                {selectedItem.category}
              </span>
            </div>

            {/* Inner Details Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="font-display font-black text-xl sm:text-2xl text-stone-100">
                  {selectedItem.title}
                </h3>
                
                {/* Specific Meta Columns */}
                <div className="flex flex-wrap gap-4 text-xs text-stone-500 font-mono">
                  <div className="flex items-center gap-1">
                    <span className="text-stone-700">Client:</span>
                    <span className="text-stone-300">{selectedItem.client || '개인 고객'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-stone-700">Published Date:</span>
                    <span className="text-stone-300">{selectedItem.date || '2026.06'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-stone-700">Project Type:</span>
                    <span className="text-stone-300">{selectedItem.category}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
                  프로젝트 소개 및 디자인 콘셉트
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              {/* Extra immersive tech details - Not bloated, simply stylish */}
              <div className="bg-[#12100f] border border-[#292524] p-4 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-[10px] text-stone-600 font-mono uppercase">Color Grading</p>
                  <p className="text-xs text-stone-300 font-semibold mt-1">Cinematic Warm</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-600 font-mono uppercase">Frame Style</p>
                  <p className="text-xs text-stone-300 font-semibold mt-1">Analog 3:2 Ratio</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-600 font-mono uppercase">Target Platform</p>
                  <p className="text-xs text-stone-300 font-semibold mt-1">Mobile/SNS Meta</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-600 font-mono uppercase">Resolution</p>
                  <p className="text-xs text-stone-300 font-semibold mt-1">4K UHD Master</p>
                </div>
              </div>

              {/* Booking CTA trigger */}
              <div className="flex justify-between items-center pt-4 border-t border-[#1c1917]">
                <span className="text-[11px] text-stone-500">당신의 프로젝트도 이와 유사한 연출이 가능합니다.</span>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    onTabChange('Reservation');
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-[#0c0a09] text-xs font-bold rounded transition cursor-pointer"
                >
                  유사한 조건으로 제작 문의하기
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
