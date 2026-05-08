import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <section className='flex items-center justify-center h-screen'>
      <h1 className='text-9xl font-bold text-blue-600 '>Prisma Crawler</h1>
    </section>
    </>
  )
}

export default App
