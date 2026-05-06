import React, { useEffect } from 'react'
import { useState } from 'react'
import type { WorkoutLog, WorkoutFormData } from '../types/workout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { createWorkoutLog, deleteWorkoutLog, getWorkoutLogs, updateWorkoutLog } from '../lib/exercises'

export default function Dashboard() {

    const { session } = useAuth();

    const [logs, setLogs] = useState<WorkoutLog[]>([])
    const [formData, setFormData] = useState<WorkoutFormData>({
        date: '',
        notes: '',
    })

    useEffect(() => {
        if(!session) return
        const fetchLogs = async () => {
            const {data, error} = await getWorkoutLogs(session.user.id)
            if(error) {
                console.error('Error fetching workout logs:', error)
                return
            }
            setLogs(data ?? [])
        }
        fetchLogs()
    }, [session])

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<WorkoutFormData | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if(!session) return;
        if( !formData.date || !formData.notes) return;
            
        const { date, notes } = formData;
        const { data, error } = await createWorkoutLog(session.user.id, date, notes)

        if(error) {
            console.error('Error adding workout log:', error)
            return
        }

        setLogs(prev => [...prev, ...(data ?? [])])
        setFormData({ date: '', notes: ''})
    }

    const handleDelete = async (id: string) => {
        const { error } = await deleteWorkoutLog(id)
        if(error) {
            console.error('Error deleting workout log:', error)
            return
        }
        setLogs(prev => prev.filter(log => log.id !== id))
    }

    const handleSave = async () => {
        if (!editForm || !editingId) return

        const { error } = await updateWorkoutLog(editingId, editForm.date, editForm.notes)

        if(error) {
            console.error('Error updating workout log:', error)
            return
        }

        setLogs(prev => prev.map(log => log.id === editingId ? { ...log, ...editForm } : log))
        setEditingId(null)
        setEditForm(null)
    }

    return (
        <>
            <h1>Dashboard</h1>
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
