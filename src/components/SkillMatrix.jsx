import { useEffect, useMemo, useState } from 'react'
import { apiGet, apiPost } from './API'

const LEVEL_LABELS = {
  1: 'Novice',
  2: 'Developing',
  3: 'Proficient',
  4: 'Expert',
}

export default function SkillMatrix() {
  const [competencies, setCompetencies] = useState([])
  const [designerId, setDesignerId] = useState('demo-designer')
  const [cycle, setCycle] = useState('2025-H1')
  const [ratings, setRatings] = useState({})
  const [history, setHistory] = useState([])

  useEffect(() => {
    apiGet('/api/reference').then(({ competencies }) => setCompetencies(competencies))
  }, [])

  const submit = async () => {
    const body = { designer_id: designerId, cycle, ratings }
    await apiPost('/api/assessments', body)
    const list = await apiGet('/api/assessments', { designer_id: designerId })
    setHistory(list)
  }

  const chartData = useMemo(() => {
    return competencies.map(c => ({ key: c.key, title: c.title, value: Number(ratings[c.key] || 0) }))
  }, [competencies, ratings])

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Skill Matrix</h2>
      <p className="text-sm text-gray-600 mb-6">Self-assess across core competencies. Levels: 1-4 ({Object.values(LEVEL_LABELS).join(', ')}).</p>
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid md:grid-cols-3 gap-4">
          {competencies.map(c => (
            <div key={c.key} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium text-gray-800">{c.title}</div>
                <div className="text-xs text-gray-500">Rate 1-4</div>
              </div>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={ratings[c.key] || ''}
                onChange={e => setRatings(prev => ({ ...prev, [c.key]: Number(e.target.value) }))}
              >
                <option value="">-</option>
                {[1,2,3,4].map(n => (
                  <option key={n} value={n}>{n} - {LEVEL_LABELS[n]}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input className="border rounded px-2 py-1 text-sm" value={designerId} onChange={e=>setDesignerId(e.target.value)} />
          <input className="border rounded px-2 py-1 text-sm" value={cycle} onChange={e=>setCycle(e.target.value)} />
          <button onClick={submit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm">Save Self-Assessment</button>
          <button onClick={async()=> setHistory(await apiGet('/api/assessments', { designer_id: designerId }))} className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-sm">Load History</button>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="font-semibold text-gray-800 mb-2">Overview</div>
          <div className="grid grid-cols-5 gap-3">
            {chartData.map(d => (
              <div key={d.key} className="col-span-1">
                <div className="text-xs text-gray-600 mb-1">{d.title}</div>
                <div className="h-24 bg-gray-100 rounded flex items-end">
                  <div className="w-full bg-indigo-500 rounded-b" style={{ height: `${(d.value/4)*100}%` }} />
                </div>
                <div className="text-center text-xs mt-1">{d.value || '-'}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="font-semibold text-gray-800 mb-2">History</div>
          <ul className="text-sm space-y-2 max-h-56 overflow-auto">
            {history.map(h => (
              <li key={h._id} className="flex justify-between border rounded p-2">
                <span className="text-gray-700">{h.cycle}</span>
                <span className="text-gray-500">{Object.values(h.ratings||{}).reduce((a,b)=>a+Number(b||0),0)} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
