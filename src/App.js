import { BrowserRouter, Routes, Route} from 'react-router-dom'
import OnlineParkingSystem from './page/home'
import PaymentPage from './page/payment'

import Login from './page/admin'
import Register from './page/images/register'

import ParkingGrid from './page/parkinggrid.js'
import RevenuePage from './page/revenue.js'
export default function App() { 
  return (
    <div>
<BrowserRouter>
<Routes>
  <Route index element={<OnlineParkingSystem />} />
  <Route path="/home" element={<OnlineParkingSystem/>} />
  <Route path="/login" element ={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/parkinggrid" element ={<ParkingGrid/>} />
  <Route path="/payment" element ={<PaymentPage/>} />
  <Route path="/revenue" element={<RevenuePage/>} />

</Routes>

</BrowserRouter>
    </div>
  )
}



