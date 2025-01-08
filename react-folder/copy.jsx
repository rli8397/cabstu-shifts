import './WeeklySchedule.css'
import React from 'react'
import { useEffect, useState } from 'react'
import DayShifts from './DayShifts'
import Popup from '../../Popup/Popup'
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from '../../firebase'
import { sendEmailVerification } from 'firebase/auth'
import { TimePicker } from '@patternfly/react-core';

export function getDate(day){
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const date = 13 + daysOfWeek.indexOf(day)
    return '2025-01-' + date
}

export default function WeeklySchedule() {

    const [popup, setPopup] = useState(null)
    const [dayInfo, setDayInfo] = useState({startTime: '', endTime: '', shifts: []})
    const [selectedDay, setSelectedDay] = useState('Monday')
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [startTime, setStartTime] = useState('09:00')
    const [endTime, setEndTime] = useState('17:00')
    
    const onStartTimeChange = (time, hour) => {
        setStartTime(hour)
    }

    const onEndTimeChange = (time, hour) => {
        setEndTime(hour)
    }

    const updateCalendar = async (day) => {
        const data = (await getDoc(doc(db, "weekly-shifts", day))).data();
        setDayInfo(data);
    };

    useEffect(()=>{
        updateCalendar(selectedDay)
    }, [selectedDay])


    useEffect(() => {
        const updateTimes = async () => {
            console.log(startTime + " " + endTime) 
            await updateDoc(doc(db, "weekly-shifts", selectedDay), {
                startTime: startTime,
                endTime: endTime,
            });
            updateCalendar(selectedDay);
        };

        updateTimes();
    }, [startTime, endTime]);
    
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
                            setPopup(
                                <Popup
                                    closePopup={()=>{setPopup(null)}}
                                    pageContent={
                                        <div className='set-hours-div'>
                                            <div action="submit">
                                                <label htmlFor="startTime">Start Time</label>
                                                <TimePicker time="3:35 AM" onChange={onStartTimeChange} />
                                                <label htmlFor="endTime">End Time</label>
                                                <TimePicker time="3:35 AM" onChange={onEndTimeChange} />
                                                
                                                <button onClick={async ()=>{
                                                    // console.log(startTime)
                                                    // console.log(endTime)

                                                    // await updateCalendar(selectedDay)
                                                    setPopup(null)

                                                }}>Submit</button>
                                            </div>
                                        </div>
                                    }
                                />
                            )    
                            
                        }}
                    >
                        Set Hours
                    </button>

                    <button 
                        onClick={()=>{
                            setPopup(
                                <Popup
                                    closePopup={()=>{setPopup(null)}}
                                    pageContent={
                                        <div>
                                            <div action="submit">
                                                <label htmlFor="name">Name</label>
                                                <input type="text" id='shift-name'/>
                                                <TimePicker time="3:35 AM" onChange={onStartTimeChange} />
                                                <input type="text" id='shift-start'/>
                                                <TimePicker time="3:35 AM" onChange={onEndTimeChange} />
                                                <input type="text" id='shift-end'/>
                                                <button onClick={async ()=>{
                                                    await updateDoc(doc(db, "weekly-shifts", selectedDay), {
                                                        shifts: arrayUnion({
                                                            id: dayInfo.shifts.length,
                                                            title: document.getElementById('shift-name').value + "'s shift",
                                                            start: startTime,
                                                            end: startTime,
                                                        })
                                                    })

                                                    await updateCalendar(selectedDay)
                                                    setPopup(null)
                                                }}>Submit</button>
                                            </div>
                                        </div>
                                    }
                                />
                            )
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
            {popup}
        </>

    )
}