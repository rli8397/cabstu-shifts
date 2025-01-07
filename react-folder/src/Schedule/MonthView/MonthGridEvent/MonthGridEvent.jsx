import './MonthGridEvent.css'
export default function MonthGridEvent({ calendarEvent }) {
    return (
    <div className={`month-grid-container ${calendarEvent.emptyShifts ? 'empty-shifts' : ''}`}>
        {calendarEvent.emptyShifts ? 'Needs Action❗' : 'All shifts covered✅'}
      </div>
    )
}

