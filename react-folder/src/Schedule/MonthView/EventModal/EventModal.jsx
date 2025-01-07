import './EventModal.css'
export default function EventModal({ calendarEvent }){
    return (
        <div className='modal-container'>
            {calendarEvent.emptyShifts ? 'Empty shifts ' : 'All shifts covered'}
        </div>
    )
}