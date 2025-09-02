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



const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="d-flex flex-column bg-light vh-150 p-3 shadow-sm" style={{ minWidth: '300px' }}>
        <h4 className="mb-4">{t('sidebar.libraryManagement')}</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <NavLink to='/' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
              <MdDashboard /> {t('sidebar.dashboard')}
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to='/BookManagement' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
              <FaBook /> {t('sidebar.booksManagement')}
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to='/AddNewBook' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
              <FaPlusSquare /> {t('sidebar.addNewBook')}
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to='/AddNewCustomer' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
              <FaUsers /> {t('sidebar.addNewCustomer')}
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to='/Issue-Return' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
              <FaExchangeAlt /> {t('sidebar.issueReturn')}
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to='/ReadingRoom' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
              <GiBookmarklet /> {t('sidebar.readingRoom')}
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to='/Sales' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
              <FaMoneyBillWave /> {t('sidebar.sales')}
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to='/Customers' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
              <HiOutlineDocumentReport /> {t('sidebar.customers')}
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to='/Notifications' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
              <IoIosNotifications /> {t('sidebar.notifications')}
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to='/Settings' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}>
              <FiSettings /> {t('sidebar.settings')}
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
