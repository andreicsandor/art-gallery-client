import { 
  Route, 
  Routes 
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  Login, 
  Logout, 
} from './pages/Account';
import Home from './pages/Home';
import Header from './pages/Header';

  
function App() {
  return (
    <>
    <div className="container-custom">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
    </>
  )
}

export default App;
