import { 
  Route, 
  Routes 
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  LoginView, 
  LogoutView, 
} from './pages/Authentication';
import AdminView from './pages/Administrator'
import { 
  EmployeeView, 
  VisitorView 
} from './pages/Gallery';

  
function App() {
  return (
    <>
    <div className="container-custom">
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/logout" element={<LogoutView />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/inventory" element={<EmployeeView />} />
        <Route path="/gallery" element={<VisitorView />} />
      </Routes>
    </div>
    </>
  )
}

export default App;
