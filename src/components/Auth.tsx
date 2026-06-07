import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getStoredUsers, saveUser } from '../utils/storage';
import { X, Mail, Lock, User as UserIcon, Phone, Shield } from 'lucide-react';

interface AuthProps {
  isOpen: boolean;
  type: 'login' | 'register';
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export default function Auth({ isOpen, type, onClose, onAuthSuccess }: AuthProps) {
  const [authType, setAuthType] = useState<'login' | 'register'>(type);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Simulated password
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [wantsToBeAdmin, setWantsToBeAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Reset admin check states whenever open state or type shifts
  useEffect(() => {
    setWantsToBeAdmin(false);
    setAdminCode('');
    setErrorStatus(null);
  }, [authType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);
    const users = getStoredUsers();

    if (authType === 'login') {
      const found = users.find(u => u.email === email);
      if (found) {
        onAuthSuccess(found);
        onClose();
      } else {
        setErrorStatus('등록되지 않은 이메일 주소입니다. [테스터 퀵스위치] 혹은 간편 회원가입을 이용해주세요!');
      }
    } else {
      // Register
      if (users.some(u => u.email === email)) {
        setErrorStatus('이미 등록된 동일 이메일이 존재합니다.');
        return;
      }

      const isTryingToBeAdmin = wantsToBeAdmin || email.toLowerCase().includes('admin');
      let finalRole: 'user' | 'admin' = 'user';

      if (isTryingToBeAdmin) {
        if (adminCode !== 'cheongchun7777') {
          setErrorStatus('관리자 등급으로 가입하려면 올바른 [관리자 가입 보안용 비밀 코드]를 기입하셔야 합니다.');
          return;
        }
        finalRole = 'admin';
      }

      const newUser: User = {
        id: 'u_' + Date.now(),
        name: name || '고객',
        email: email,
        phone: phone || '010-0000-0000',
        role: finalRole
      };

      saveUser(newUser);
      onAuthSuccess(newUser);
      onClose();
    }
  };

  const handleQuickDemoFill = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@cheongchun.com');
      setName('cheongchun_film 관리자');
      setPhone('010-1234-5678');
      setAuthType('login');
    } else {
      setEmail('lch200048@gmail.com');
      setName('이청춘');
      setPhone('010-8765-4321');
      setAuthType('login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#0c0a09] border border-[#292524] rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-stone-100 hover:bg-[#1a1817] rounded-full transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Head */}
        <div className="text-center space-y-2 mb-6">
          <h3 className="font-display font-black text-xl text-stone-100 uppercase tracking-widest">
            {authType === 'login' ? '로그인 (Login)' : '회원가입 (Sign Up)'}
          </h3>
          <p className="text-[11px] text-stone-400 leading-normal">
            {authType === 'login' 
              ? '가입하신 이메일로 간단히 세션을 가동하세요.' 
              : '감성 콘텐츠 대여와 실시간 관동 예약의 혜택을 다 잡으세요.'}
          </p>
        </div>

        {/* Quick Demo Assist */}
        <div className="bg-[#12100f] border border-[#292524] rounded-lg p-3.5 mb-5 text-center space-y-2">
          <p className="text-[10px] font-mono text-stone-500 font-semibold tracking-wide flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-amber-500" />
            데모 테스팅 원클릭 빠른 입력
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              type="button"
              onClick={() => handleQuickDemoFill('user')}
              className="py-1.5 bg-[#1c1917] hover:bg-amber-500/15 border border-[#2af2524] text-stone-300 hover:text-amber-400 rounded text-[10px] transition font-medium"
            >
              이청춘 유저 대입
            </button>
            <button 
              type="button"
              onClick={() => handleQuickDemoFill('admin')}
              className="py-1.5 bg-[#1c1917] hover:bg-amber-500/15 border border-[#2af2524] text-stone-300 hover:text-amber-400 rounded text-[10px] transition font-medium"
            >
              대표 관리자 대입
            </button>
          </div>
        </div>

        {errorStatus && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] p-2.5 rounded mb-4 font-medium flex items-center gap-1.5 animate-fadeIn">
            <span>⚠️ {errorStatus}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          
          {authType === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-stone-400 font-medium">실명 이름</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-600">
                    <UserIcon className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="이청춘"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded-lg pl-10 pr-4 py-2.5 text-stone-200 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-400 font-medium">연락처 번호 (연락 수단)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-600">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="010-8765-4321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#12100f] border border-[#292524] rounded-lg pl-10 pr-4 py-2.5 text-stone-200 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-stone-400 font-medium font-sans">이메일 주소</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-600">
                <Mail className="w-3.5 h-3.5" />
              </span>
              <input
                type="email"
                required
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#12100f] border border-[#292524] rounded-lg pl-10 pr-4 py-2.5 text-stone-200 focus:outline-none focus:border-amber-500 transition-colors font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-stone-400 font-medium">비밀번호</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-600">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#12100f] border border-[#292524] rounded-lg pl-10 pr-4 py-2.5 text-stone-200 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {authType === 'register' && (
            <div className="space-y-3 pt-2 pb-1 border-t border-[#1c1917] mt-3">
              <label className="flex items-center gap-2 cursor-pointer text-stone-400 hover:text-stone-200 transition">
                <input 
                  type="checkbox"
                  checked={wantsToBeAdmin}
                  onChange={(e) => setWantsToBeAdmin(e.target.checked)}
                  className="rounded border-[#292524] bg-[#12100f] text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px] font-semibold flex items-center gap-1 select-none">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  관리자 계정으로 가입 신청하기
                </span>
              </label>

              {(wantsToBeAdmin || email.toLowerCase().includes('admin')) && (
                <div className="space-y-1 pl-4.5 animate-fadeIn">
                  <label className="text-amber-400 font-bold text-[10px] uppercase tracking-wider block">
                    관리자 가입 승인 비밀 코드
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="비밀 코드 기입"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="w-full bg-[#12100f] border border-amber-500/30 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500 transition-colors placeholder:text-stone-750 font-mono text-center text-xs"
                  />
                  <span className="text-[9.5px] text-stone-500 block leading-tight">
                    * 비인가 무단 가입 방지를 위해 본사 발급 코드가 필요합니다.
                  </span>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded-lg transition-colors cursor-pointer text-xs uppercase shadow-md"
          >
            {authType === 'login' ? '로그인 완료' : '회원 동참 가입'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#1c1917] text-center text-[11px] text-stone-500">
          {authType === 'login' ? (
            <p>
              아직 cheongchun_film 계정이 없으신가요?{' '}
              <button 
                onClick={() => setAuthType('register')}
                className="text-amber-500 hover:underline font-semibold cursor-pointer"
              >
                회원가입하기
              </button>
            </p>
          ) : (
            <p>
              이미 계정이 등록되어 있으신가요?{' '}
              <button 
                onClick={() => setAuthType('login')}
                className="text-amber-500 hover:underline font-semibold cursor-pointer"
              >
                로그인하기
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
