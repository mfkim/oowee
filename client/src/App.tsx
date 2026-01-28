import {Routes, Route} from "react-router-dom"
import LoginPage from "@/pages/auth/LoginPage.tsx";
import SignupPage from "@/pages/auth/SignupPage.tsx";
import MainPage from "@/pages/MainPage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage/>}/>

      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/signup" element={<SignupPage/>}/>
    </Routes>
  )
}

export default App
