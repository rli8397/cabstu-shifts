import './Calendar.css'
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import { createViewDay, createViewWeek, createViewMonthGrid} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/calendar.css'
export default function Calendar() {
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid()
    ],
    events: [
      {
        id: 1,
        title: 'Event 1',
        start: '2024-12-24 12:00',
        end: '2024-12-24 14:00'
      },
    ],
    selectedDate: '2024-12-24'
  })
  return (
    <>
      <ScheduleXCalendar calendarApp={calendar}/>
    </>
  )
}

