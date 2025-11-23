import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postAPI } from '../services/api'
import { FaTimes } from 'react-icons/fa'
import './CreatePost.css'

function CreatePost() {
  const [formData, setFormData] = useState({
    caption: '',
    location: '',
    images: []
  })
  const [imagePreviews, setImagePreviews] = useState([])
  const navigate = useNavigate()
  const currentUserId = localStorage.getItem('userId') || '1'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
    setFormData({
      ...formData,
      images: files
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = {
        userId: currentUserId,
        caption: formData.caption,
        location: formData.location,
        imageUrls: imagePreviews // 실제로는 업로드 후 URL을 받아야 함
      }
      const response = await postAPI.create(submitData)
      if (response.data) {
        navigate(`/post/${response.data.id}`)
      }
    } catch (error) {
      console.error('게시물 작성 실패:', error)
      alert('게시물 작성에 실패했습니다.')
    }
  }

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까?')) {
      navigate('/app')
    }
  }

  return (
    <div className="create-post">
      <div className="create-post-container">
        <div className="create-post-header">
          <h2>새 게시물 만들기</h2>
          <button onClick={handleCancel} className="create-post-cancel">
            취소
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="create-post-image-section">
            <label htmlFor="images" className="image-upload-label">
              {imagePreviews.length > 0 ? (
                <div className="image-preview">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Preview ${index}`} />
                      <button
                        type="button"
                        className="image-remove-btn"
                        onClick={() => {
                          const newPreviews = imagePreviews.filter((_, i) => i !== index)
                          setImagePreviews(newPreviews)
                          const newFiles = Array.from(formData.images).filter((_, i) => i !== index)
                          setFormData({ ...formData, images: newFiles })
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="image-upload-placeholder">
                  <span>사진 선택</span>
                </div>
              )}
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="create-post-form-section">
            <textarea
              name="caption"
              placeholder="문구 입력..."
              value={formData.caption}
              onChange={handleChange}
              rows="5"
            />
            <input
              type="text"
              name="location"
              placeholder="위치 추가"
              value={formData.location}
              onChange={handleChange}
            />
            <button type="submit" className="create-post-submit">
              공유하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost

