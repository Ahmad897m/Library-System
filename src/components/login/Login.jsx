import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './login.css';
import backgroundImage from '../../backgound.jpg';

const Login = ({ onLogin }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const correctPassword = useSelector(state => state.password.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      onLogin(true);
    } else {
      setError(t('incorrectPassword'));
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>{t('libraryManagement')}</h2>
          <p>{t('loginToAccess')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('enterPassword')}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          <button type="submit" className="login-button">
            🔒 {t('login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
