import './App.css'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'

function App() {
  const { session, signOut } = useAuth();
  return (
    <>
      {session ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <div>Please sign in</div>
      )}

      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/dashboard" 
          element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  )
}

export default App
