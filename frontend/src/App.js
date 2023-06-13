import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./pages";
import SignUp from "./pages/sign-up";
import Login from "./pages/login";
import Notes from "./pages/notes";
import Tasks from "./pages/tasks";
import Forbidden from "./pages/forbidden";
import Friends from "./pages/friends";

function App() {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/sign-up' element={<SignUp/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/notes' element={<Notes/>}/>
                <Route path='/tasks' element={<Tasks/>}/>
                <Route path='/forbidden' element={<Forbidden/>}/>
                <Route path='/friends' element={<Friends/>}/>
            </Routes>
        </Router>
    );
}

export default App;
