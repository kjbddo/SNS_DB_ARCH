import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collectionAPI } from '../services/api'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import './Collections.css'

function Collections() {
  const navigate = useNavigate()
  const currentUserId = localStorage.getItem('userId') || '1'
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionDesc, setNewCollectionDesc] = useState('')

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await collectionAPI.getCollections(currentUserId)
      if (response.data) {
        setCollections(response.data)
      }
    } catch (error) {
      console.error('컬렉션 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCollection = async (e) => {
    e.preventDefault()
    if (!newCollectionName.trim()) return

    try {
      await collectionAPI.create({
        userId: currentUserId,
        name: newCollectionName,
        description: newCollectionDesc
      })
      setNewCollectionName('')
      setNewCollectionDesc('')
      setShowCreateModal(false)
      fetchCollections()
    } catch (error) {
      console.error('컬렉션 생성 실패:', error)
      alert('컬렉션 생성에 실패했습니다.')
    }
  }

  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm('컬렉션을 삭제하시겠습니까?')) return

    try {
      await collectionAPI.delete(collectionId, currentUserId)
      fetchCollections()
    } catch (error) {
      console.error('컬렉션 삭제 실패:', error)
      alert('컬렉션 삭제에 실패했습니다.')
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  return (
    <div className="collections">
      <div className="collections-container">
        <div className="collections-header">
          <h2>저장 컬렉션</h2>
          <button 
            className="collections-create-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus /> 새 컬렉션
          </button>
        </div>

        {collections.length === 0 ? (
          <div className="collections-empty">
            <p>컬렉션이 없습니다.</p>
            <p>게시물을 저장할 컬렉션을 만들어보세요.</p>
          </div>
        ) : (
          <div className="collections-grid">
            {collections.map(collection => (
              <div key={collection.id} className="collection-item">
                <Link to={`/collection/${collection.id}`} className="collection-link">
                  {collection.coverImageUrl ? (
                    <img src={collection.coverImageUrl} alt={collection.name} />
                  ) : (
                    <div className="collection-placeholder">
                      <FaPlus size={32} />
                    </div>
                  )}
                  <div className="collection-info">
                    <h3>{collection.name}</h3>
                    {collection.description && (
                      <p>{collection.description}</p>
                    )}
                    <span className="collection-count">
                      {collection.postCount || 0}개 게시물
                    </span>
                  </div>
                </Link>
                <div className="collection-actions">
                  <button 
                    className="collection-action-btn"
                    onClick={() => {
                      const name = prompt('컬렉션 이름:', collection.name)
                      const desc = prompt('설명:', collection.description || '')
                      if (name) {
                        collectionAPI.update(collection.id, currentUserId, {
                          name,
                          description: desc
                        }).then(() => fetchCollections())
                      }
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="collection-action-btn delete"
                    onClick={() => handleDeleteCollection(collection.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>새 컬렉션 만들기</h3>
            <form onSubmit={handleCreateCollection}>
              <input
                type="text"
                placeholder="컬렉션 이름"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                required
              />
              <textarea
                placeholder="설명 (선택사항)"
                value={newCollectionDesc}
                onChange={(e) => setNewCollectionDesc(e.target.value)}
                rows="3"
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  취소
                </button>
                <button type="submit">만들기</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Collections

