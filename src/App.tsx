import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import FilePreviewer from './components/FilePreviewer'
import Statistics from './pages/Statistics'
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<div className='text-white'><h1>404 No Page Found</h1></div>} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/preview" element={<FilePreviewer />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
