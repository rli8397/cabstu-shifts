//import statements
// css files
import '@schedule-x/theme-default/dist/calendar.css'
import './MonthCalendar.css'
//schedule-x
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import { createViewMonthGrid } from '@schedule-x/calendar'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createEventModalPlugin } from '@schedule-x/event-modal'

//components
import EventModal from '../EventModal/EventModal'
import MonthGridEvent from '../MonthGridEvent/MonthGridEvent'
import Popup from '../../../Popup/Popup'
import MonthShiftsEdit from '../MonthShiftsEdit/MonthShiftsEdit'

//firebase
import {doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase'

// misc
import { useEffect, useState } from 'react'

export default function MonthCalendar() {
  const [popup, setPopup] = useState(null)
  const [data, setData] = useState(null)
  const [events, setEvents] = useState([{id: 10, title: 'test', start: '2025-01-19', end: '2025-01-19'}])

  useEffect(()=> {
    async function getData() {
      const arr = []
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      for (const day of daysOfWeek) {
        const dayData = await(await getDoc(doc(db, 'weekly-shifts', day))).data()
        arr.push(dayData.shifts)
      }
      setData(arr)
    }
    getData()
  }, [])

  useEffect (()=> {
    if (data){
      // Determine the number of days in the current month
      const currentDate = new Date();  
      const currentYear = currentDate.getFullYear();  
      const currentMonth = currentDate.getMonth(); 
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      const eventsArr = []
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const eventDate = date.toISOString().slice(0, 10)
        const eventShifts = data[date.getDay()]
        const event = {
          id: day,
          title: 'Click here to see shifts',
          start: eventDate,
          end: eventDate,
          shifts: eventShifts,
        }
        eventsArr.push(event)
      }
      setEvents(eventsArr)
    }
  }, [data])

  const calendar = useCalendarApp({
    views: [
      createViewMonthGrid(),
    ],
    events: events,
    callbacks: {
      onDoubleClickEvent(calendarEvent) {
        
        if (popup == null) {
          setPopup(<Popup 
            closePopup={()=>{setPopup(null)}}
            pageContent={<MonthShiftsEdit/>}
          />)
        }

      }
    }
  },  
  [
    createDragAndDropPlugin(),
    createEventModalPlugin(),
  ],
)
  return (
    <>
      <ScheduleXCalendar 
        eventHeight={30}
        calendarApp={calendar}
        customComponents={{
          monthGridEvent: MonthGridEvent,
          eventModal: EventModal,
        }}
      />
      {popup}
    </>
  )
}

