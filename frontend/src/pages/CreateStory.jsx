import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { storyAPI } from '../services/api'
import './CreateStory.css'

function CreateStory() {
  const navigate = useNavigate()
  const currentUserId = localStorage.getItem('userId') || '1'
  const [formData, setFormData] = useState({
    imageUrl: '',
    videoUrl: '',
    text: ''
  })
  const [imagePreview, setImagePreview] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    if (name === 'imageUrl') {
      setImagePreview(value)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData({
          ...formData,
          imageUrl: reader.result // 실제로는 서버에 업로드 후 URL 받아야 함
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.imageUrl && !formData.videoUrl && !formData.text) {
      alert('이미지, 동영상 또는 텍스트 중 하나는 입력해야 합니다.')
      return
    }

    try {
      const submitData = {
        userId: currentUserId,
        ...formData
      }
      const response = await storyAPI.create(submitData)
      if (response.data) {
        navigate('/app/story')
      }
    } catch (error) {
      console.error('스토리 생성 실패:', error)
      alert('스토리 생성에 실패했습니다.')
    }
  }

  return (
    <div className="create-story">
      <div className="create-story-container">
        <h2>스토리 만들기</h2>
        <form onSubmit={handleSubmit} className="create-story-form">
          <div className="create-story-image-section">
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            ) : (
              <label htmlFor="imageFile" className="image-upload-label">
                <div className="image-upload-placeholder">
                  <span>사진 선택</span>
                </div>
              </label>
            )}
            <input
              type="file"
              id="imageFile"
              accept="image/*,video/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="create-story-form-section">
            <input
              type="text"
              name="imageUrl"
              placeholder="이미지 URL (또는 파일 선택)"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            <input
              type="text"
              name="videoUrl"
              placeholder="동영상 URL"
              value={formData.videoUrl}
              onChange={handleChange}
            />
            <textarea
              name="text"
              placeholder="텍스트 입력..."
              value={formData.text}
              onChange={handleChange}
              rows="4"
            />
            <button type="submit" className="create-story-submit">
              스토리 공유
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateStory

