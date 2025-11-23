import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { hashtagAPI, userAPI } from '../services/api'
import PostCard from '../components/PostCard'
import './Search.css'

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeTab, setActiveTab] = useState('hashtag') // 'hashtag' or 'user'
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const currentUserId = localStorage.getItem('userId') || '1'

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      if (activeTab === 'hashtag') {
        const response = await hashtagAPI.search(query)
        if (response.data) {
          setPosts(response.data)
          setUsers([])
        }
      } else {
        const response = await userAPI.searchUsers(query)
        if (response.data) {
          setUsers(response.data)
          setPosts([])
        }
      }
      setSearchParams({ q: query })
    } catch (error) {
      console.error('검색 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search">
      <div className="search-container">
        <h2>검색</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder={activeTab === 'hashtag' ? '해시태그 검색...' : '사용자 검색...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">검색</button>
        </form>

        <div className="search-tabs">
          <button
            className={activeTab === 'hashtag' ? 'active' : ''}
            onClick={() => {
              setActiveTab('hashtag')
              setPosts([])
              setUsers([])
            }}
          >
            해시태그
          </button>
          <button
            className={activeTab === 'user' ? 'active' : ''}
            onClick={() => {
              setActiveTab('user')
              setPosts([])
              setUsers([])
            }}
          >
            사용자
          </button>
        </div>

        {loading ? (
          <div className="loading">검색 중...</div>
        ) : activeTab === 'hashtag' ? (
          posts.length > 0 ? (
            <div className="search-results">
              <h3>검색 결과</h3>
              <div className="search-posts">
                {posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            </div>
          ) : query ? (
            <div className="search-empty">
              <p>검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="search-empty">
              <p>해시태그를 검색해보세요.</p>
            </div>
          )
        ) : (
          users.length > 0 ? (
            <div className="search-results">
              <h3>검색 결과</h3>
              <div className="search-users">
                {users.map(user => (
                  <Link key={user.id} to={`/app/profile/${user.id}`} className="search-user-item">
                    <img
                      src={user.profileImageUrl || '/default-avatar.png'}
                      alt={user.username}
                      className="search-user-avatar"
                    />
                    <div className="search-user-info">
                      <div className="search-user-username">{user.username}</div>
                      {user.name && <div className="search-user-name">{user.name}</div>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : query ? (
            <div className="search-empty">
              <p>검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="search-empty">
              <p>사용자를 검색해보세요.</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Search

