import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../client'

export default function EditCreator() {
  const [name, setName] = useState('')
  const [imageURL, setImageURL] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchCreator() {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        console.error('Error fetching creator:', error)
      } else {
        setName(data.name)
        setImageURL(data.imageURL)
        setUrl(data.url || '')
        setDescription(data.description)
      }
    }

    fetchCreator()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const hasUrl = url.trim().length > 0
    const isLikelyValidUrl = (value) => /^(https?:\/\/)/i.test(value)

    if (hasUrl && !isLikelyValidUrl(url)) {
      // Basic inline guard to avoid saving clearly malformed URLs
      alert('Please provide a valid URL starting with http:// or https://')
      return
    }
    const { error } = await supabase
      .from('creators')
      .update({ name, imageURL, description, url })
      .eq('id', id)
    if (error) {
      console.error('Error updating creator:', error)
    } else {
      navigate(`/creators/${id}`)
    }
  }

  return (
    <div className='form-page'>
      <form onSubmit={handleSubmit} className='form-card' style={{ width: '100%' }}>
        <h2 className='form-header'>Edit Creator</h2>
        <div className='form-grid'>
          <div className='form-field'>
            <label>Name</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className='form-field'>
            <label htmlFor='url'>Channel URL</label>
            <input
              id='url'
              type='url'
              placeholder='https://youtube.com/@...'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoComplete='url'
            />
            <small className='field-hint'>Optional. Use a full URL starting with http(s)://</small>
          </div>
          <div className='form-field'>
            <label>Image URL</label>
            <input
              type='text'
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            />
          </div>
          <div className='form-field full-width'>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
            />
          </div>
          <div className='form-actions'>
            <button type='button' className='secondary' style = {{color: 'black'}} onClick={() => navigate(`/creators/${id}`)}>
              Cancel
            </button>
            <button type='submit'>Save Changes</button>
          </div>
        </div>
      </form>
    </div>
  )
}

