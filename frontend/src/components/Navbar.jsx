import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaHome, FaSearch, FaPlusSquare, FaHeart, FaUser, FaCircle, FaBookmark, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaSave } from 'react-icons/fa'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUserId = localStorage.getItem('userId')
  const isLoggedIn = !!currentUserId
  const isLandingPage = location.pathname === '/'

  const handleLogout = () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      localStorage.removeItem('userId')
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      navigate('/login')
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isLoggedIn ? "/app" : "/"} className="navbar-logo">
          {isLandingPage ? (
            <img src="/images/routined-logo.png" alt="Routined" className="navbar-logo-img" />
          ) : (
            <img src="/images/r-logo.png" alt="R" className="navbar-logo-img" />
          )}
        </Link>
        
        {isLoggedIn && (
          <div className="navbar-search">
            <input 
              type="text" 
              placeholder="검색" 
              onFocus={() => navigate('/app/search')}
            />
          </div>
        )}

        <div className="navbar-icons">
          {isLoggedIn ? (
            <>
              <Link to="/app" className="navbar-icon" title="홈">
                <FaHome size={24} />
              </Link>
              <Link to="/app/post/create" className="navbar-icon" title="게시물 작성">
                <FaPlusSquare size={24} />
              </Link>
              <Link to="/app/story" className="navbar-icon" title="스토리">
                <FaCircle size={24} />
              </Link>
              <Link to="/app/notifications" className="navbar-icon" title="알림">
                <FaHeart size={24} />
              </Link>
              <Link to="/app/collections" className="navbar-icon" title="컬렉션">
                <FaBookmark size={24} />
              </Link>
              <Link to="/app/collections" className="navbar-icon" title="저장">
                <FaSave size={24} />
              </Link>
              <Link to={`/app/profile/${currentUserId}`} className="navbar-icon" title="프로필">
                <FaUser size={24} />
              </Link>
              <button onClick={handleLogout} className="navbar-icon logout-btn" title="로그아웃">
                <FaSignOutAlt size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-button login">
                <FaSignInAlt /> 로그인
              </Link>
              <Link to="/register" className="navbar-button register">
                <FaUserPlus /> 회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

