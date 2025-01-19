import './MonthGridEvent.css'
export default function MonthGridEvent({ calendarEvent }) {
    return (
    <div className={`month-grid-container ${true ? 'empty-shifts' : ''}`}>
        {true ? 'Needs Action❗' : 'All shifts covered✅'}
      </div>
    )
}

