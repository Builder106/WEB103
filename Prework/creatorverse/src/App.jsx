import { useRoutes } from 'react-router-dom'
import ShowCreators from './pages/ShowCreators'
import ViewCreator from './pages/ViewCreator'
import AddCreator from './pages/AddCreator'
import EditCreator from './pages/EditCreator'

function App() {
  const routes = useRoutes([
    {
      path: '/',
      element: <ShowCreators />,
    },
    {
      path: '/creators/new',
      element: <AddCreator />,
    },
    {
      path: '/creators/:id',
      element: <ViewCreator />,
    },
    {
      path: '/creators/:id/edit',
      element: <EditCreator />,
    },
  ])

  return <div className='App'>{routes}</div>
}

export default App
