import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { collectionAPI } from '../services/api'
import { FaTrash, FaEdit } from 'react-icons/fa'
import './CollectionDetail.css'

function CollectionDetail() {
  const { collectionId } = useParams()
  const navigate = useNavigate()
  const currentUserId = localStorage.getItem('userId') || '1'
  const [savedPosts, setSavedPosts] = useState([])
  const [collection, setCollection] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollection()
    fetchSavedPosts()
  }, [collectionId])

  const fetchCollection = async () => {
    try {
      const response = await collectionAPI.getCollections(currentUserId)
      if (response.data) {
        const found = response.data.find(c => c.id === parseInt(collectionId))
        if (found) {
          setCollection(found)
        }
      }
    } catch (error) {
      console.error('컬렉션 로딩 실패:', error)
    }
  }

  const fetchSavedPosts = async () => {
    try {
      const response = await collectionAPI.getSavedPosts(currentUserId, parseInt(collectionId))
      if (response.data) {
        setSavedPosts(response.data)
      }
    } catch (error) {
      console.error('저장된 게시물 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemovePost = async (savedPostId) => {
    if (!window.confirm('이 게시물을 컬렉션에서 제거하시겠습니까?')) return

    try {
      await collectionAPI.removeSavedPost(savedPostId, currentUserId)
      fetchSavedPosts()
    } catch (error) {
      console.error('게시물 제거 실패:', error)
      alert('게시물 제거에 실패했습니다.')
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  if (!collection) {
    return <div className="error">컬렉션을 찾을 수 없습니다.</div>
  }

  return (
    <div className="collection-detail">
      <div className="collection-detail-container">
        <div className="collection-detail-header">
          <div className="collection-detail-info">
            {collection.coverImageUrl && (
              <img src={collection.coverImageUrl} alt={collection.name} className="collection-cover" />
            )}
            <div>
              <h2>{collection.name}</h2>
              {collection.description && <p>{collection.description}</p>}
              <span className="collection-count">{savedPosts.length}개 게시물</span>
            </div>
          </div>
          <div className="collection-detail-actions">
            <button 
              className="collection-edit-btn"
              onClick={() => {
                const name = prompt('컬렉션 이름:', collection.name)
                const desc = prompt('설명:', collection.description || '')
                if (name) {
                  collectionAPI.update(collection.id, currentUserId, {
                    name,
                    description: desc
                  }).then(() => {
                    fetchCollection()
                  })
                }
              }}
            >
              <FaEdit /> 편집
            </button>
            <button 
              className="collection-back-btn"
              onClick={() => navigate('/app/collections')}
            >
              목록으로
            </button>
          </div>
        </div>

        <div className="collection-posts-grid">
          {savedPosts.length === 0 ? (
            <div className="collection-empty">
              <p>저장된 게시물이 없습니다.</p>
            </div>
          ) : (
            savedPosts.map(saved => (
              <div key={saved.id} className="collection-post-item">
                <Link to={`/app/post/${saved.postId}`} className="collection-post-link">
                  {saved.postImageUrl && (
                    <img src={saved.postImageUrl} alt="Post" />
                  )}
                </Link>
                <button 
                  className="collection-post-remove"
                  onClick={() => handleRemovePost(saved.id)}
                  title="제거"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default CollectionDetail

