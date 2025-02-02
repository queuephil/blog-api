import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000' // Replace with your backend URL

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '') // Store JWT
  const [posts, setPosts] = useState([]) // Store posts from the API
  const [error, setError] = useState('') // Store error messages
  const [newPostText, setNewPostText] = useState('') // Store new post text
  const [editPostId, setEditPostId] = useState(null) // Store post ID being edited
  const [editPostText, setEditPostText] = useState('') // Store edited post text

  // Login function
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`)
      const { token } = response.data
      localStorage.setItem('token', token) // Save token to localStorage
      setToken(token) // Update state
      setError('')
    } catch (err) {
      setError('Login failed')
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
      setError('Failed to fetch posts')
    }
  }

  // Create a post (POST)
  const handleCreatePost = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts`,
        { text: newPostText },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT in the request
          },
        }
      )
      setNewPostText('') // Clear input
      fetchPosts() // Refresh posts
    } catch (err) {
      setError('Failed to create post')
    }
  }

  // Update a post (PUT)
  const handleUpdatePost = async (postId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/posts/${postId}`,
        { text: editPostText },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT in the request
          },
        }
      )
      setEditPostId(null) // Clear edit mode
      setEditPostText('') // Clear input
      fetchPosts() // Refresh posts
    } catch (err) {
      setError('Failed to update post')
    }
  }

  // Delete a post (DELETE)
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT in the request
        },
      })
      fetchPosts() // Refresh posts
    } catch (err) {
      setError('Failed to delete post')
    }
  }

  // Automatically fetch posts when the component mounts
  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className="App">
      <h1>My Frontend App</h1>

      {!token ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Posts</h2>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              {editPostId === post.id ? (
                <>
                  <input
                    type="text"
                    value={editPostText}
                    onChange={(e) => setEditPostText(e.target.value)}
                  />
                  <button onClick={() => handleUpdatePost(post.id)}>
                    Save
                  </button>
                  <button onClick={() => setEditPostId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <h3>{post.text}</h3>
                  {token && (
                    <>
                      <button onClick={() => setEditPostId(post.id)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeletePost(post.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}

      {token && (
        <div>
          <h2>Create a New Post</h2>
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Enter post text"
          />
          <button onClick={handleCreatePost}>Create Post</button>
        </div>
      )}
    </div>
  )
}

export default App
