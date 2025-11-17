import { useEffect, useState } from 'react'
import { apiGet, apiPost } from './API'

export default function Goals() {
  const [designerId, setDesignerId] = useState('demo-designer')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [competencies, setCompetencies] = useState([])
  const [competencyKey, setCompetencyKey] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [goals, setGoals] = useState([])

  useEffect(() => {
    apiGet('/api/reference').then(({ competencies }) => setCompetencies(competencies))
  }, [])

  const load = async () => {
    setGoals(await apiGet('/api/goals', { designer_id: designerId }))
  }

  const add = async () => {
    if (!title) return
    await apiPost('/api/goals', {
      designer_id: designerId,
      title,
      description,
      competency_key: competencyKey || undefined,
      target_date: targetDate || undefined,
    })
    setTitle(''); setDescription(''); setCompetencyKey(''); setTargetDate('')
    await load()
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Goals & Development</h2>
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid md:grid-cols-5 gap-3">
          <input className="border rounded px-2 py-1 text-sm col-span-1" placeholder="Designer ID" value={designerId} onChange={e=>setDesignerId(e.target.value)} />
          <input className="border rounded px-2 py-1 text-sm col-span-2" placeholder="Goal title" value={title} onChange={e=>setTitle(e.target.value)} />
          <select className="border rounded px-2 py-1 text-sm col-span-1" value={competencyKey} onChange={e=>setCompetencyKey(e.target.value)}>
            <option value="">Competency</option>
            {competencies.map(c => <option key={c.key} value={c.key}>{c.title}</option>)}
          </select>
          <input className="border rounded px-2 py-1 text-sm col-span-1" type="date" value={targetDate} onChange={e=>setTargetDate(e.target.value)} />
        </div>
        <textarea className="border rounded px-2 py-1 text-sm w-full mt-3" placeholder="Description" rows={3} value={description} onChange={e=>setDescription(e.target.value)} />
        <div className="mt-3 flex gap-2">
          <button onClick={add} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm">Add Goal</button>
          <button onClick={load} className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-sm">Refresh</button>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {goals.map(g => (
          <div key={g._id} className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-800">{g.title}</div>
              <div className="text-xs text-gray-500">{g.description}</div>
              {g.competency_key && <div className="text-xs text-indigo-600 mt-1">Aligned to: {g.competency_key.replace('_',' ')}</div>}
            </div>
            <div className="text-right text-xs text-gray-500">
              <div>Status: {g.status}</div>
              <div>Progress: {g.progress}%</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
