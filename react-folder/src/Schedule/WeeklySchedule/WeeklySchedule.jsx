import './WeeklySchedule.css'
import { useEffect, useState } from 'react'
import DayShifts from './DayShifts'
import Popup from '../../Popup/Popup'
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from '../../firebase'

function getDate(day){
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let date = new Date()
    const dayOfWeek = date.getDay()

    let newDay = date.getDate() - dayOfWeek + daysOfWeek.indexOf(day)
    if (dayOfWeek >= day) newDay += 7
    date = new Date(date.setDate(newDay))

    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return date.getFullYear() + '-' + month + '-' + day
}

export default function WeeklySchedule() {

    const [popup, setPopup] = useState(null)
    const [dayInfo, setDayInfo] = useState({startTime: '', endTime: '', shifts: []})
    const [selectedDay, setSelectedDay] = useState('Monday')
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const updateCalendar = async (day) => {
        setDayInfo(null)
        setDayInfo(await(await getDoc(doc(db, "weekly-shifts", day))).data())

    }

    useEffect(()=>{
        updateCalendar('Monday')
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
                            setPopup(
                                <Popup
                                    closePopup={()=>{setPopup(null)}}
                                    pageContent={
                                        <div className='set-hours-div'>
                                            <div action="submit">
                                                <label htmlFor="startTime">Start Time</label>
                                                <input type="text" id='startTime'/>
                                                <label htmlFor="endTime">End Time</label>
                                                <input type="text" id='endTime'/>
                                                <button onClick={async ()=>{

                                                    const currDay = document.getElementById('day-selector').value

                                                    await updateDoc(doc(db, "weekly-shifts", currDay), {
                                                        startTime: getDate(currDay) + " " + document.getElementById('startTime').value,
                                                        endTime: getDate(currDay) + " " + document.getElementById('endTime').value,
                                                    })

                                                    updateCalendar(currDay)
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
                                                <label htmlFor="startTime">Start Time</label>
                                                <input type="text" id='shift-start'/>
                                                <label htmlFor="endTime">End Time</label>
                                                <input type="text" id='shift-end'/>
                                                <button onClick={async ()=>{
                                                    const currDay = document.getElementById('day-selector').value

                                                    await updateDoc(doc(db, "weekly-shifts", currDay), {
                                                        shifts: arrayUnion({
                                                            id: dayInfo.shifts.length,
                                                            title: document.getElementById('shift-name').value + "'s shift",
                                                            start: getDate(currDay) + " " + document.getElementById('shift-start').value,
                                                            end: getDate(currDay) + " " + document.getElementById('shift-end').value,
                                                        })
                                                    })

                                                    updateCalendar(currDay)
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
                        <DayShifts dayInfo={dayInfo} selectedDay={getDate(selectedDay)}/> 
                    </div>
                </div>
                
            </div>
            {popup}
        </>

    )
}