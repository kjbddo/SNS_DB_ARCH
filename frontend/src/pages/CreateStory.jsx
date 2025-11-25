import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { storyAPI, fileAPI } from '../services/api'
import { FaTimes } from 'react-icons/fa'
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
  const [videoPreview, setVideoPreview] = useState('')
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const [selectedVideoFile, setSelectedVideoFile] = useState(null)
  const [uploading, setUploading] = useState(false)

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

  const handleImageFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    setSelectedImageFile(file)
    setSelectedVideoFile(null)
    setVideoPreview('')
    formData.videoUrl = ''
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      alert('동영상 파일만 업로드 가능합니다.')
      return
    }

    setSelectedVideoFile(file)
    setSelectedImageFile(null)
    setImagePreview('')
    formData.imageUrl = ''
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setVideoPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedImageFile && !selectedVideoFile && !formData.text) {
      alert('이미지, 동영상 또는 텍스트 중 하나는 입력해야 합니다.')
      return
    }

    setUploading(true)
    try {
      let imageUrl = formData.imageUrl
      let videoUrl = formData.videoUrl

      // 이미지 파일 업로드
      if (selectedImageFile) {
        const response = await fileAPI.uploadStoryImage(selectedImageFile)
        imageUrl = response && response.data ? response.data.url : response.url
      }

      // 동영상 파일 업로드
      if (selectedVideoFile) {
        const response = await fileAPI.uploadStoryVideo(selectedVideoFile)
        videoUrl = response && response.data ? response.data.url : response.url
      }

      const submitData = {
        userId: currentUserId,
        imageUrl: imageUrl,
        videoUrl: videoUrl,
        text: formData.text
      }
      
      const response = await storyAPI.create(submitData)
      const storyData = response && response.data ? response.data : response
      if (storyData) {
        navigate('/app/story')
      }
    } catch (error) {
      console.error('스토리 생성 실패:', error)
      alert('스토리 생성에 실패했습니다.')
    } finally {
      setUploading(false)
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
                <button
                  type="button"
                  className="media-remove-btn"
                  onClick={() => {
                    setImagePreview('')
                    setSelectedImageFile(null)
                    setFormData({ ...formData, imageUrl: '' })
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            ) : videoPreview ? (
              <div className="video-preview">
                <video src={videoPreview} controls />
                <button
                  type="button"
                  className="media-remove-btn"
                  onClick={() => {
                    setVideoPreview('')
                    setSelectedVideoFile(null)
                    setFormData({ ...formData, videoUrl: '' })
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="file-upload-buttons">
                <label htmlFor="imageFile" className="file-upload-label">
                  이미지 선택
                </label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
                <label htmlFor="videoFile" className="file-upload-label">
                  동영상 선택
                </label>
                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </div>
            )}
          </div>

          <div className="create-story-form-section">
            <textarea
              name="text"
              placeholder="텍스트 입력..."
              value={formData.text}
              onChange={handleChange}
              rows="4"
            />
            <button type="submit" className="create-story-submit" disabled={uploading}>
              {uploading ? '업로드 중...' : '스토리 공유'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateStory

