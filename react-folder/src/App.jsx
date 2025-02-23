import MonthCalendar from './Schedule/MonthView/MonthCalendar/MonthCalendar'
import { useState } from 'react'
import Auth from './Auth/Auth'
import './App.css'
import WeeklySchedule from './Schedule/WeeklySchedule/WeeklySchedule'
import SearchUser from './SearchUser/SearchUser'
export default function App(){
  const [user, setUser] = useState(null)
  const [choice, setChoice] = useState('Month')
  
  const pages = {
    Month: <MonthCalendar user={user == null ? {} : {email: user.email, name: user.displayName}}/>,
    Week: <WeeklySchedule/>
  }
  return (
    <div>
     {user != null ? 
        <div className='main-content'>
          <div className='header'>
            <h1 className='welcome-header'>Welcome {user.displayName}</h1>
            <select 
              name="menuDropdown" 
              id="menu-dropdown" 
              onChange={(e)=>{setChoice(e.target.value)}}
            >
              <option value="Month">Monthly Shifts</option>
              <option value="Week">Normal Week</option>
            </select>
          </div>
          {pages[choice]}
        </div>
   
      : 
        <Auth setUser={(user)=>{setUser(user)}}/>   
      }

    </div>
  )
}