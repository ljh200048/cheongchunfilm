import React, { useState } from 'react';
import { User, ActiveTab } from '../types';
import { Film, LogIn, LogOut, User as UserIcon, ShieldAlert, Menu, X, Landmark, Compass, Instagram } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onLogout: () => void;
  onOpenAuth: (type: 'login' | 'register') => void;
}

export default function Header({
  currentUser,
  activeTab,
  onTabChange,
  onLogout,
  onOpenAuth
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const isAdmin = currentUser?.email.toLowerCase() === 'lch200048@gmail.com';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0c0a09]/90 backdrop-blur-md border-b border-[#292524] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo Brand with CheongChun film requested pair */}
          <div 
            onClick={() => handleTabClick('Home')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <Film className="w-5 h-5 text-amber-500 transition-transform duration-500 group-hover:rotate-12" />
            <span className="font-display text-lg font-bold tracking-widest text-[#fafaf9] group-hover:text-amber-400 transition-colors">
              CHEONGCHUN FILM
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
            <a 
              href="https://www.instagram.com/cheongchun__film?igsh=MTY1bHYzOXZ3bXpoMw==" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 text-stone-400 hover:text-amber-500 hover:bg-stone-900/50 rounded-md transition cursor-pointer"
              title="인스타그램 방문하기"
            >
              <Instagram className="w-4 h-4" />
            </a>
            {currentUser ? (
              <div className="flex items-center space-x-2">
                {isAdmin ? (
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
            {isAdmin && (
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
          
          <div className="px-4 py-2 border-b border-[#292524]/30 flex items-center justify-between text-[10px] text-stone-500 font-mono tracking-wider">
            <span>OFFICIAL SNS</span>
            <a 
              href="https://www.instagram.com/cheongchun__film?igsh=MTY1bHYzOXZ3bXpoMw==" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 text-amber-500 hover:text-amber-400 font-bold transition"
            >
              <Instagram className="w-3.5 h-3.5" />
              @cheongchun__film
            </a>
          </div>
          
          <div className="border-t border-[#292524] my-2 pt-2">
            {currentUser ? (
              <div className="space-y-1">
                {!isAdmin && (
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
