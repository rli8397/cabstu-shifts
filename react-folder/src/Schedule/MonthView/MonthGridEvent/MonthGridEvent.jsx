import './MonthGridEvent.css'
export default function MonthGridEvent({ calendarEvent }) {
    return (
    <div className={`month-grid-container ${false ? 'empty-shifts' : ''}`}>
        {false ? 'Needs Action❗' : 'All shifts covered✅'}
      </div>
    )
}

