import { useEffect, useState } from 'react'
import Navigation from './components/Navigation'
import CareerLadder from './components/CareerLadder'
import SkillMatrix from './components/SkillMatrix'
import Reviews from './components/Reviews'
import Goals from './components/Goals'
import GuildsMentorship from './components/GuildsMentorship'
import Projects from './components/Projects'
import Resources from './components/Resources'
import Dashboard from './components/Dashboard'

function App() {
  const [active, setActive] = useState('dashboard')

  useEffect(() => {
    // default view
    setActive('dashboard')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50 text-gray-800">
      <Navigation onSelect={setActive} />

      {active === 'dashboard' && <Dashboard />}
      {active === 'ladder' && <CareerLadder />}
      {active === 'skills' && <SkillMatrix />}
      {active === 'reviews' && <Reviews />}
      {active === 'goals' && <Goals />}
      {active === 'guilds' && <GuildsMentorship />}
      {active === 'projects' && <Projects />}
      {active === 'resources' && <Resources />}

      <footer className="text-center text-xs text-gray-500 py-8">© {new Date().getFullYear()} Designer Growth</footer>
    </div>
  )
}

export default App
