import React from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

function Landing() {
  return (
    <div className="landing">
      <div className="landing-container">
        <div className="landing-content">
          <div className="landing-left">
            <img src="/images/routined-logo.png" alt="Routined" className="landing-logo-img" />
            <p className="landing-subtitle">
              친구들과 사진과 동영상을 공유하고<br />
              새로운 사람들을 만나보세요.
            </p>
          </div>
          <div className="landing-right">
            <div className="landing-auth-box">
              <img src="/images/routined-logo.png" alt="Routined" className="landing-logo-small" />
              <p className="landing-welcome">친구들의 사진과 동영상을 보려면 로그인하세요.</p>
              <div className="landing-buttons">
                <Link to="/login" className="landing-button login">
                  로그인
                </Link>
                <Link to="/register" className="landing-button register">
                  회원가입
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing

