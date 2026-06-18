import React from 'react';
import { signInWithGoogle } from '../services/auth';

export const Login: React.FC = () => {
  return (
    <div className="login-container" style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>내 물건 관리 시작하기</h2>
      <p>기기 간 동기화를 위해 로그인이 필요합니다.</p>
      <button 
        onClick={signInWithGoogle} 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#4285F4', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Google로 로그인
      </button>
    </div>
  );
};
