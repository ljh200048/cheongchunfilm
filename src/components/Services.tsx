import React from 'react';
import { Image, Presentation, Tv, Clapperboard, Video, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { ActiveTab } from '../types';

interface ServicesProps {
  onTabChange: (tab: ActiveTab) => void;
}

export default function Services({ onTabChange }: ServicesProps) {
  const services = [
    {
      icon: Image,
      title: '이미지 제작',
      badge: 'BRANDING_IMG',
      tagline: '한 장의 분위기로 시선을 바꾸다',
      desc: '브랜드, 사내 행사, 크루 모임, SNS 콘텐츠에 어울리는 극강의 감성 이미지를 디자인합니다. 인스타그램 피드, 유튜브 커버, 홍보 슬라이더까지 목적에 맞춰 눈길을 사로잡는 최적의 레이아웃을 구축해드립니다.'
    },
    {
      icon: Presentation,
      title: '포스터 제작',
      badge: 'POSTER_DESIGN',
      tagline: '행사의 격을 높이는 감성 비주얼',
      desc: '행사, 모집 공고, 소모임 프로젝트를 한눈에 명쾌하게 전달하는 고감도 시네마틱 포스터를 기획·디자인합니다. 여백의 미와 설득력 있는 타이포그래피로 사람들의 오프라인/온라인 발걸음을 붙잡아 드립니다.'
    },
    {
      icon: Tv,
      title: '릴스 · 숏폼 제작',
      badge: 'REELS_SHORTS',
      tagline: '첫 3초로 대중의 마음을 가두다',
      desc: '인스타그램 릴스, 틱톡, 유튜브 쇼츠 트렌드에 꼭 맞춘 세련된 오프닝 연출과 타격감 있는 숏폼 영상을 기획·제작합니다. 짧게 소비되는 채널 특성에 맞춰 스크롤을 멈추게 하는 화려하고 감각적인 트렌디 자막을 담습니다.'
    },
    {
      icon: Clapperboard,
      title: '예고편 제작',
      badge: 'TEASER_TRAILER',
      tagline: '기대감을 극대화하는 시네마틱 오프너',
      desc: '우리의 만남, 연합 MT, 스타트업 데모데이 등 소중한 약속을 영화 예고편 형태로 긴장감 있고 역동적으로 연출합니다. 호기심을 유도하는 자막 배치와 웅장한 음악 믹싱으로 사람들을 기다리게 만듭니다.'
    },
    {
      icon: Video,
      title: '전체 편집 제작',
      badge: 'FULL_EDITING',
      tagline: '조각 영상을 하나의 완결된 감성 영화로',
      desc: '전달해주시는 수많은 촬영본 원본 소스들을 모아 물 흐르듯 유려한 완결 형태 영상물로 마스터링합니다. 정제된 컷 편집, 맞춤형 폰트 피팅, 자막 작성, 노이즈 오디오 복원, 낭만적인 컬러 그레이딩까지 종합 디자인해드립니다.'
    }
  ];

  return (
    <section className="bg-[#0c0a09] py-20 sm:py-28 border-b border-[#1c1917]" id="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Grid */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="space-y-3">
            <span className="font-mono text-xs text-amber-500 tracking-widest uppercase">
              // Creative Service Suite
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#fafaf9]">
              어떤 일을 할까요?
            </h2>
            <p className="font-sans text-xs sm:text-sm text-stone-500 max-w-lg leading-relaxed">
              기획 단계부터 미장센 디자인, 자막 오디오 믹싱까지 모든 여정을 영화 제작팀처럼 감성 있고 정확하게 책임집니다.
            </p>
          </div>
          <button
            onClick={() => onTabChange('Reservation')}
            className="self-start md:self-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-850 hover:text-amber-500 border border-[#292524] text-xs font-semibold text-stone-300 rounded-md transition duration-300 cursor-pointer"
          >
            서비스 무료 맞춤 상담
          </button>
        </div>

        {/* Dynamic Services Bento-ish List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div 
                key={idx}
                className="group relative bg-[#0f0d0c] hover:bg-[#151211] border border-[#292524]/60 hover:border-amber-500/30 rounded-xl p-6 transition-all duration-350 flex flex-col justify-between amber-glow-sm cursor-pointer"
              >
                {/* Upper Details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-[#1c1917] group-hover:bg-amber-500/10 rounded-lg border border-[#292524] group-hover:border-amber-500/20 text-stone-300 group-hover:text-amber-400 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] font-semibold text-stone-600 bg-stone-900 group-hover:bg-amber-500/5 group-hover:text-amber-500/80 px-2 py-0.5 rounded tracking-wide transition-colors">
                      {svc.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-base text-stone-100 group-hover:text-white transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-[11px] font-medium text-amber-500/70">
                      {svc.tagline}
                    </p>
                  </div>

                  <p className="text-[11px] text-stone-400 leading-relaxed group-hover:text-stone-300 transition-colors">
                    {svc.desc}
                  </p>
                </div>

                {/* Lower Action Guide Indicator */}
                <div className="mt-6 pt-4 border-t border-[#1c1917] flex items-center justify-between text-[11px] text-stone-500 group-hover:text-stone-300 transition-colors">
                  <span>작업 의뢰서 접수중</span>
                  <span className="font-mono text-xs font-bold text-amber-500/60 group-hover:text-amber-500 transition-colors">
                    ⟶
                  </span>
                </div>
              </div>
            );
          })}

          {/* Call to action element as 6th card */}
          <div className="bg-[#1c1917]/30 border border-dashed border-[#292524] rounded-xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-mono text-[10px] text-amber-500/50">RESERVATION PROMO</span>
              <h3 className="font-display font-bold text-base text-stone-300">
                원하는 날짜가 고민되시나요?
              </h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                "좋은 순간은 수식처럼 금방 지나가지만 잘 기록된 콘텐츠는 평생 오래도록 기억 속에 남습니다."
                <br className="mt-1 block" />
                선약된 스케줄이 다 차기 전에, 상담 예약을 등록해 보세요. 크루 대표팀이 직접 연락드리겠습니다.
              </p>
            </div>
            <button
              onClick={() => onTabChange('Reservation')}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs font-bold rounded transition-colors tracking-wide mt-6 cursor-pointer"
            >
              원하는 날짜로 제작 예약하기
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
