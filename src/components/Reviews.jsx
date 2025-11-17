import { useEffect, useState } from 'react'
import { apiGet, apiPost } from './API'

export default function Reviews() {
  const [designerId, setDesignerId] = useState('demo-designer')
  const [cycle, setCycle] = useState('2025-H1')
  const [selfEval, setSelfEval] = useState({})
  const [peerEval, setPeerEval] = useState({})
  const [managerEval, setManagerEval] = useState({})
  const [competencies, setCompetencies] = useState([])
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    apiGet('/api/reference').then(({ competencies }) => setCompetencies(competencies))
  }, [])

  const saveReview = async () => {
    const body = {
      designer_id: designerId,
      cycle,
      self_eval: normalize(selfEval),
      peer_evals: [normalize(peerEval)],
      manager_eval: normalize(managerEval),
    }
    await apiPost('/api/reviews', body)
    setReviews(await apiGet('/api/reviews', { designer_id: designerId, cycle }))
  }

  const normalize = (obj) => Object.fromEntries(Object.entries(obj).map(([k,v]) => [k, clamp(Number(v||0))]))
  const clamp = (n) => Math.max(1, Math.min(5, n))

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Performance Reviews</h2>
      <p className="text-sm text-gray-600 mb-4">Five-point scale. Capture self, peer, and manager evaluations per cycle.</p>
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex gap-3 mb-3">
          <input className="border rounded px-2 py-1 text-sm" value={designerId} onChange={e=>setDesignerId(e.target.value)} />
          <input className="border rounded px-2 py-1 text-sm" value={cycle} onChange={e=>setCycle(e.target.value)} />
          <button onClick={async()=> setReviews(await apiGet('/api/reviews', { designer_id: designerId, cycle }))} className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-sm">Load</button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Rater title="Self" data={selfEval} setData={setSelfEval} competencies={competencies} />
          <Rater title="Peer" data={peerEval} setData={setPeerEval} competencies={competencies} />
          <Rater title="Manager" data={managerEval} setData={setManagerEval} competencies={competencies} />
        </div>
        <button onClick={saveReview} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm">Save Review</button>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
        <div className="font-semibold text-gray-800 mb-2">Summary</div>
        <ul className="text-sm space-y-2">
          {reviews.map(r => (
            <li key={r._id} className="border rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{r.cycle}</span>
                <span className="text-gray-500">Self avg: {avg(r.self_eval)} • Manager avg: {avg(r.manager_eval)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Rater({ title, data, setData, competencies }) {
  return (
    <div>
      <div className="font-semibold text-gray-800 mb-2">{title} Evaluation</div>
      <div className="space-y-2">
        {competencies.map(c => (
          <div key={c.key} className="flex items-center justify-between border rounded p-2">
            <div className="text-sm text-gray-700">{c.title}</div>
            <input type="number" min={1} max={5} className="w-20 border rounded px-2 py-1 text-sm" value={data[c.key] || ''} onChange={e=>setData(prev => ({ ...prev, [c.key]: e.target.value }))} />
          </div>
        ))}
      </div>
    </div>
  )
}

function avg(obj) {
  const vals = Object.values(obj || {}).map(v => Number(v||0)).filter(Boolean)
  if (!vals.length) return '-'
  const n = vals.reduce((a,b)=>a+b,0) / vals.length
  return n.toFixed(1)
}
