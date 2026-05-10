import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
type Props = {
    children: React.ReactNode
}

function ProtectedRoute({ children }: Props) {

    const { session, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>
    } 

    if (!session) {
        return <Navigate to="/login" />
    }

    return <div className='protected-wrapper m-2'>{children}</div>
}


export default ProtectedRoute