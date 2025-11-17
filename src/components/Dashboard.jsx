import { useEffect, useMemo, useState } from 'react'
import { apiGet } from './API'

export default function Dashboard() {
  const [designerId, setDesignerId] = useState('demo-designer')
  const [summary, setSummary] = useState(null)

  const load = async () => {
    const data = await apiGet('/api/summary', { designer_id: designerId })
    setSummary(data)
  }

  useEffect(() => { load() }, [])

  const gapList = useMemo(() => {
    const latest = (summary?.assessments || [])[0]
    if (!latest) return []
    const entries = Object.entries(latest.ratings || {})
    return entries.sort((a,b)=>a[1]-b[1]).slice(0,3)
  }, [summary])

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
      <div className="flex gap-2 mb-4">
        <input className="border rounded px-2 py-1 text-sm" value={designerId} onChange={e=>setDesignerId(e.target.value)} />
        <button onClick={load} className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-sm">Refresh</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Career Level" value={(summary?.career_levels || []).find(l => l.level === summary?.current_level)?.level || '—'} subtitle="Based on manager input" />
        <Card title="Goals" value={(summary?.goals || []).length} subtitle="Active goals" />
        <Card title="Reviews" value={(summary?.reviews || []).length} subtitle="Recent cycles" />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="font-semibold text-gray-800 mb-2">Top Skill Gaps</div>
          <ul className="text-sm space-y-2">
            {gapList.length ? gapList.map(([k,v]) => (
              <li key={k} className="flex items-center justify-between border rounded p-2">
                <span className="capitalize">{k.replace('_',' ')}</span>
                <span className="text-gray-500">{v}/4</span>
              </li>
            )) : <li className="text-sm text-gray-500">No assessments yet.</li>}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="font-semibold text-gray-800 mb-2">Guild Participation</div>
          <p className="text-sm text-gray-500">Coming soon: attendance and activity metrics.</p>
        </div>
      </div>
    </section>
  )
}

function Card({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold text-indigo-700">{value}</div>
      <div className="text-xs text-gray-400">{subtitle}</div>
    </div>
  )
}
