import {Routes, Route} from "react-router-dom"
import LoginPage from "@/pages/auth/LoginPage.tsx";
import SignupPage from "@/pages/auth/SignupPage.tsx";
import MainPage from "@/pages/MainPage.tsx";
import DiceGamePage from "@/pages/game/DiceGamePage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage/>}/>

      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/signup" element={<SignupPage/>}/>

      <Route path="/game/dice" element={<DiceGamePage />} />
    </Routes>
  )
}

export default App
