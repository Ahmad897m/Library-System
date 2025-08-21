import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t, i18n } = useTranslation();

  // dummy state فقط لإجبار إعادة الرندر
  const [, setRerender] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';

    i18n.changeLanguage(newLang).then(() => {
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('appLanguage', newLang);
      // إجبار إعادة الرندر بتغيير الحالة dummy
      setRerender(prev => !prev);
    });
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage') || 'en';

    i18n.changeLanguage(savedLang).then(() => {
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      setRerender(prev => !prev); // إجبار إعادة الرندر عند تحميل المكون
    });
  }, [i18n]);

  return (
    <>
    <div className='container mt-4'>
      <h2>{t('setting.settings')}</h2>
      <button className='changeBtn' onClick={toggleLanguage}>{t('setting.switchLanguage')} </button>
    </div>
    </>
  );
};

export default Settings;
