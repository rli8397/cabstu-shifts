import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthGrid,
  createViewWeek,
  createCalendar,
} from '@schedule-x/calendar'

 
import '@schedule-x/theme-default/dist/index.css'

export default function CalendarApp() {
  const calendar = createCalendar({
    views: [
      createViewDay, 
      createViewWeek, 
      createViewMonthGrid
    ],
    events: [
      {
        id:1,
        title: 'Event 1',
        start: '2024-12-04 10:00',
        end: '2024-12-04 13:00'
      },
    ],
  })

  return (
    <div>
      <Calendar calendarApp={calendar}/>
    </div>
  )
}
 
