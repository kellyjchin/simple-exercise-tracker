import React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'

type AuthContextType = {
    session: Session | null,
    signOut: () => Promise<void>,
    signIn: (email: string, password: string) => Promise<any>,
    signUp: (email: string, password: string) => Promise<any>,
    loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    const [session, setSession] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const signIn = async (email: string, password: string) => {
        const response  = await supabase.auth.signInWithPassword({
            email,
            password
        })

        return response;
    }

    const signUp = async (email: string, password: string) => {
        const response = await supabase.auth.signUp({
            email,
            password
        })
        return response;
    }

    useEffect(() => {
        // initial session check
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setLoading(false)
        }
        getSession()

        // listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session)
                setLoading(false)
            }
        )

        // cleanup subscription on unmount
        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ session, signOut, signIn, signUp, loading }}>
            {children}
        </AuthContext.Provider>
    )
}