import React from 'react'
import { useState } from 'react'
import type { WorkoutLog } from '../types/workout'

type WorkoutFormData = {
    date: string,
    notes: string,
}

export default function Dashboard() {

    const [logs, setLogs] = useState<WorkoutLog[]>([])
    const [formData, setFormData] = useState<WorkoutFormData>({
        date: '',
        notes: '',
    })

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<WorkoutFormData | null>(null)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if( !formData.date || !formData.notes) {
            return
        }

        const { date, notes } = formData
        const newLog: WorkoutLog = {
            id: crypto.randomUUID(),
            user_id: 'temp-user', // This should come from your auth system
            date: date,
            notes: notes,
        }
        setLogs( prev => [newLog, ...prev])

        setFormData({
            date: '',
            notes: '',
        })

        console.log(logs);
    }

    const handleDelete = (id: string) => {
        setLogs(prev => prev.filter(log => log.id !== id))
    }

    const handleSave = () => {
        if (!editForm || !editingId) return
        setLogs( prev => prev.map(log => log.id === editingId ? { ...log, ...editForm! } : log))
        setEditingId(null)
        setEditForm(null)
    }

    return (
        <>
            <h1>This is the Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="date">Date:</label>
                <input
                    type="date"
                    id="date"
                    value={formData.date}
                    required
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <label htmlFor="notes">Notes:</label>
                <textarea
                    id="notes"
                    value={formData.notes}
                    required
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />

                <button type="submit">Add Workout Log</button>
            </form>

            {logs.map(log => (
                <div key={log.id}>
                    {editingId === log.id ? (
                        <>
                            {/* EDIT MODE */}
                            <input
                                type="date"
                                value={editForm?.date || ""}
                                onChange={(e) =>
                                    setEditForm((prev) =>
                                        prev ? { ...prev, date: e.target.value } : prev
                                )}
                            />
                            <textarea
                                value={editForm?.notes || ""}
                                onChange={(e) =>
                                    setEditForm((prev) =>
                                        prev ? { ...prev, notes: e.target.value } : prev
                                )}
                            />
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => {
                                setEditingId(null)
                                setEditForm(null)
                            }}>Cancel</button>
                        </>
                    ) : (
                        <>
                        {/* VIEW MODE */}
                            <h3>{log.date}</h3>
                            <p>{log.notes}</p>
                            <button onClick={() => handleDelete(log.id)}>Delete</button>
                            <button onClick={() =>  {
                                setEditingId(log.id)
                                setEditForm({ date: log.date, notes: log.notes })
                            }}>Edit</button>
                        </>
                    )}
                </div>
            ))}

        </>
    )
}
