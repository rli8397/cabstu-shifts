import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewDay } from '@schedule-x/calendar';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createResizePlugin } from '@schedule-x/resize';
import { updateDoc, doc, getDoc, deleteField } from 'firebase/firestore';
import { db } from '../../firebase';
import { getDate } from './WeeklySchedule';
import './WeeklySchedule.css';
import { useState } from 'react';
import { ShiftsPopup } from './WeeklySchedule'
import Popup from '../../Popup/Popup';
import { createEventsServicePlugin } from '@schedule-x/events-service'

export default function DayShifts({ dayInfo, selectedDay }) {
    if (dayInfo === null) { return }
    let startTime = dayInfo.startTime;
    let endTime = dayInfo.endTime;
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [edit, setEdit] = useState(false)
    if (startTime === '' || endTime === '' || startTime == endTime) {
        startTime = '09:00';
        endTime = '17:00';
    }

    const handleEventUpdates = async (e) => {
        const docRef = doc(db, "weekly-shifts", selectedDay);
        const data = await (await getDoc(docRef)).data();

        const updatedShifts = data.shifts.map(shift =>
            shift.id === e.id ? { ...shift, start: e.start, end: e.end } : shift
        );

        await updateDoc(docRef, { shifts: updatedShifts });
        
    };

    const handleEditShifts = async (startTime, endTime, shiftName, shiftEmail) => {
        const docRef = doc(db, "weekly-shifts", selectedDay);
        const data = await (await getDoc(docRef)).data();

        const start = startTime == '' ? selectedEvent.start : selectedEvent.start.slice(0, 11)  + startTime
        const end = endTime == '' ? selectedEvent.end : selectedEvent.end.slice(0, 11) + endTime
        const name = shiftName == '' ? selectedEvent.title :  `${shiftName}'s shift`
        const email = email == '' ? selectedEvent.email : email
    
        // this updates schedule-x
        calendar.eventsService.update({
            id: selectedEvent.id,
            title: name,
            start: start,
            end: end, 
        })

        // this updates the firestore
        const updatedShifts = data.shifts.map(shift =>
            shift.id === selectedEvent.id ? { ...shift, start: start, end: end, title: name, email: email,} : shift
        );
        await updateDoc(docRef, { shifts: updatedShifts });
    }

    const handleDoubleClick = (e) => {
        setSelectedEvent(e)
    }

    const handleDelete = async (e) => {
        // removes from schedule-x
        calendar.eventsService.remove(selectedEvent.id)

        // deletes from data base
        const docRef = doc(db, "weekly-shifts", selectedDay);
        const data = await (await getDoc(docRef)).data();
        data.shifts = data.shifts.filter(shift => shift.id != selectedEvent.id)
        await updateDoc(docRef, { shifts: data.shifts})
        setSelectedEvent(null)
    }

    const calendar = useCalendarApp({
        views: [ createViewDay() ],
        events: dayInfo.shifts,
        plugins: [
            createDragAndDropPlugin(),
            createResizePlugin(),
            createEventsServicePlugin(),
        ],
        dayBoundaries: {
            start: startTime,
            end: endTime,
        },
        selectedDate: getDate(selectedDay),
        callbacks: {
            onEventUpdate: handleEventUpdates,
            onDoubleClickEvent: handleDoubleClick,
        }
    });

    return (
        <div>
            <div className='day-shifts'>
                <ScheduleXCalendar calendarApp={calendar} />
            </div>
            {selectedEvent != null && 
                <div className='edit-popup'>
                    {edit ?
                            <ShiftsPopup 
                                closePopup={()=>{
                                    setSelectedEvent(null)
                                    setEdit(false)
                                }}
                                updateCalendar={handleEditShifts}
                            />
                        :
                            <Popup
                                closePopup={()=> {setSelectedEvent(null)}}
                                pageContent={
                                    <div className='edit-choices'> 
                                        <button 
                                            className='delete-button'
                                            onClick={handleDelete}
                                        >Delete</button>
                                        <button
                                            onClick={()=> {
                                                setEdit(true)
                                            }}
                                        >Edit</button>
                                    </div>
                                }
                            />
                    }
                </div>
                
            }
        </div>
    );
}