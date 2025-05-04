import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Users from './Users'
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'
import SignUp from './SignUp';
import Login from './Login';
function App() {
  

  return (
    <>
      <div className='container'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/register" element={<SignUp/>} />
            <Route path="/main" element={<Users/>} />
            <Route path="/create" element={<CreateUser/>} />
            <Route path="/update/:id" element={<UpdateUser/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App  ; 