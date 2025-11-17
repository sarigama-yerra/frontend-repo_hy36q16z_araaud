import { useEffect, useState } from 'react'
import { apiGet } from './API'

export default function Navigation({ onSelect }) {
  const [tabs] = useState([
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'ladder', label: 'Career Ladder' },
    { key: 'skills', label: 'Skill Matrix' },
    { key: 'reviews', label: 'Performance Reviews' },
    { key: 'goals', label: 'Goals & Development' },
    { key: 'guilds', label: 'Guilds & Mentorship' },
    { key: 'projects', label: 'Projects' },
    { key: 'resources', label: 'Training' },
  ])

  const [reference, setReference] = useState({ competencies: [], career_levels: [] })
  useEffect(() => {
    apiGet('/api/reference').then(setReference).catch(() => {})
  }, [])

  return (
    <div className="w-full bg-white/70 backdrop-blur sticky top-0 z-10 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="text-xl font-bold text-indigo-700">Designer Growth</div>
        <nav className="flex gap-2 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => onSelect && onSelect(t.key)}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="ml-auto hidden md:block text-xs text-gray-500">
          {reference.competencies.length} competencies • {reference.career_levels.length} levels
        </div>
      </div>
    </div>
  )
}
