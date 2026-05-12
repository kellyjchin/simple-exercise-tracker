import React, { useEffect } from 'react'
import { useState } from 'react'
import type { WorkoutLog, WorkoutFormData } from '../types/workout'
import { useAuth } from '../context/AuthContext'
import { createWorkoutLog, deleteWorkoutLog, getWorkoutLogs, updateWorkoutLog } from '../lib/exercises'

export default function Dashboard() {

    const { session } = useAuth();

    const [logs, setLogs] = useState<WorkoutLog[]>([])
    const [formData, setFormData] = useState<WorkoutFormData>({
        date: '',
        notes: '',
    })
    const [openModal, setOpenModal] = useState<boolean>(false)

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
        setOpenModal(false);
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
            <dialog open={openModal} onClose={() => setOpenModal(false)} className='p-4 border-navy-ridged rounded-2 bg-white text-black w-75-vw'>
                <button className='d-flex justify-self-end' onClick={() => setOpenModal(false)}>X</button>
                <form className='d-flex flex-column r-gap-2' onSubmit={handleSubmit}>
                    <label className='text-left' htmlFor="date">Date:</label>
                    <input
                        className='p-2'
                        type="date"
                        id="date"
                        value={formData.date}
                        required
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                    <label className='text-left' htmlFor="notes">Entry:</label>
                    <textarea
                        id="notes"
                        className='h-200px'
                        value={formData.notes}
                        required
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />

                    <button className='navy py-2' type="submit">Add Workout Log</button>
                </form>
            </dialog>
            <button className='my-3 navy p-2 d-flex text-white' onClick={() => setOpenModal(true)}>Add a workout</button>
            {logs.map(log => (
                <div className='log-entry pre-wrap p-2 mb-2 border-navy-ridged bg-white text-black rounded-2' key={log.id}>
                    {editingId === log.id ? (
                        <>
                            {/* EDIT MODE */}
                            <input
                            className='d-block'
                                type="date"
                                value={editForm?.date || ""}
                                onChange={(e) =>
                                    setEditForm((prev) =>
                                        prev ? { ...prev, date: e.target.value } : prev
                                )}
                            />
                            <textarea
                                className='d-block mt-2'
                                value={editForm?.notes || ""}
                                onChange={(e) =>
                                    setEditForm((prev) =>
                                        prev ? { ...prev, notes: e.target.value } : prev
                                )}
                            />
                            <div className='d-flex justify-content-end'>
                                <button className='m-2 navy p-2 text-white' onClick={handleSave}>Save</button>
                                <button className='m-2 navy p-2 text-white' onClick={() => {
                                    setEditingId(null)
                                    setEditForm(null)
                                }}>Cancel</button>
                            </div>
                        </>
                    ) : (
                        <>
                        {/* VIEW MODE */}
                           
                            <h3 className='m-2 ms-2 text-left'>{log.date}</h3>
                            <p className='body m-2 text-left'>{log.notes}</p>
                            <div className='d-flex justify-content-end'>
                                <button className='m-2 navy p-2 text-white' onClick={() => handleDelete(log.id)}>Delete</button>
                                <button className='m-2 navy p-2 text-white' onClick={() =>  {
                                    setEditingId(log.id)
                                    setEditForm({ date: log.date, notes: log.notes })
                                }}>Edit</button>
                            </div>
                        </>
                    )}
                </div>
            ))}

        </>
    )
}
