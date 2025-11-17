import { useEffect, useState } from 'react'
import { apiGet, apiPost } from './API'

export default function Resources() {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [tag, setTag] = useState('')
  const [items, setItems] = useState([])

  const load = async () => {
    setItems(await apiGet('/api/resources', tag ? { tag } : {}))
  }
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!title || !url) return
    await apiPost('/api/resources', { title, url, tags: tag ? [tag] : [] })
    setTitle(''); setUrl(''); setTag('')
    await load()
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Training Resources</h2>
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid md:grid-cols-4 gap-2">
          <input className="border rounded px-2 py-1 text-sm" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="border rounded px-2 py-1 text-sm" placeholder="URL" value={url} onChange={e=>setUrl(e.target.value)} />
          <input className="border rounded px-2 py-1 text-sm" placeholder="Tag (e.g., craft_quality)" value={tag} onChange={e=>setTag(e.target.value)} />
          <button onClick={add} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm">Add</button>
        </div>
        <div className="mt-3 flex gap-2">
          <input className="border rounded px-2 py-1 text-sm" placeholder="Filter by tag" value={tag} onChange={e=>setTag(e.target.value)} />
          <button onClick={load} className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-sm">Filter</button>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-3">
        {items.map(it => (
          <a key={it._id} href={it.url} target="_blank" rel="noreferrer" className="bg-white rounded-lg shadow-sm border p-4 hover:border-indigo-300">
            <div className="font-semibold text-gray-800">{it.title}</div>
            <div className="text-xs text-gray-500">{(it.tags||[]).join(', ')}</div>
          </a>
        ))}
      </div>
    </section>
  )
}
