import './App.css'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Nav from './components/Nav'

function App() {
  const { session } = useAuth();
  console.log(session);
  return (
    <>
      {/* {session ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <div>Please sign in</div>
      )} */}
      <Nav />

      <Routes>
        <Route path="/" element={<Home />} />
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
