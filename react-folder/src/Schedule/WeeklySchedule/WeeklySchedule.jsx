import './WeeklySchedule.css'
import React from 'react'
import { useEffect, useState } from 'react'
import DayShifts from './DayShifts'
import Popup from '../../Popup/Popup'
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from '../../firebase'
import TimePicker from '../../TimePicker/TimePicker'
import SearchUser from '../../SearchUser/SearchUser'

export function getDate(day){
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const date = 13 + daysOfWeek.indexOf(day)
    return '2025-01-' + date
}

export function ShiftsPopup({ closePopup, updateCalendar }) {
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [name, setName] = useState('')
    const[email, setEmail] = useState('')
    return (
        <Popup
            closePopup={closePopup}
            pageContent={
                <div className='set-hours-div'>
                    <div action="submit" className='form-content'>
                        <div className='form-group'>
                            <label htmlFor="name">Name</label>
                            <div className='search-bar'>
                                <SearchUser onChange={(email,name)=>{
                                    setName(name)
                                    setEmail(email)
                                }}/>
                            </div>

                        </div>

                        <div className='form-group'>
                            <label htmlFor="startTime">Start Time</label>
                            <TimePicker onChange={(time) => {
                                    setStartTime(time)
                            }} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor="endTime">End Time</label>
                            <TimePicker onChange={(time) => {
                                setEndTime(time)
                            }} />
                        </div>
                        
                        <button onClick={async ()=>{
                            await updateCalendar(startTime, endTime, name, email)
                            closePopup()
                        }}>Submit</button>
                    </div>
                </div>
            }
        />
    )
}

function SetHoursPopup({ closePopup, updateCalendar }){
    const [startTime, setStartTime] = useState('09:00')
    const [endTime, setEndTime] = useState('17:00')

    return (
        <Popup
            closePopup={closePopup}
            pageContent={
                <div className='set-hours-div'>
                    <div action="submit" className='form-content'>
                        <div>
                            <label htmlFor="startTime">Start Time</label>
                            <TimePicker onChange={(time) => {
                                    setStartTime(time)
                            }} />
                        </div>

                        <div>
                            <label htmlFor="endTime">End Time</label>
                            <TimePicker onChange={(time) => {
                                setEndTime(time)
                            }} />
                        </div>
                        
                        <button onClick={async ()=>{    
                            updateCalendar(startTime, endTime);
                            closePopup()

                        }}>Submit</button>

                    </div>
                </div>
            }
        />
    )
}

export default function WeeklySchedule() {

    const [showSetHours, setShowSetHours] = useState(false)
    const [showAddShifts, setShowAddShifts] = useState(false)
    const [dayInfo, setDayInfo] = useState({startTime: '', endTime: '', shifts: []})
    const [selectedDay, setSelectedDay] = useState('Monday')
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const updateShifts = async (startTime, endTime, name, email) => {
        if (startTime != '' && endTime != '' && name != ''){
            await updateDoc(doc(db, "weekly-shifts", selectedDay), {
                shifts: arrayUnion({
                    id: (dayInfo.shifts.length > 0 ? dayInfo.shifts[dayInfo.shifts.length-1].id + 1: 0),
                    title: name + "'s shift",
                    start: getDate(selectedDay) + " " + startTime,
                    end:  getDate(selectedDay) + " " + endTime,
                    email: email,
                })
            })
            refreshCalendar()
        }
    }

    const updateHours = async (startTime, endTime) => {
        await updateDoc(doc(db, "weekly-shifts", selectedDay), {
            startTime: startTime,
            endTime: endTime,
        });
        refreshCalendar()
    }

    const refreshCalendar = async() => {
        setDayInfo(null)
        setDayInfo(await(await getDoc(doc(db, "weekly-shifts", selectedDay))).data())
    }

    useEffect(()=>{ 
        refreshCalendar()
    }, [selectedDay])

    
    return (
        <>
            <div className='weekly-content'>
                <div className='weekly-header'>

                </div>
                    
                <select defaultValue={'Monday'} name="dayOfWeek" id="day-selector" onChange={(e)=>{setSelectedDay(e.target.value)}}>
                    {daysOfWeek.map((day)=>(<option key={day} value={day}>{day}</option>))}
                </select>

                <div className='buttons-div'>
                    {/* Set Hours button */}
                    <button
                        onClick={()=>{
                            setShowSetHours(true)
                            
                        }}
                    >
                        Set Hours
                    </button>
                    
                    
                    <button 
                        onClick={()=>{
                            setShowAddShifts(true)
                        }}
                    >
                        Add Shifts
                    </button>
                </div>

                <div className='shifts-content'>
                    <div className='shifts-calendar'>
                        <DayShifts dayInfo={dayInfo} selectedDay={selectedDay}/> 
                    </div>
                </div>
                
            </div>

            {showSetHours && 
                <SetHoursPopup
                    closePopup={()=>{setShowSetHours(false)}}
                    selectedDay={selectedDay}
                    updateCalendar={updateHours}
                />
            }

            {showAddShifts &&
                <ShiftsPopup 
                    closePopup={()=>{setShowAddShifts(false)}} 
                    selectedDay={selectedDay}
                    updateCalendar={updateShifts}
                />
            }
        </>

    )
}