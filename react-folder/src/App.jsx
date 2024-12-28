import Calendar from './Calendar/Calendar'
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import { useState, useEffect, useDebugValue } from 'react'
import Auth from './Auth/Auth'
import './App.css'

export default function App(){
  const [user, setUser] = useState(null)
  return (
    <div>
     {user != null ? 
        <>
          <h1 className='main-header'>Welcome {user.displayName}</h1>
          <Calendar/> 
        </>
      : 
        <Auth setUser={(user)=>{setUser(user)}}/>   
      }
    </div>
  )
}