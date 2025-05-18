import React from "react";
import './sidebar.css'
import {NavLink} from 'react-router-dom';
import {
  MdDashboard,
  MdNotificationsActive,
} from "react-icons/md";
import { FaBook, FaPlusSquare, FaExchangeAlt } from "react-icons/fa";
import { GiBookmarklet } from "react-icons/gi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FiSettings, FiLogOut } from "react-icons/fi";

const Sidebar = () => {

    return(
        <>
            <div className="d-flex flex-column bg-light vh-100 p-3 shadow-sm " style={{minWidth:'300p'}}>
                <h4 className="mb-4">Library Management </h4>
                <ul className="nav flex-column">
                    <li className="nav-item mb-2"> 
                        <NavLink to='/Dashboard'  className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link '}> <MdDashboard /> Dashboard</NavLink> 
                    </li>

                     <li className="nav-item mb-2">
                         <NavLink to='/BookManagement'  className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm'  : 'nav-link'}> <FaBook /> Books Management</NavLink> 
                        </li>

                     <li className="nav-item mb-2">
                         <NavLink to='/AddNewBook' className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}> <FaPlusSquare /> Add New Book</NavLink> 
                        </li>

                     <li className="nav-item mb-2">
                         <NavLink to='/Issue-Return'  className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}> <FaExchangeAlt /> Issue / Return</NavLink> 
                        </li>

                     <li className="nav-item mb-2">
                         <NavLink to='/Categories'  className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}> <GiBookmarklet /> Categories</NavLink>
                        </li>

                     <li className="nav-item mb-2">
                         <NavLink to='/Notifications'  className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}> <MdNotificationsActive /> Notifications</NavLink> 
                        </li>

                     <li className="nav-item mb-2">
                         <NavLink to='/Report'  className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}> <HiOutlineDocumentReport /> Reports</NavLink> 
                        </li>

                     <li className="nav-item mb-2">
                         <NavLink to='/Settings'  className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}> <FiSettings /> Settings</NavLink> 
                        </li>

                     <li className="nav-item mb-2">
                         <NavLink to=')'  className={({ isActive }) => isActive ? 'nav-link active text-dark shadow-sm' : 'nav-link'}> <FiLogOut /> Logout</NavLink> 
                        </li>
                </ul>
            </div>
        </>
    )

}


export default Sidebar;