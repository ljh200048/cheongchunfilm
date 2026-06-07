import React, { useState, useEffect } from 'react';
import { ScheduleItem } from '../types';
import { getStoredSchedules } from '../utils/storage';
import { Calendar, ChevronLeft, ChevronRight, BellRing, Sparkles, MessageSquareDot } from 'lucide-react';

export default function Schedule() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    setSchedules(getStoredSchedules());
  }, []);

  // For June 2026: 
  // June 1st, 2026 is a Monday.
  // total days is 30.
  const daysInJune = 30;
  const startDayOffset = 1; // 0 = Sunday, 1 = Monday, etc. So June 1st starts on Monday (index 1).
  
  const calendarGrid: (number | null)[] = [];
  // Fill offset empty squares
  for (let i = 0; i < startDayOffset; i++) {
    calendarGrid.push(null);
  }
  // Fill actual June days
  for (let i = 1; i <= daysInJune; i++) {
    calendarGrid.push(i);
  }

  const getSchedulesForDay = (dayNum: number) => {
    const formattedDate = `2026-06-${dayNum.toString().padStart(2, '0')}`;
    return schedules.filter(sch => sch.date === formattedDate);
  };

  const handleDayClick = (dayNum: number | null) => {
    if (!dayNum) return;
    const dateStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;
    setSelectedDay(selectedDay === dateStr ? null : dateStr);
  };

  return (
    <section className="bg-[#0c0a09] py-20 sm:py-28 border-b border-[#1c1917]" id="schedule">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title details */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="font-mono text-xs text-amber-500 uppercase tracking-widest font-bold block">
            // CHEONGCHUN CALENDAR
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-stone-100">
            cheongchun_film 제작 일정표
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone-400 leading-relaxed">
            cheongchun_film의 제작 일정과 업로드 일정을 확인해보세요. <br />
            감성을 만드는 새로운 콘텐츠, 촬영 스케줄, 서포터즈 모집 소식을 실시간으로 공유합니다.
          </p>
        </div>

        {/* Master Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: June 2026 Custom Monthly Grid (7 cols) */}
          <div className="col-span-1 lg:col-span-8 bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 shadow-xl">
            
            {/* Calendar Head */}
            <div className="flex items-center justify-between border-b border-[#1c1917] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span className="font-display font-black text-lg tracking-wide">
                  2026년 6월 (June)
                </span>
              </div>
              <span className="font-mono text-[10px] bg-stone-900 border border-[#292524] px-2.5 py-1 text-stone-400 rounded-md">
                CURRENT LOCAL TIME : 6월 Staging
              </span>
            </div>

            {/* Week Headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono tracking-widest text-stone-500 font-bold mb-4 uppercase">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {calendarGrid.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="aspect-square bg-transparent"></div>;
                }

                const daySchedules = getSchedulesForDay(day);
                const isSelected = selectedDay === `2026-06-${day.toString().padStart(2, '0')}`;
                
                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square rounded-xl p-1.5 sm:p-2.5 relative flex flex-col justify-between border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10'
                        : daySchedules.length > 0
                        ? 'border-[#292524] bg-amber-500/5 hover:bg-stone-900'
                        : 'border-[#1c1917] bg-[#0c0a09]/50 hover:bg-[#12100f]'
                    }`}
                  >
                    {/* Day Number */}
                    <span className={`text-[10px] sm:text-xs font-mono font-bold ${
                      daySchedules.length > 0 ? 'text-amber-500' : 'text-stone-500'
                    }`}>
                      {day}
                    </span>

                    {/* Simple Dot indicators */}
                    <div className="flex gap-1 justify-center">
                      {daySchedules.slice(0, 3).map((_, dotIdx) => (
                        <span key={dotIdx} className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      ))}
                    </div>

                    {/* Popover Hover tooltip summary in desktop */}
                    {daySchedules.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 text-[8px] font-mono px-1 rounded bg-stone-900 text-stone-300 scale-90">
                        {daySchedules.length}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Click info banner */}
            <div className="mt-6 flex items-center justify-between text-[10px] text-stone-500 border-t border-[#1c1917]/70 pt-4">
              <span>● 주황색 날짜는 예정된 메인 기획 일정을 표기한 것입니다.</span>
              <span>날짜 클릭 시 하단에 세부 일정이 포커싱됩니다.</span>
            </div>

            {/* Mini Focused Detail view */}
            {selectedDay && (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-stone-300 space-y-2 animate-fadeIn">
                <p className="font-mono text-amber-500 font-extrabold flex items-center gap-1.5">
                  <BellRing className="w-3.5 h-3.5" />
                  {selectedDay} 선택된 일정 목록:
                </p>
                {schedules.filter(s => s.date === selectedDay).length === 0 ? (
                  <p className="text-stone-500 text-[11px]">이날은 예정된 촬영이나 업로드 일정이 없습니다. 예약 상담을 비워두세요!</p>
                ) : (
                  <div className="divide-y divide-[#1c1917]">
                    {schedules.filter(s => s.date === selectedDay).map(sch => (
                      <div key={sch.id} className="py-2 first:pt-0 last:pb-0 space-y-1">
                        <p className="font-semibold text-stone-200">{sch.title}</p>
                        <p className="text-[11px] text-stone-400">{sch.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Col 2: Calendar Items Timeline List (4 cols) */}
          <div className="col-span-1 lg:col-span-4 space-y-6">
            <div className="bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 shadow-xl text-[#fafaf9]">
              <h3 className="font-display font-black text-sm tracking-widest uppercase text-stone-400 mb-6 flex items-center gap-2">
                <MessageSquareDot className="w-4 h-4 text-amber-500" />
                6월 마일스톤 리스트
              </h3>

              <div className="space-y-6">
                {schedules
                  .sort((a,b) => a.date.localeCompare(b.date))
                  .map((sch) => {
                    const [, month, day] = sch.date.split('-');
                    return (
                      <div 
                        key={sch.id}
                        onClick={() => setSelectedDay(sch.date)}
                        className={`group relative flex gap-4 pl-6 border-l transition duration-250 cursor-pointer ${
                          selectedDay === sch.date ? 'border-amber-500' : 'border-[#1c1917] hover:border-stone-500'
                        }`}
                      >
                        {/* Bullet Icon */}
                        <span className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full border transition ${
                          selectedDay === sch.date 
                            ? 'bg-amber-500 border-amber-500' 
                            : 'bg-stone-950 border-[#292524]'
                        }`}></span>

                        <div className="space-y-1">
                          <span className="font-mono text-[10px] font-semibold text-amber-500">
                            {month}월 {day}일
                          </span>
                          <h4 className="font-display text-xs font-bold text-stone-200 group-hover:text-amber-400 transition-colors">
                            {sch.title}
                          </h4>
                          <p className="text-[11px] text-[#a8a29e] leading-relaxed line-clamp-2">
                            {sch.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>

            </div>

            {/* Quick Consultation Promo */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1c1917] to-[#0c0a09] border border-[#292524] text-center space-y-4">
              <Sparkles className="w-5 h-5 mx-auto text-amber-500" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold tracking-wide">비어있는 일정을 발견하셨나요?</h4>
                <p className="text-[11px] text-stone-500">지정된 정기 제작 일외의 날짜는 1:1 선제 예약 제작 상담 가능 기간입니다.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
