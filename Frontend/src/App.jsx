import { useState } from 'react'
import './App.css'

import { createBrowserRouter,RouterProvider} from 'react-router-dom'
import Bot from './assets/pages/AtomiaBot/Bot'
function App() {

const router = createBrowserRouter([
{
  path:'/',
  element:<><Bot/></>
}
])

  return (
    <>
  <div className="app-container">
<RouterProvider router={router} />
  </div>
    </>
  )
}

export default App
