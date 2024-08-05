import react from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoutes';
import NavBar from './components/NavBar';
import GeoBackground from './components/GeoBackground';
import Characters from './pages/Characters';
import Episodes from './pages/Episodes';
import Profile from './pages/Profile';
import Logout from './components/Logout';
import ChatBot from './pages/ChatBot';
import Chat from './pages/Chat';
import Collection from './pages/Collection';

function App() {
  return (
    <BrowserRouter>
    <GeoBackground/>
    <NavBar/>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/logout' element={<Logout />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/characters' element={<Characters />}/>
        <Route path='/episodes/all' element={<Episodes />}/>
        <Route path='/episodes/season_1' element={<Episodes season={1}/>}/>
        <Route path='/episodes/season_2' element={<Episodes season={2}/>}/>
        <Route path='/episodes/season_3' element={<Episodes season={3}/>}/>
        <Route path='/episodes/season_4' element={<Episodes season={4}/>}/>
        <Route path='/episodes/season_5' element={<Episodes season={5}/>}/>
        <Route path='/chat' element={<ChatBot />}/>
        <Route path='/chat/start' element={<Chat />}/>
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
        <Route path='/collection/characters' element={<ProtectedRoute><Collection type={'characters'} /></ProtectedRoute>}/>
        <Route path='/collection/episodes' element={<ProtectedRoute><Collection type={'episodes'} /></ProtectedRoute>}/>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
