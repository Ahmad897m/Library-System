import React from "react";
import './sidebar.css';
import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdNotificationsActive,
} from "react-icons/md";
import { FaBook, FaPlusSquare, FaExchangeAlt, FaUsers } from "react-icons/fa";
import { GiBookmarklet } from "react-icons/gi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { useTranslation } from 'react-i18next';
import { IoIosNotifications } from 'react-icons/io';
import { FaMoneyBillWave } from 'react-icons/fa';
import { Button } from "react-bootstrap";



const Sidebar = ({ onLogout }) => {
  const { t } = useTranslation();

  // تسجيل الخروج
  const handleLogout = () => {
    if (window.confirm(t("confirmLogout"))) {
      onLogout();
    }
  };

  return (
    <>
      <div className="d-flex flex-column bg-light vh-150 p-3 shadow-sm" style={{ minWidth: '300px', justifyContent: 'space-between' }}>
        <div>
          <h4 className="mb-4">{t('libraryManagement')}</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <NavLink to='/dashboard' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
                <MdDashboard /> {t('dashboard')}
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink to='/BookManagement' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
                <FaBook /> {t('booksManagement')}
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink to='/AddNewBook' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
                <FaPlusSquare /> {t('addNewBook')}
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink to='/Issue-Return' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
                <FaExchangeAlt /> {t('issueReturn')}
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink to='/ReadingRoom' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
                <GiBookmarklet /> {t('readingRoom')}
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink to='/Sales' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
                <FaMoneyBillWave /> {t('sales')}
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink to='/Customers' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
                <HiOutlineDocumentReport /> {t('customers')}
              </NavLink>
            </li>

            {/* <li className="nav-item mb-2">
              <NavLink to='/Notifications' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
                <IoIosNotifications /> {t('notifications')}
              </NavLink>
            </li> */}

            <li className="nav-item mb-2">
              <NavLink to='/Settings' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
                <FiSettings /> {t('settings')}
              </NavLink>
            </li>
          </ul>
        </div>

        {/* زر تسجيل الخروج في أسفل السايدبار */}
        <Button 
          variant="outline-danger" 
          onClick={handleLogout}
          className="logout-btn mt-3"
        >
         {t("logout")}
        </Button>
      </div>
    </>
  );
};

export default Sidebar;