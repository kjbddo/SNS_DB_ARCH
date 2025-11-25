import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postAPI, fileAPI } from '../services/api'
import { FaTimes } from 'react-icons/fa'
import './CreatePost.css'

function CreatePost() {
  const [formData, setFormData] = useState({
    caption: '',
    location: '',
    images: [],
    videos: []
  })
  const [imagePreviews, setImagePreviews] = useState([])
  const [videoPreviews, setVideoPreviews] = useState([])
  const [uploading, setUploading] = useState(false)
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
    setImagePreviews([...imagePreviews, ...previews])
    setFormData({
      ...formData,
      images: [...formData.images, ...files]
    })
  }

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map(file => URL.createObjectURL(file))
    setVideoPreviews([...videoPreviews, ...previews])
    setFormData({
      ...formData,
      videos: [...formData.videos, ...files]
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.images.length === 0 && formData.videos.length === 0) {
      alert('이미지 또는 동영상을 최소 1개 이상 선택해주세요.')
      return
    }

    setUploading(true)
    try {
      // 이미지 업로드
      const imageUrls = []
      if (formData.images.length > 0) {
        const imageResponse = await fileAPI.uploadPostImages(formData.images)
        const urls = imageResponse && imageResponse.data ? imageResponse.data.urls : imageResponse.urls
        imageUrls.push(...urls)
      }

      // 동영상 업로드
      const videoUrls = []
      if (formData.videos.length > 0) {
        for (const video of formData.videos) {
          const videoResponse = await fileAPI.uploadPostVideo(video)
          const url = videoResponse && videoResponse.data ? videoResponse.data.url : videoResponse.url
          videoUrls.push(url)
        }
      }

      const submitData = {
        userId: currentUserId,
        caption: formData.caption,
        location: formData.location,
        imageUrls: imageUrls,
        videoUrls: videoUrls
      }
      
      const response = await postAPI.create(submitData)
      const postData = response && response.data ? response.data : response
      if (postData && postData.id) {
        navigate(`/post/${postData.id}`)
      } else {
        navigate('/app')
      }
    } catch (error) {
      console.error('게시물 작성 실패:', error)
      alert('게시물 작성에 실패했습니다.')
    } finally {
      setUploading(false)
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
            <div className="media-upload-container">
              <label htmlFor="images" className="image-upload-label">
                {imagePreviews.length > 0 || videoPreviews.length > 0 ? (
                  <div className="media-preview">
                    {imagePreviews.map((preview, index) => (
                      <div key={`img-${index}`} className="media-preview-item">
                        <img src={preview} alt={`Preview ${index}`} />
                        <button
                          type="button"
                          className="media-remove-btn"
                          onClick={() => {
                            const newPreviews = imagePreviews.filter((_, i) => i !== index)
                            setImagePreviews(newPreviews)
                            const newFiles = formData.images.filter((_, i) => i !== index)
                            setFormData({ ...formData, images: newFiles })
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    {videoPreviews.map((preview, index) => (
                      <div key={`vid-${index}`} className="media-preview-item">
                        <video src={preview} controls />
                        <button
                          type="button"
                          className="media-remove-btn"
                          onClick={() => {
                            const newPreviews = videoPreviews.filter((_, i) => i !== index)
                            setVideoPreviews(newPreviews)
                            const newFiles = formData.videos.filter((_, i) => i !== index)
                            setFormData({ ...formData, videos: newFiles })
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="image-upload-placeholder">
                    <span>사진 또는 동영상 선택</span>
                  </div>
                )}
              </label>
              <div className="file-input-buttons">
                <label htmlFor="images" className="file-input-label">
                  이미지 추가
                </label>
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
                <label htmlFor="videos" className="file-input-label">
                  동영상 추가
                </label>
                <input
                  type="file"
                  id="videos"
                  accept="video/*"
                  multiple
                  onChange={handleVideoChange}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </div>
            </div>
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
            <button type="submit" className="create-post-submit" disabled={uploading}>
              {uploading ? '업로드 중...' : '공유하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost

