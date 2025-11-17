import { useEffect, useState } from 'react'
import { apiGet, apiPost } from './API'

export default function Projects() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [managerId, setManagerId] = useState('manager-1')
  const [designer, setDesigner] = useState('demo-designer')
  const [projects, setProjects] = useState([])

  const load = async () => {
    setProjects(await apiGet('/api/projects', { manager_id: managerId }))
  }
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!name) return
    await apiPost('/api/projects', { name, description, manager_id: managerId, designers: [designer] })
    setName(''); setDescription('')
    await load()
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects & Collaboration</h2>
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid md:grid-cols-5 gap-2">
          <input className="border rounded px-2 py-1 text-sm col-span-1" placeholder="Manager ID" value={managerId} onChange={e=>setManagerId(e.target.value)} />
          <input className="border rounded px-2 py-1 text-sm col-span-2" placeholder="Project name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="border rounded px-2 py-1 text-sm col-span-1" placeholder="Designer ID" value={designer} onChange={e=>setDesigner(e.target.value)} />
          <button onClick={add} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm col-span-1">Add</button>
        </div>
        <textarea className="border rounded px-2 py-1 text-sm w-full mt-2" placeholder="Description" rows={3} value={description} onChange={e=>setDescription(e.target.value)} />
      </div>

      <div className="mt-6 grid gap-3">
        {projects.map(p => (
          <div key={p._id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-gray-800">{p.name}</div>
              <div className="text-xs text-gray-500">{(p.designers||[]).length} designers</div>
            </div>
            <div className="text-sm text-gray-600">{p.description}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
