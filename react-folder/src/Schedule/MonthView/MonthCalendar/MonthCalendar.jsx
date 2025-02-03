//import statements
// css files
import '@schedule-x/theme-default/dist/calendar.css'
import './MonthCalendar.css'
//schedule-x
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import { createViewMonthGrid } from '@schedule-x/calendar'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createEventsServicePlugin } from '@schedule-x/events-service'

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

export default function MonthCalendar({ user }) {
  const [popup, setPopup] = useState(null)
  const [data, setData] = useState(null)

  const calendar = useCalendarApp({
      views: [
        createViewMonthGrid(),
      ],
      events: [],
      callbacks: {
        onDoubleClickEvent(calendarEvent) {
          
          if (popup == null) {
            setPopup(<Popup 
              closePopup={()=>{setPopup(null)}}
              pageContent={<MonthShiftsEdit calendarEvent={calendarEvent} user={user}/>}
            />)
          }

        }
      }
    },  
    [
      createEventsServicePlugin(),
      createEventModalPlugin(),
    ],
  )

  /* 
    this useEffect makes a get request to firestore to get the data from the database
    stores the data in the data state variable as a 2d array, stores a list of the list of shifts
    the index for the shifts corresponds to its day (i.e. the list of Sunday's shifts are at index 0, Mondays at index 1, etc)
  */
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


  // this useEffect formats the data into event form, then adds it to the calendar using eventService
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
        calendar.eventsService.add({
          id: day,
          title: 'Click here to see shifts',
          start: eventDate,
          end: eventDate,
          shifts: eventShifts,
        })
      }
    }
  }, [data])

  
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

