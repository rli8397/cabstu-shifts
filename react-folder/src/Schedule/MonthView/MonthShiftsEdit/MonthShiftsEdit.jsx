import './MonthShiftsEdit.css'

export default function MonthShiftsEdit({ calendarEvent }) {
    const timeToString = (time)=> {
        const hour = parseInt(time.slice(11, 13))
        const minute = time.slice(13, 16)
        return (hour > 12 ? (hour - 12) + minute + ' PM' : hour + minute + ' AM')
    }
    console.log(calendarEvent.shifts)
    return (
        <div>
            {
            calendarEvent.shifts.map((e)=> {
                return (
                    <div>
                        {e.title + " --> " + timeToString(e.start) + " - " + timeToString(e.end)}
                    </div>
                )
            })}
        </div>
    )
}