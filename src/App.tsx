/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Reservation from './components/Reservation';
import Schedule from './components/Schedule';
import Supporters from './components/Supporters';
import Auth from './components/Auth';
import MyPage from './components/MyPage';
import Admin from './components/Admin';

import { User, ActiveTab } from './types';
import { getStoredUser, setStoredUser, saveUser } from './utils/storage';
import { Film, CalendarDays, Sparkles, Sliders } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('Home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');

  // Load initial session
  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    setStoredUser(null);
    setCurrentUser(null);
    setActiveTab('Home');
  };

  const handleAuthSuccess = (user: User) => {
    setStoredUser(user);
    setCurrentUser(user);
    // If guest registered/logged in for a reservation, bring them back or transition
    if (activeTab === 'Home') {
      setActiveTab('MyPage');
    }
  };

  const handleOpenAuth = (type: 'login' | 'register') => {
    setAuthType(type);
    setIsAuthOpen(true);
  };

  // Helper sandbox toggler - Instant review capability
  const handleQuickRoleSwitch = (role: 'user' | 'admin' | 'guest') => {
    if (role === 'guest') {
      setStoredUser(null);
      setCurrentUser(null);
      setActiveTab('Home');
    } else if (role === 'user') {
      const demoUser: User = {
        id: 'u_tester',
        name: '이청춘',
        email: 'lch200048@gmail.com',
        phone: '010-8765-4321',
        role: 'user'
      };
      saveUser(demoUser);
      setStoredUser(demoUser);
      setCurrentUser(demoUser);
      setActiveTab('MyPage');
    } else if (role === 'admin') {
      const demoAdmin: User = {
        id: 'u_admin',
        name: '청춘필름 관리자',
        email: 'admin@cheongchun.com',
        phone: '010-1234-5678',
        role: 'admin'
      };
      saveUser(demoAdmin);
      setStoredUser(demoAdmin);
      setCurrentUser(demoAdmin);
      setActiveTab('Admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-100 flex flex-col justify-between film-grain font-sans">
      
      {/* Header bar */}
      <Header 
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        onQuickRoleSwitch={handleQuickRoleSwitch}
      />

      {/* Main Section Content Stager */}
      <main className="flex-grow">
        {activeTab === 'Home' && (
          <>
            <Hero onTabChange={setActiveTab} />
            <Services onTabChange={setActiveTab} />
            <Portfolio onTabChange={setActiveTab} />
            
            {/* Visual Reservation Pitch Section */}
            <section className="bg-[#0f0d0c] py-20 border-b border-[#1c1917] hover:bg-[#12100f] transition">
              <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                <blockquote className="font-serif italic text-lg sm:text-2xl text-stone-200 tracking-wide">
                  "좋은 순간은 수식처럼 금방 지나가지만, <br />
                  잘 촬영되고 디자인된 콘텐츠는 영원토록 가슴 깊이 남습니다."
                </blockquote>
                
                <div className="space-y-2 max-w-lg mx-auto">
                  <p className="text-xs text-stone-400 leading-relaxed">
                    지금 촬영을 한 장만 남겨두기 무언가 아쉽다면, 청춘필름에 영화 같은 영상과 감각적인 고해상도 디자인을 기획 문의하세요.
                  </p>
                  <p className="text-[11.5px] text-amber-500/80 font-semibold uppercase tracking-wider">
                    가장 알맞은 감독과 크루를 즉각 매칭해 드립니다.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('Reservation')}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-900 font-extrabold text-xs tracking-wider uppercase rounded-lg transition-transform hover:-translate-y-0.5 cursor-pointer shadow-lg"
                  >
                    원하는 날짜로 제작 예약하기 ⟶
                  </button>
                </div>
              </div>
            </section>

            <Schedule />
            
            {/* Supporters Banner Block inside Main Pipeline */}
            <section className="bg-[#0c0a09] py-16 border-b border-[#1c1917] text-center space-y-6">
              <div className="max-w-2xl mx-auto px-4 space-y-3">
                <span className="font-mono text-[10px] text-amber-500 tracking-widest font-bold uppercase">// SUPPORTERS TEAM BANNER</span>
                <h3 className="font-display font-black text-xl sm:text-3xl">청춘필름 서포터즈 Crew 3기 모집</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  인스타그램 릴스 작가부터 오프라인 스태프, 시각 포스터 디자이너까지 우리들 주변의 따스한 이야기를 수집할 크리에이터를 기다립니다.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('Supporters')}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 border border-[#292524] text-xs text-stone-200 font-bold rounded-lg transition cursor-pointer"
                  >
                    서포터즈 모집공고 & 지원하기
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'Service' && <Services onTabChange={setActiveTab} />}
        {activeTab === 'Portfolio' && <Portfolio onTabChange={setActiveTab} />}
        {
          activeTab === 'Reservation' && (
            <Reservation 
              currentUser={currentUser} 
              onOpenAuth={handleOpenAuth} 
              onTabChange={setActiveTab} 
            />
          )
        }
        {activeTab === 'Schedule' && <Schedule />}
        {activeTab === 'Supporters' && <Supporters currentUser={currentUser} />}
        
        {activeTab === 'MyPage' && (
          <MyPage currentUser={currentUser} onTabChange={setActiveTab} />
        )}
        
        {activeTab === 'Admin' && <Admin />}
      </main>

      {/* Footer bar */}
      <Footer onTabChange={setActiveTab} />

      {/* Authentication Modal Overlay */}
      <Auth 
        isOpen={isAuthOpen}
        type={authType}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}

