import React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type AuthContextType = {
    session: any,
    signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    const [session, setSession] = useState<any>(null)
    const signOut = async () => {
        await supabase.auth.signOut()
    }

    useEffect(() => {
        // initial session check
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
        }
        getSession()

        // listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
            setSession(session)
            }
        )

        // cleanup subscription on unmount
        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ session, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}