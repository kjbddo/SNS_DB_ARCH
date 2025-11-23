import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userAPI } from '../services/api'
import './Auth.css'
  import routinedLogo from '../../public/images/routined-logo.png'
  import rLogo from '../../public/images/r-logo.png'

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await userAPI.login(formData)
      if (response.data) {
        localStorage.setItem('userId', response.data.userId)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('username', response.data.username)
        navigate('/app')
      }
    } catch (error) {
      console.error('로그인 실패:', error)
      setError(error.response?.data?.message || '로그인에 실패했습니다. 사용자명과 비밀번호를 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* <h1 className="auth-logo">SNS</h1> */}
        <img src={routinedLogo} alt="Routined" className="auth-logo-img" />
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <input
            type="text"
            name="username"
            placeholder="사용자명"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <div className="auth-footer">
          계정이 없으신가요? <Link to="/register">가입하기</Link>
        </div>
      </div>
    </div>
  )
}

export default Login

