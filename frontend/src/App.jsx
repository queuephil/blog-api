import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000' // Replace with your backend URL

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '') // Store JWT
  const [posts, setPosts] = useState([]) // Store posts from the API
  const [error, setError] = useState('') // Store error messages
  const [newPostText, setNewPostText] = useState('') // Store new post text
  const [editPostId, setEditPostId] = useState(null) // Store post ID being edited
  const [editPostText, setEditPostText] = useState('') // Store edited post text

  // Login function
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      })
      const { token } = response.data
      localStorage.setItem('token', token) // Save token
      setToken(token) // Update state
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token') // Remove token from localStorage
    setToken('') // Clear token from state
  }

  // Fetch posts (GET)
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`)
      setPosts(Object.values(response.data)) // Update state with posts
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch posts')
    }
  }

  // Create a post (POST)
  const handleCreatePost = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/posts`,
        { text: newPostText },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNewPostText('') // Clear input
      fetchPosts()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post')
    }
  }

  // Update a post (PUT)
  const handleUpdatePost = async (postId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/posts/${postId}`,
        { text: editPostText },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setEditPostId(null) // Clear edit mode
      setEditPostText('') // Clear input
      fetchPosts()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update post')
    }
  }

  // Delete a post (DELETE)
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchPosts()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete post')
    }
  }

  // Automatically fetch posts when the component mounts
  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <>
      <h1>Blog API</h1>

      {/* Posts */}
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              {editPostId === post.id ? (
                <div className="edit">
                  <input
                    type="text"
                    value={editPostText}
                    placeholder="Update post text"
                    onChange={(e) => setEditPostText(e.target.value)}
                  />
                  <div>
                    <button
                      onClick={() => handleUpdatePost(post.id)}
                      className="material-symbols-outlined"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditPostId(null)}
                      className="material-symbols-outlined"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="show">
                  <h3>{post.text}</h3>
                  {token && (
                    <div>
                      <button
                        onClick={() => setEditPostId(post.id)}
                        className="material-symbols-outlined"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="material-symbols-outlined"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}

      {token && (
        <div className="create">
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Enter post text"
          />
          <button
            onClick={handleCreatePost}
            className="material-symbols-outlined"
          >
            add_circle
          </button>
        </div>
      )}

      {/* Authentication */}
      <div className="auth">
        {!token ? (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} className="material-symbols-outlined">
              Login
            </button>
          </>
        ) : (
          <>
            <p>(Admin logged in)</p>
            <button
              onClick={handleLogout}
              className="material-symbols-outlined"
            >
              Logout
            </button>
          </>
        )}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  )
}

export default App
