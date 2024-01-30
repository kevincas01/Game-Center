import {
  Routes,
  Route
} from "react-router-dom";
import GameCenter from "./GameCenter";

import Room from "./Room";
import  './App.css'
import Wordle from "./Components/Wordle";

function App() {

  return(
    

      <Routes>
        <Route path='/' element={<Room/>} />
        <Route path='/gamecenter/:room' element={<GameCenter/>} />
        <Route path='/gamecenter/:room/:game' element={<GameCenter/>} />
        
      </Routes>
    
  )
}

export default App;
