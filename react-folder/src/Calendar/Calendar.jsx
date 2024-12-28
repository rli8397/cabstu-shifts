//import statements
// css files
import './Calendar.css'
import '@schedule-x/theme-default/dist/calendar.css'

//schedule-x
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import { createViewMonthGrid, createViewDay } from '@schedule-x/calendar'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createEventModalPlugin } from '@schedule-x/event-modal'

//components
import EventModal from './EventModal/EventModal'
import MonthGridEvent from './MonthGridEvent/MonthGridEvent'
import Popup from './Popup/Popup'

// misc
import { useState } from 'react'

export default function Calendar() {
  const [popup, setPopup] = useState(null)
  const calendar = useCalendarApp({
    views: [
      createViewMonthGrid(), createViewDay(),
    ],
    events: [
      {
        id: 1,
        title: 'Event 1',
        start: '2024-12-24',
        end: '2024-12-24',
        emptyShifts: true,
      },
    ],
    selectedDate: '2024-12-24',
    callbacks: {
      onDoubleClickEvent(calendarEvent) {
        
        if (popup == null) {
          setPopup(<Popup calendarEvent={calendarEvent} closePopup={()=>{
            setPopup(null)
          }}/>)
        }
        eventModal.close()
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

