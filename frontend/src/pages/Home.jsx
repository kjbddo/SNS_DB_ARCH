import React, { useState, useEffect } from 'react'
import { postAPI } from '../services/api'
import PostCard from '../components/PostCard'
import './Home.css'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const currentUserId = localStorage.getItem('userId') || '1'

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      // 팔로우한 사용자들의 게시물 가져오기
      const response = await postAPI.getFeedPosts(currentUserId)
      if (response.data) {
        setPosts(response.data)
      }
    } catch (error) {
      console.error('게시물 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  return (
    <div className="home">
      <div className="feed">
        {posts.length === 0 ? (
          <div className="empty-feed">
            <p>게시물이 없습니다.</p>
            <p>팔로우한 사용자의 게시물이 여기에 표시됩니다.</p>
            <button onClick={fetchPosts} className="refresh-btn">
              새로고침
            </button>
          </div>
        ) : (
          <>
            <div className="feed-header">
              <h2>피드</h2>
              <button onClick={fetchPosts} className="refresh-btn">
                새로고침
              </button>
            </div>
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUserId={currentUserId}
                onUpdate={fetchPosts}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Home

