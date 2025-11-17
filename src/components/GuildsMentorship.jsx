import { useEffect, useState } from 'react'
import { apiGet, apiPost } from './API'

export default function GuildsMentorship() {
  const [guildName, setGuildName] = useState('')
  const [guilds, setGuilds] = useState([])

  const [mentorId, setMentorId] = useState('manager-1')
  const [menteeId, setMenteeId] = useState('demo-designer')
  const [mentorships, setMentorships] = useState([])

  const load = async () => {
    setGuilds(await apiGet('/api/guilds'))
    setMentorships(await apiGet('/api/mentorships', { mentee_id: menteeId }))
  }
  useEffect(() => { load() }, [])

  const addGuild = async () => {
    if (!guildName) return
    await apiPost('/api/guilds', { name: guildName })
    setGuildName('')
    setGuilds(await apiGet('/api/guilds'))
  }

  const addMentorship = async () => {
    await apiPost('/api/mentorships', { mentor_id: mentorId, mentee_id: menteeId })
    setMentorships(await apiGet('/api/mentorships', { mentee_id: menteeId }))
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Guilds & Mentorship</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="font-semibold text-gray-800 mb-2">Guilds</div>
          <div className="flex gap-2 mb-3">
            <input className="border rounded px-2 py-1 text-sm flex-1" placeholder="New guild name" value={guildName} onChange={e=>setGuildName(e.target.value)} />
            <button onClick={addGuild} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm">Add</button>
          </div>
          <ul className="text-sm space-y-2">
            {guilds.map(g => (
              <li key={g._id} className="border rounded p-2 flex items-center justify-between">
                <span className="text-gray-700">{g.name}</span>
                <span className="text-xs text-gray-500">{(g.calendar||[]).length} events</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="font-semibold text-gray-800 mb-2">Mentorships</div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <input className="border rounded px-2 py-1 text-sm" placeholder="Mentor ID" value={mentorId} onChange={e=>setMentorId(e.target.value)} />
            <input className="border rounded px-2 py-1 text-sm" placeholder="Mentee ID" value={menteeId} onChange={e=>setMenteeId(e.target.value)} />
            <button onClick={addMentorship} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm">Create</button>
          </div>
          <ul className="text-sm space-y-2">
            {mentorships.map(m => (
              <li key={m._id} className="border rounded p-2 flex items-center justify-between">
                <span className="text-gray-700">{m.mentor_id} → {m.mentee_id}</span>
                <span className="text-xs text-gray-500">{m.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
