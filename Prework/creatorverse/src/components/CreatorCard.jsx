import { Link } from 'react-router-dom'
import './CreatorCard.css'

export default function CreatorCard({ creator, onDelete }) {
  return (
    <div className='creator-card'>
      <Link to={`/creators/${creator.id}`}>
        {creator.imageURL && (
          <img src={creator.imageURL} alt={creator.name} />
        )}
        <h3>{creator.name}</h3>
        <p>{creator.description}</p>
      </Link>
      {creator.url ? (
        <a href={creator.url} target='_blank' rel='noopener noreferrer'>
          Visit Channel ↗
        </a>
      ) : null}
      <div className='card-buttons' style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <Link to={`/creators/${creator.id}/edit`}>
          <button>Edit</button>
        </Link>
        {onDelete ? (
          <button className='secondary' style={{ color: 'red' }} onClick={onDelete}>Delete</button>
        ) : null}
      </div>
    </div>
  )
}

