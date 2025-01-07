import './Popup.css'

export default function Popup({ closePopup, pageContent}) {
    return (
        <div className='popup-div'>
            <div className='popup-content'>
                {pageContent}
                <button className='close-btn' onClick={closePopup}>✖</button>
            </div>
        </div>
    )
}