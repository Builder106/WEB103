import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CreatorCard from '../components/CreatorCard'
import { supabase } from '../client'

export default function ShowCreators() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCreators() {
      const { data, error } = await supabase.from('creators').select('*')
      if (error) {
        console.error('Error fetching creators:', error)
      } else {
        setCreators(data)
      }
      setLoading(false)
    }

    fetchCreators()
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this creator?')
    if (!confirmed) return
    const { error } = await supabase.from('creators').delete().eq('id', id)
    if (error) {
      console.error('Error deleting creator:', error)
      return
    }
    setCreators((prev) => prev.filter((c) => c.id !== id))
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <header>
        <h1>Creatorverse</h1>
        <Link to='/creators/new'>
          <button>Add a Creator</button>
        </Link>
      </header>
      {creators.length > 0 ? (
        <div className='creator-grid'>
          {creators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onDelete={() => handleDelete(creator.id)}
            />
          ))}
        </div>
      ) : (
        <div className='detail-card'>
          <p>No creators found. Add one!</p>
        </div>
      )}
    </div>
  )
}

