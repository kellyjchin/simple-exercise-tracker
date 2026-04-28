import React from 'react'
import { supabase } from '../lib/supabase'
import { useState } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router-dom'

function Auth() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLogin, setIsLogin] = useState<boolean>(true)
    const [errorMsg, setErrorMsg] = useState<string>('');

    const navigate: NavigateFunction = useNavigate()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('');

        if(!email || !password) return;

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                console.error(error.message)
                setErrorMsg(error.message);
            } else {
                navigate('/dashboard')
            }
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password
            })
            if (error) {
                console.error(error.message)
                setErrorMsg(error.message);
            } else {
                navigate('/dashboard')
            }
        }
    }

    return (
        <div>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>

            <form onSubmit={handleAuth}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>

            <button onClick={() => setIsLogin(prev => !prev)}>
                {isLogin ? 'Create an account' : 'Already have an account?'}
            </button>
            { errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : ''}
        </div>
    )
}

export default Auth