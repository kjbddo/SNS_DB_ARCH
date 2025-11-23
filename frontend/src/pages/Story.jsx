import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { storyAPI } from '../services/api'
import { FaPlus, FaTimes } from 'react-icons/fa'
import './Story.css'

function Story() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const currentUserId = localStorage.getItem('userId') || '1'

  const formatTimeAgo = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return '방금 전'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`
    
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await storyAPI.getStories(currentUserId)
      if (response.data) {
        setStories(response.data)
      }
    } catch (error) {
      console.error('스토리 로딩 실패:', error)
    }
  }

  const handleViewStory = async (storyId) => {
    try {
      await storyAPI.viewStory(storyId, currentUserId)
    } catch (error) {
      console.error('스토리 조회 기록 실패:', error)
    }
  }

  if (stories.length === 0) {
    return (
      <div className="story-empty">
        <p>스토리가 없습니다.</p>
        <Link to="/app/story/create" className="story-create-btn">
          <FaPlus /> 스토리 만들기
        </Link>
      </div>
    )
  }

  const currentStory = stories[currentStoryIndex]

  return (
    <div className="story">
      <div className="story-container">
        {currentStory && (
          <>
            <div className="story-header">
              <img 
                src={currentStory.profileImageUrl || '/default-avatar.png'} 
                alt={currentStory.username}
                className="story-avatar"
              />
              <div className="story-header-info">
                <span className="story-username">{currentStory.username}</span>
                {currentStory.createdAt && (
                  <span className="story-time">{formatTimeAgo(currentStory.createdAt)}</span>
                )}
              </div>
              <button 
                className="story-close-btn"
                onClick={() => navigate('/app')}
                title="닫기"
              >
                <FaTimes />
              </button>
            </div>
            <div className="story-content">
              {currentStory.imageUrl && (
                <img src={currentStory.imageUrl} alt="Story" />
              )}
              {currentStory.videoUrl && (
                <video src={currentStory.videoUrl} controls />
              )}
              {currentStory.text && (
                <div className="story-text">{currentStory.text}</div>
              )}
            </div>
            <div className="story-navigation">
              <button 
                onClick={() => setCurrentStoryIndex(prev => Math.max(0, prev - 1))}
                disabled={currentStoryIndex === 0}
              >
                이전
              </button>
              <button 
                onClick={() => {
                  handleViewStory(currentStory.id)
                  setCurrentStoryIndex(prev => Math.min(stories.length - 1, prev + 1))
                }}
                disabled={currentStoryIndex === stories.length - 1}
              >
                다음
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Story

