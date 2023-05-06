import { 
  Route, 
  Routes 
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  Login, 
  Logout, 
} from './pages/Account';
import Header from './pages/Header';

  
function App() {
  return (
    <>
    <Header  />
    <div className="container-custom">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
    </>
  )
}

export default App;
