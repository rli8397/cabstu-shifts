import './MonthShiftsEdit.css'
import { doc, getDoc, setDoc } from 'firebase/firestore'
export default function MonthShiftsEdit({ calendarEvent, user }) {
    const timeToString = (time) => {
        const hour = parseInt(time.slice(11, 13))
        const minute = time.slice(13, 16)
        return (hour > 12 ? (hour - 12) + minute + ' PM' : hour + minute + ' AM')
    }

    const handleGiveUpShift = async () => {
        console.log(user.name)
        console.log(calendarEvent.start)
        await setDoc(doc(db, 'shifts-changes', calendarEvent.start), {
            previousWorker: user,
            newWorker: null,
        })
    }

    return (
        <div className="shifts-grid">
            <div className='shifts-header'>
                <p>Name</p>
                <p>Time</p>
                <p>Actions</p>
            </div>
            {calendarEvent.shifts.map((e, index) => (
                <div className='shifts-edit-row' key={index}>
                    <span>{e.title}</span>
                    <span>{timeToString(e.start) + " - " + timeToString(e.end)}</span>
                    <span>{user.email === e.email ? <button onClick={handleGiveUpShift}>Give up shift</button> : <div>None</div>}</span>
                </div>
            ))}
        </div>
    )
}
