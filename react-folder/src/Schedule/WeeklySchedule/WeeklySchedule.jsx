import './WeeklySchedule.css'
import React from 'react'
import { useEffect, useState } from 'react'
import DayShifts from './DayShifts'
import Popup from '../../Popup/Popup'
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from '../../firebase'
import { sendEmailVerification } from 'firebase/auth'
import TimePicker from '../../TimePicker/TimePicker'

export function getDate(day){
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const date = 13 + daysOfWeek.indexOf(day)
    return '2025-01-' + date
}

export default function WeeklySchedule() {

    const [showSetHours, setShowSetHours] = useState(false)
    const [showAddShifts, setShowAddShifts] = useState(false)
    const [dayInfo, setDayInfo] = useState({startTime: '', endTime: '', shifts: []})
    const [selectedDay, setSelectedDay] = useState('Monday')
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [startTime, setStartTime] = useState('09:00')
    const [endTime, setEndTime] = useState('17:00')

    const updateCalendar = async (day) => {
        setDayInfo(null)
        setDayInfo(await(await getDoc(doc(db, "weekly-shifts", day))).data())

    }

    useEffect(()=>{
        updateCalendar(selectedDay)
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
                <Popup
                    closePopup={()=>{setShowSetHours(false)}}
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
                                    console.log('start time: ' + startTime)
                                    console.log('end time: ' + endTime)
                                    await updateDoc(doc(db, "weekly-shifts", selectedDay), {
                                        startTime: startTime,
                                        endTime: endTime,
                                    });
                                    updateCalendar(selectedDay);
                                    setShowSetHours(false);

                                }}>Submit</button>

                            </div>
                        </div>
                    }
                />
            }

            {showAddShifts && 
                <Popup
                    closePopup={()=>{setShowAddShifts(false)}}
                    pageContent={
                        <div className='set-hours-div'>
                            <div action="submit" className='form-content'>
                                <div className='form-group'>
                                    <label htmlFor="name">Name</label>
                                    <input type="text" id='shift-name'/>
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
                                    await updateDoc(doc(db, "weekly-shifts", selectedDay), {
                                        shifts: arrayUnion({
                                            id: dayInfo.shifts[dayInfo.shifts.length-1].id + 1,
                                            title: document.getElementById('shift-name').value + "'s shift",
                                            start: getDate(selectedDay) + " " + startTime,
                                            end:  getDate(selectedDay) + " " + endTime,
                                        })
                                    })

                                    await updateCalendar(selectedDay)
                                    setShowAddShifts(false)
                                }}>Submit</button>
                            </div>
                        </div>
                    }
                />
            }
        </>

    )
}