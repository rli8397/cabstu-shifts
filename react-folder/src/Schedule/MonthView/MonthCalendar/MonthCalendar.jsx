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
import { doc, getDoc } from 'firebase/firestore'
import db from '../../../firebase'

// misc
import { useEffect, useState } from 'react'

export default function MonthCalendar() {
  const [popup, setPopup] = useState(null)

  const calendar = useCalendarApp({
    views: [
      createViewMonthGrid(),
    ],
    events: [
      {
        id: 1,
        title: 'Event 1',
        start: '2025-01-24',
        end: '2025-01-24',
        emptyShifts: true,
      },
    ],
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

