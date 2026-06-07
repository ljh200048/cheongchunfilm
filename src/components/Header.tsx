import React, { useState } from 'react';
import { User, ActiveTab } from '../types';
import { Film, LogIn, LogOut, User as UserIcon, ShieldAlert, Menu, X, Landmark, Compass } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onLogout: () => void;
  onOpenAuth: (type: 'login' | 'register') => void;
  onQuickRoleSwitch: (role: 'user' | 'admin' | 'guest') => void;
}

export default function Header({
  currentUser,
  activeTab,
  onTabChange,
  onLogout,
  onOpenAuth,
  onQuickRoleSwitch
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleSwitches, setShowRoleSwitches] = useState(true);

  const menuItems: { name: string; tab: ActiveTab; label: string }[] = [
    { name: '홈컨텐츠', tab: 'Home', label: 'Home' },
    { name: '제작서비스', tab: 'Service', label: 'Service' },
    { name: '작업사례', tab: 'Portfolio', label: 'Portfolio' },
    { name: '예약신청', tab: 'Reservation', label: 'Reservation' },
    { name: '제작일정', tab: 'Schedule', label: 'Schedule' },
    { name: '서포터즈', tab: 'Supporters', label: 'Supporters' },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0c0a09]/90 backdrop-blur-md border-b border-[#292524] transition-all duration-300">
      {/* Quick Testing Sandbox Ribbon - Highly interactive and elegant */}
      {showRoleSwitches && (
        <div className="bg-[#1c1917] border-b border-[#292524] text-[11px] font-mono py-1.5 px-4 text-stone-400 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>[AI Studio 테스터 퀵스위치] :</span>
            <span className="text-amber-100 font-semibold bg-[#292524] px-1.5 py-0.5 rounded">
              {currentUser ? `${currentUser.name} (${currentUser.role === 'admin' ? '관리자' : '일반고객'})` : '게스트 상태'}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => onQuickRoleSwitch('guest')} 
              className={`px-2 py-0.5 rounded transition ${!currentUser ? 'bg-amber-500 text-stone-950 font-semibold' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'}`}
            >
              게스트(로그아웃)
            </button>
            <button 
              onClick={() => onQuickRoleSwitch('user')} 
              className={`px-2 py-0.5 rounded transition ${currentUser?.role === 'user' ? 'bg-amber-500 text-stone-950 font-semibold' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'}`}
            >
              일반회원 (이청춘)
            </button>
            <button 
              onClick={() => onQuickRoleSwitch('admin')} 
              className={`px-2 py-0.5 rounded transition ${currentUser?.role === 'admin' ? 'bg-amber-500 text-stone-950 font-semibold' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'}`}
            >
              최고관리자 모드
            </button>
            <button 
              onClick={() => setShowRoleSwitches(false)} 
              className="text-stone-500 hover:text-stone-300 ml-1.5"
              title="숨기기"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo Brand with CheongChun film requested pair */}
          <div 
            onClick={() => handleTabClick('Home')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <Film className="w-5 h-5 text-amber-500 transition-transform duration-500 group-hover:rotate-12" />
            <span className="font-display text-lg font-bold tracking-widest text-[#fafaf9] group-hover:text-amber-400 transition-colors">
              cheongchun_film
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleTabClick(item.tab)}
                className={`px-4 py-2 text-xs font-medium tracking-wide rounded-md transition-all duration-200 cursor-pointer ${
                  activeTab === item.tab
                    ? 'text-amber-500 bg-[#1c1917]'
                    : 'text-stone-400 hover:text-white hover:bg-stone-900/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Session Handles */}
          <div className="hidden lg:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                {currentUser.role === 'admin' ? (
                  <button
                    onClick={() => handleTabClick('Admin')}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium rounded-md border transition-all ${
                      activeTab === 'Admin'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                        : 'border-amber-500/30 hover:border-amber-500 bg-transparent text-amber-400'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Admin
                  </button>
                ) : (
                  <button
                    onClick={() => handleTabClick('MyPage')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      activeTab === 'MyPage'
                        ? 'text-amber-500 bg-[#1c1917]'
                        : 'text-[#e7e5e4] hover:text-white hover:bg-stone-900'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    마이페이지
                  </button>
                )}
                
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-400 hover:text-stone-200 rounded-md transition cursor-pointer"
                  title="로그아웃"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-white rounded-md transition cursor-pointer"
                >
                  로그인
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-[#0c0a09] font-semibold rounded-md transition cursor-pointer shadow-lg hover:shadow-amber-500/10"
                >
                  시작하기
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center space-x-2">
            {currentUser && currentUser.role === 'admin' && (
              <button
                onClick={() => handleTabClick('Admin')}
                className="flex items-center justify-content border border-amber-500/50 p-1.5 rounded-md text-amber-500 text-xs"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-stone-400 hover:text-white hover:bg-stone-900 border border-[#292524]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#292524] bg-[#0c0a09] px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {menuItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => handleTabClick(item.tab)}
              className={`block w-full text-left px-4 py-2.5 rounded-md text-xs font-medium tracking-wide transition ${
                activeTab === item.tab
                  ? 'text-amber-500 bg-[#1c1917]'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              {item.label} ({item.name})
            </button>
          ))}
          
          <div className="border-t border-[#292524] my-2 pt-2">
            {currentUser ? (
              <div className="space-y-1">
                {currentUser.role !== 'admin' && (
                  <button
                    onClick={() => handleTabClick('MyPage')}
                    className={`flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-md text-xs font-medium ${
                      activeTab === 'MyPage' ? 'text-amber-500 bg-[#1c1917]' : 'text-[#e7e5e4] hover:bg-[#1c1917]'
                    }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    내 정보 및 예약 (My Page)
                  </button>
                )}
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-md text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-900"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-medium"
                >
                  로그인
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 rounded bg-amber-500 hover:bg-amber-600 text-[#0c0a09] text-xs font-semibold"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
