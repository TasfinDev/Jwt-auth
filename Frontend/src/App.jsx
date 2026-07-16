import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Home from './Home.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Getme from './Getme.jsx'
import Logout from './Logout.jsx'
const App = () => {

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-700 px-6 py-4">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-lg font-semibold hover:text-indigo-300">
              Home
            </Link>
              <>
                <Link to="/login" className="hover:text-indigo-300">
                  Login
                </Link>
                <Link to="/register" className="hover:text-indigo-300">
                  Register
                </Link>
                <Link to="/User" className="hover:text-indigo-300">
                  User
                </Link>
                 <Link to="/logout" className="hover:text-indigo-300">
                  Logout
                </Link>
              </>
          </div>
        </nav>
      </header>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={ <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/User" element={<Getme />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
