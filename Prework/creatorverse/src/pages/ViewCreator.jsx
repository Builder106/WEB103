import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../client'

export default function ViewCreator() {
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)
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
        setCreator(data)
      }
      setLoading(false)
    }

    fetchCreator()
  }, [id])

  const handleDelete = async () => {
    const { error } = await supabase.from('creators').delete().eq('id', id)
    if (error) {
      console.error('Error deleting creator:', error)
    } else {
      navigate('/')
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (!creator) {
    return <p>Creator not found.</p>
  }

  return (
    <div className='detail-card'>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          {creator.imageURL && (
            <img className='detail-image' src={creator.imageURL} alt={creator.name} />
          )}
        </div>
        <div style={{ minWidth: 260, flex: 1 }}>
          <h2>{creator.name}</h2>
          <p>{creator.description}</p>
          {creator.url ? (
            <p>
              <a href={creator.url} target='_blank' rel='noopener noreferrer'>Visit channel ↗</a>
            </p>
          ) : null}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Link to={`/creators/${id}/edit`}>
              <button>Edit</button>
            </Link>
            <button onClick={handleDelete}>Delete</button>
            <Link to='/'>
              <button className='secondary' style={{ color: 'black' }}>Back</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

