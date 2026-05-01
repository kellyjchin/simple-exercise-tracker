import React from 'react'
import { useState } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Auth() {
    // hooks
    const navigate: NavigateFunction = useNavigate()
    const { signIn, signUp, session } = useAuth();

    if(session) navigate('/dashboard')
    
    // state
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLogin, setIsLogin] = useState<boolean>(true)
    const [errorMsg, setErrorMsg] = useState<string>('');



    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('');

        if(!email || !password) return;

        if (isLogin) {
            const result = await signIn(email, password)
            const { error } = result;
            if (error) {
                console.error(error.message)
                setErrorMsg(error.message);
                return;
            }
            navigate('/dashboard')
            return;    
        }

        const result = await signUp(email, password)
        const { error } = result;
        if (error) {
            console.error(error.message)
            setErrorMsg(error.message);
            return;
        } 
        navigate('/dashboard')
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