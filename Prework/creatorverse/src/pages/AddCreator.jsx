import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../client'
import './AddCreator.css'

export default function AddCreator() {
  const [name, setName] = useState('')
  const [imageURL, setImageURL] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    // Basic URL validation
    const hasUrl = url.trim().length > 0
    const isLikelyValidUrl = (value) =>
      /^(https?:\/\/)/i.test(value)

    if (hasUrl && !isLikelyValidUrl(url)) {
      setErrorMessage('Please provide a valid URL starting with http:// or https://')
      return
    }

    setIsSubmitting(true)
    try {
    const { error } = await supabase
      .from('creators')
        .insert([{ name, imageURL, description, url }])
    if (error) {
      console.error('Error adding creator:', error)
        setErrorMessage('Failed to add creator. Please try again.')
        setIsSubmitting(false)
        return
      }
      navigate('/')
    } catch (err) {
      console.error(err)
      setErrorMessage('Something went wrong. Please try again later.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className='form-page'>
      <div className='form-card'>
      <h2 className='form-header'>Add New Creator</h2>
      {errorMessage && <div className='form-error'>{errorMessage}</div>}
      <form onSubmit={handleSubmit} className='form-grid'>
        <div className='form-field'>
          <label htmlFor='name'>Name</label>
        <input
            id='name'
          type='text'
            placeholder='e.g., Fireship'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
            autoFocus
            autoComplete='name'
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
          <label htmlFor='imageURL'>Image URL</label>
        <input
            id='imageURL'
            type='url'
            placeholder='https://...'
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
            autoComplete='off'
          />
          <small className='field-hint'>Optional. A square image works best.</small>
        </div>

        <div className='form-field full-width'>
          <label htmlFor='description'>Description</label>
        <textarea
            id='description'
            placeholder='What is this creator about?'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
            rows={5}
          />
        </div>

        <div className='form-actions'>
          <button type='button' className='secondary'  style={{ color: 'black' }} onClick={() => navigate('/')}
            disabled={isSubmitting}
          >
        Cancel
      </button>
          <button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Adding…' : 'Add Creator'}
          </button>
        </div>
    </form>
      </div>
    </div>
  )
}

