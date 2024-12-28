import './Popup.css'

export default function Popup({ calendarEvent, closePopup }) {
    return (
        <div className='popup-div'>
            <div className='popup-content'>
                <h1>{calendarEvent.title}</h1>
                <button className='close-btn' onClick={closePopup}>✖</button>
            </div>
        </div>
    )
}