import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <span className="heart-icon">♥</span> 生日快乐
      </div>
      <div className={`menu-toggle ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <div className="hamburger"></div>
      </div>
      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li>
          <NavLink to="/welcome" onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}>
            <i className="fas fa-home"></i> 首页
          </NavLink>
        </li>
        <li>
          <NavLink to="/gallery" onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}>
            <i className="fas fa-images"></i> 照片墙
          </NavLink>
        </li>
        <li>
          <NavLink to="/memories" onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}>
            <i className="fas fa-heart"></i> 回忆墙
          </NavLink>
        </li>
        <li>
          <NavLink to="/wishes" onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}>
            <i className="fas fa-birthday-cake"></i> 咪咪祝福
          </NavLink>
        </li>
        <li>
          <NavLink to="/game" onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}>
            <i className="fas fa-gamepad"></i> 爱心寻宝
          </NavLink>
        </li>
        <li>
          <NavLink to="/timecapsule" onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}>
            <i className="fas fa-hourglass-half"></i> 时间情书
          </NavLink>
        </li>
        <li>
          <NavLink to="/wishingstar" onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}>
            <i className="fas fa-star"></i> 许个愿吧
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
