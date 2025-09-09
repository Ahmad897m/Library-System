import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../redux/slices/passwordSlice";
import './setttings.css'

const Settings = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentPassword = useSelector((state) => state.password.value);

  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const [, setRerender] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang).then(() => {
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
      localStorage.setItem("appLanguage", newLang);
      setRerender((prev) => !prev);
    });
  };

  const handleChangePassword = () => {
    if (oldPassword !== currentPassword) {
      setMessage(t("errorOldPassword"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage(t("errorMismatch"));
      return;
    }
    if (!newPassword) {
      setMessage(t("errorEmptyNewPassword"));
      return;
    }

    dispatch(changePassword(newPassword));
    setMessage(t("successPasswordChange"));
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      setMessage("");
      setShowModal(false);
    }, 2000);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage") || "en";
    i18n.changeLanguage(savedLang).then(() => {
      document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
      setRerender((prev) => !prev);
    });
  }, [i18n]);

  return (
    <div className="container mt-4">
      <h2>⚙️ {t("settings")}</h2>
      <div className="button" style={{marginTop: "20px"}}>
        <>
      <button className="changeBtn btn" onClick={toggleLanguage}>
        {t("switchLanguage")}
      </button>
    </>
      <div className="mt-3">
        <button className="btn" style={{background: "chocolate", color: "white"}}  onClick={() => setShowModal(true)}>
          {t("changePassword")}
        </button>
      </div>
      </div>
      {/* <div>

      <button className="changeBtn" onClick={toggleDarkMode}>
  {darkMode ? t("lightMode") : t("darkMode")}
</button>
      </div> */}


      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>{t("changePassword")}</h4>
            <input
              type="password"
              placeholder={t("oldPassword")}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder={t("newPassword")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder={t("confirmNewPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {message && <p>{message}</p>}
            <div className="modal-actions">
              <button onClick={handleChangePassword}>{t("save")}</button>
              <button 
                onClick={() => {
              setOldPassword("");
              setNewPassword("");
              setConfirmPassword("");
              setMessage("");
              setShowModal(false);
                }}>
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
