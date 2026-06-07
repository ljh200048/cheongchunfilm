import React, { useState } from 'react';
import { saveSupporter } from '../utils/storage';
import { User, SupporterApplicant } from '../types';
import { Crown, Sparkles, Send, CheckCircle2, UserCheck, HelpCircle, FileText } from 'lucide-react';

interface SupportersProps {
  currentUser: User | null;
}

export default function Supporters({ currentUser }: SupportersProps) {
  // Application fields
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [field, setField] = useState('릴스 · 숏폼 제작');
  const [reason, setReason] = useState('');

  // Statuses
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Constants
  const fields = [
    '콘텐츠 기획',
    '사진 및 영상 촬영',
    '릴스 · 숏폼 제작',
    '포스터 및 이미지 디자인',
    'SNS 홍보',
    '현장 스태프'
  ];

  const requirements = [
    '아날로그 감성의 영화나 사진 필름 콘텐츠 구성을 애정하는 분',
    '청년 모임, 야외 페스티벌 행사, 청춘들의 로컬 인터뷰에 관심이 뜨거운 분',
    'SNS 계정(인스타, 틱톡)이나 개인 블로그 등에 꾸준한 업로드를 즐기는 분',
    '기획부터 현장 셔터음, 최종 마스터링까지 함께 성장하는 팀 문화를 선호하는 분'
  ];

  const activities = [
    'cheongchun_film 시공 프로젝트 기획 및 메인 촬영 현장 지원',
    '연합 소모임, 청년 포스터 미장센 레퍼런스 수집 및 배포',
    '스케치 릴스 및 메가폰 쇼츠 영상 가공 참여',
    '서포터즈 공식 정기 피드백 기획 대담회 및 파티 참가'
  ];

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();

    const newApplicant: SupporterApplicant = {
      id: 'sup_appl_' + Date.now(),
      name: name,
      phone: phone,
      email: email,
      field: field,
      reason: reason,
      createdAt: new Date().toISOString()
    };

    saveSupporter(newApplicant);
    setIsSubmitted(true);
  };

  return (
    <section className="bg-[#0c0a09] py-20 sm:py-28 relative film-grain text-white border-b border-[#1c1917]" id="supporters">
      
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title area */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono tracking-widest uppercase rounded">
            <Crown className="w-3.5 h-3.5" />
            Supporters Recruiting
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-stone-100 uppercase">
            cheongchun_film 서포터즈 모집
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone-400 leading-relaxed">
            청춘의 빛나는 한 장면을 함께 기록할 열정 넘치는 영 크리에이터를 찾습니다. <br />
            당신의 재능과 시각이 사람들의 찬사를 받는 영화로 탈바꿈하는 여정에 함께하세요.
          </p>
        </div>

        {/* Info Grid (Requirements vs Activities) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Target audience */}
          <div className="bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="font-display font-extrabold text-base text-stone-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              이런 분을 적극 환영합니다!
            </h3>
            <ul className="space-y-3.5 text-xs text-stone-400">
              {requirements.map((req, idx) => (
                <li key={idx} className="flex gap-2 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Activities detail */}
          <div className="bg-[#0f0d0c] border border-[#292524] rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="font-display font-extrabold text-base text-stone-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              어떤 활동을 하게 되나요?
            </h3>
            <ul className="space-y-3.5 text-xs text-stone-400">
              {activities.map((act, idx) => (
                <li key={idx} className="flex gap-2 leading-relaxed">
                  <UserCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Benefits banner */}
        <div className="bg-[#12100f] border border-[#292524] p-5 rounded-xl mb-16 text-center text-xs text-stone-300">
          <span className="text-amber-500 font-bold font-mono uppercase mr-2">[활동 혜택]</span>
          포트폴리오 맞춤 피드백 및 자막 제작 자문 제공 • 소정의 크리에이티브 활동 명목 원고료 • 우수 수료자 수료증 포상
        </div>

        {/* Intersecting Recruiment submission center */}
        <div className="max-w-2xl mx-auto">
          {isSubmitted ? (
            <div className="bg-[#0f0d0c] border border-[#292524] rounded-2xl p-8 text-center space-y-6 amber-glow">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-base">서포터즈 특별 지원 신청 완료!</h3>
                <p className="text-[11px] text-stone-400 leading-normal">
                  지원해주신 수치와 동기들은 고이 검토하여 개별 연락 및 기수 대담에 초대하기 위한 문자를 보내드립니다. <br />
                  cheongchun_film의 열정 어린 여정에 용기내어 손 내밀어주셔서 대단히 고맙습니다.
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setReason('');
                }}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-[#292524] text-xs text-stone-300 font-medium rounded transition"
              >
                다른 내용으로 추가 지원하기
              </button>
            </div>
          ) : (
            <div className="bg-[#0f0d0c] border border-[#292524] p-6 sm:p-10 rounded-2xl shadow-xl">
              <h3 className="font-display font-black text-sm tracking-widest uppercase text-stone-400 mb-6 flex items-center gap-2 border-b border-[#1c1917] pb-3">
                <FileText className="w-4 h-4 text-amber-500" />
                서포터즈 기수 온라인 지원서 작성
              </h3>

              <form onSubmit={handleSubmitApplication} className="space-y-5 text-xs">
                
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[#a8a29e] font-semibold">지원자 성명</label>
                    <input
                      type="text"
                      required
                      placeholder="이청춘"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#12100f] border border-[#292524] rounded px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[#a8a29e] font-semibold flex items-center gap-1">
                      연락처 <span className="text-[10px] text-stone-500">(010-0000-0000)</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="010-8765-4321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#12100f] border border-[#292524] rounded px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[#a8a29e] font-semibold">이메일 주소</label>
                    <input
                      type="email"
                      required
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#12100f] border border-[#292524] rounded px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[#a8a29e] font-semibold">희망 지원 분야</label>
                    <select
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="w-full bg-[#12100f] border border-[#292524] rounded px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500 transition-all"
                    >
                      {fields.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cover letter */}
                <div className="space-y-1">
                  <label className="block text-[#a8a29e] font-semibold">지원 동기 및 자신 있는 스킬 소개</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="당신이 카메라 앞이나 편집 모니터 뒤에서 열정을 발휘하고 싶은 순간을 솔직하고 감성적인 톤으로 들려주세요."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500 transition-all"
                  ></textarea>
                </div>

                {/* Action Submit */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-extrabold rounded transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  지원서 접수 완료하기
                </button>

              </form>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
