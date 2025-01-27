import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Adjust the paths to match your file structure
import Dashboard from './pages/dashboard'; 
import LoginRegisterForm from './components/LoginRegisterForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
