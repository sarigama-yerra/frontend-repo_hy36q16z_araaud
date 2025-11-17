import { useEffect, useState } from 'react'
import { apiGet } from './API'

export default function CareerLadder() {
  const [levels, setLevels] = useState([])
  const [competencies, setCompetencies] = useState([])

  useEffect(() => {
    apiGet('/api/reference').then(({ career_levels, competencies }) => {
      setLevels(career_levels)
      setCompetencies(competencies)
    })
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Ladder</h2>
      <p className="text-sm text-gray-600 mb-6">Clear role definitions from Junior to Principal with expectations across core competencies.</p>
      <div className="grid md:grid-cols-5 gap-4">
        {levels.map(lvl => (
          <div key={lvl.level} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-indigo-700 font-semibold mb-2">{lvl.level}</div>
            <ul className="space-y-2">
              {Object.entries(lvl.expectations || {}).map(([key, text]) => (
                <li key={key} className="text-sm text-gray-700"><span className="font-medium capitalize">{key.replace('_',' ')}</span>: {text}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
