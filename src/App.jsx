import './App.css'
import AppRoutes from './Routes/routes.jsx'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <ToastContainer />
      <AppRoutes />
    </>
  )
}

export default App