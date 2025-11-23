import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { postAPI } from '../services/api'
import './CreatePost.css'

function EditPost() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const currentUserId = localStorage.getItem('userId') || '1'
  const [formData, setFormData] = useState({
    caption: '',
    location: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await postAPI.getPost(postId)
      if (response.data) {
        setFormData({
          caption: response.data.caption || '',
          location: response.data.location || ''
        })
      }
    } catch (error) {
      console.error('게시물 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await postAPI.update(postId, currentUserId, formData)
      navigate(`/post/${postId}`)
    } catch (error) {
      console.error('게시물 수정 실패:', error)
      alert('게시물 수정에 실패했습니다.')
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  const handleCancel = () => {
    navigate(`/post/${postId}`)
  }

  return (
    <div className="create-post">
      <div className="create-post-container">
        <div className="create-post-header">
          <h2>게시물 수정</h2>
          <button onClick={handleCancel} className="create-post-cancel">
            취소
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-post-form">
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
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPost

