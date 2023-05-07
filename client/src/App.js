import { 
  Route, 
  Routes 
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  Login, 
  Logout, 
} from './pages/Authentication';
import { 
  ExhibitsEmployee, 
  ExhibitsVisitor 
} from './pages/Exhibits';

  
function App() {
  return (
    <>
    <div className="container-custom">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/inventory" element={<ExhibitsEmployee />} />
        <Route path="/gallery" element={<ExhibitsVisitor />} />
      </Routes>
    </div>
    </>
  )
}

export default App;
