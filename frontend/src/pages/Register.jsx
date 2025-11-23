import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userAPI } from '../services/api'
import './Auth.css'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    // 이미 로그인한 사용자는 앱으로 리다이렉트
    const isLoggedIn = !!localStorage.getItem('userId')
    if (isLoggedIn) {
      navigate('/app')
    }
  }, [navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await userAPI.register(formData)
      if (response.data) {
        localStorage.setItem('userId', response.data.id)
        navigate('/app')
      }
    } catch (error) {
      console.error('회원가입 실패:', error)
      const errorMessage = error.response?.data?.message || error.message || '회원가입에 실패했습니다.'
      alert(errorMessage)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-logo">SNS</h1>
        <p className="auth-subtitle">친구들의 사진과 동영상을 보려면 가입하세요.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="사용자명"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-button">가입하기</button>
        </form>
        <div className="auth-footer">
          계정이 있으신가요? <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  )
}

export default Register

