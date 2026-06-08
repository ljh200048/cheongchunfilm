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

  // Load initial session and synchronous URL routing guard
  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const user = getStoredUser();

      if (path === '/admin') {
        if (!user) {
          setActiveTab('Home');
          window.history.replaceState(null, '', '/');
          setAuthType('login');
          setIsAuthOpen(true);
          alert('로그인이 필요한 페이지입니다. 로그인 화면으로 이동합니다.');
        } else if (user.role !== 'admin' && user.email.toLowerCase() !== 'lch200048@gmail.com') {
          setActiveTab('Home');
          window.history.replaceState(null, '', '/');
          alert('관리자만 접근 가능합니다.');
        } else {
          setActiveTab('Admin');
        }
      } else {
        if (path === '/' || path === '') {
          setActiveTab('Home');
        }
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, [currentUser]);

  const handleLogout = () => {
    setStoredUser(null);
    setCurrentUser(null);
    setActiveTab('Home');
    if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }
  };

  const handleAuthSuccess = (user: User) => {
    setStoredUser(user);
    setCurrentUser(user);
    
    // Check if they were logging in from /admin path or active intent
    if (window.location.pathname === '/admin') {
      if (user.role === 'admin' || user.email.toLowerCase() === 'lch200048@gmail.com') {
        setActiveTab('Admin');
      } else {
        setActiveTab('Home');
        window.history.replaceState(null, '', '/');
        alert('관리자만 접근 가능합니다.');
      }
    } else if (activeTab === 'Home') {
      if (user.role === 'admin' || user.email.toLowerCase() === 'lch200048@gmail.com') {
        setActiveTab('Admin');
        window.history.pushState(null, '', '/admin');
      } else {
        setActiveTab('MyPage');
      }
    }
  };

  const handleOpenAuth = (type: 'login' | 'register') => {
    setAuthType(type);
    setIsAuthOpen(true);
  };

  // Navigations sync with browser location pathname
  const navigateToTab = (tab: ActiveTab) => {
    const user = getStoredUser();
    if (tab === 'Admin') {
      if (!user) {
        setAuthType('login');
        setIsAuthOpen(true);
        alert('로그인이 필요한 페이지입니다. 로그인 화면으로 이동합니다.');
        return;
      } else if (user.role !== 'admin' && user.email.toLowerCase() !== 'lch200048@gmail.com') {
        alert('관리자만 접근 가능합니다.');
        return;
      }
      setActiveTab('Admin');
      window.history.pushState(null, '', '/admin');
    } else {
      setActiveTab(tab);
      if (window.location.pathname === '/admin') {
        window.history.pushState(null, '', '/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#17120F] text-[#F8F3E8] flex flex-col justify-between film-grain font-sans">
      
      {/* Header bar */}
      <Header 
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={navigateToTab}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Section Content Stager */}
      <main className="flex-grow">
        {activeTab === 'Home' && (
          <>
            <Hero onTabChange={navigateToTab} />
            <Services onTabChange={navigateToTab} />
            <Portfolio onTabChange={navigateToTab} />
            
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
                    onClick={() => navigateToTab('Reservation')}
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
                <h3 className="font-display font-black text-xl sm:text-3xl">청춘필름 서포터즈 Crew 2기 모집</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  인스타그램 릴스 작가부터 오프라인 스태프, 시각 포스터 디자이너까지 우리들 주변의 따스한 이야기를 수집할 크리에이터를 기다립니다.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigateToTab('Supporters')}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 border border-[#292524] text-xs text-stone-200 font-bold rounded-lg transition cursor-pointer"
                  >
                    서포터즈 모집공고 & 지원하기
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'Service' && <Services onTabChange={navigateToTab} />}
        {activeTab === 'Portfolio' && <Portfolio onTabChange={navigateToTab} />}
        {
          activeTab === 'Reservation' && (
            <Reservation 
              currentUser={currentUser} 
              onOpenAuth={handleOpenAuth} 
              onTabChange={navigateToTab} 
            />
          )
        }
        {activeTab === 'Schedule' && <Schedule />}
        {activeTab === 'Supporters' && <Supporters currentUser={currentUser} />}
        
        {activeTab === 'MyPage' && (
          <MyPage currentUser={currentUser} onTabChange={navigateToTab} />
        )}
        
        {activeTab === 'Admin' && <Admin />}
      </main>

      {/* Footer bar */}
      <Footer onTabChange={navigateToTab} />

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

