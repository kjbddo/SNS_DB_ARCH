import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userAPI, fileAPI } from '../services/api'
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
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile(currentUserId)
      // API 인터셉터가 response.data를 반환하므로, response가 이미 ApiResponse의 data 필드
      const userData = response && response.data ? response.data : response
      if (userData) {
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          name: userData.name || '',
          bio: userData.bio || '',
          profileImageUrl: userData.profileImageUrl || '',
          isPrivate: userData.isPrivate || false
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

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    setUploading(true)
    try {
      const response = await fileAPI.uploadProfileImage(file)
      const imageUrl = response && response.data ? response.data.url : response.url
      setFormData({
        ...formData,
        profileImageUrl: imageUrl
      })
      alert('프로필 이미지가 업로드되었습니다.')
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // username과 email은 백엔드에서 수정 불가하므로 제외
      const updateData = {
        name: formData.name,
        bio: formData.bio,
        profileImageUrl: formData.profileImageUrl,
        isPrivate: formData.isPrivate
      }
      await userAPI.updateProfile(currentUserId, updateData)
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
              <label htmlFor="profileImageFile" className="settings-file-upload-btn">
                {uploading ? '업로드 중...' : '파일 선택'}
              </label>
              <input
                type="file"
                id="profileImageFile"
                accept="image/*"
                onChange={handleImageFileChange}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </div>
          </div>

          <div className="settings-section">
            <label>사용자명</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              disabled
              className="settings-disabled"
            />
            <small className="settings-hint">사용자명은 변경할 수 없습니다.</small>
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
              disabled
              className="settings-disabled"
            />
            <small className="settings-hint">이메일은 변경할 수 없습니다.</small>
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

