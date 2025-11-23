import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAPI } from '../services/api'
import './Settings.css'

function Settings() {
  const navigate = useNavigate()
  const currentUserId = localStorage.getItem('userId') || '1'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    bio: '',
    profileImageUrl: '',
    isPrivate: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile(currentUserId)
      if (response.data) {
        setFormData({
          username: response.data.username || '',
          email: response.data.email || '',
          name: response.data.name || '',
          bio: response.data.bio || '',
          profileImageUrl: response.data.profileImageUrl || '',
          isPrivate: response.data.isPrivate || false
        })
      }
    } catch (error) {
      console.error('프로필 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await userAPI.updateProfile(currentUserId, formData)
      alert('프로필이 업데이트되었습니다.')
      navigate(`/profile/${currentUserId}`)
    } catch (error) {
      console.error('프로필 업데이트 실패:', error)
      alert('프로필 업데이트에 실패했습니다.')
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  return (
    <div className="settings">
      <div className="settings-container">
        <h2>프로필 편집</h2>
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-section">
            <label>프로필 사진</label>
            <div className="settings-profile-image">
              <img
                src={formData.profileImageUrl || '/default-avatar.png'}
                alt="Profile"
              />
              <input
                type="text"
                name="profileImageUrl"
                placeholder="이미지 URL"
                value={formData.profileImageUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="settings-section">
            <label>사용자명</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="settings-section">
            <label>이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="settings-section">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="settings-section">
            <label>소개</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              maxLength={500}
            />
          </div>

          <div className="settings-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
              />
              비공개 계정
            </label>
          </div>

          <button type="submit" className="settings-submit">
            제출
          </button>
        </form>

        <div className="settings-section-divider"></div>

        <div className="settings-other">
          <h3>기타</h3>
          <Link to="/app/reports" className="settings-link">
            내 신고 내역
          </Link>
          <button 
            className="settings-link logout"
            onClick={() => {
              if (window.confirm('로그아웃하시겠습니까?')) {
                localStorage.removeItem('userId')
                localStorage.removeItem('token')
                window.location.href = '/login'
              }
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings

