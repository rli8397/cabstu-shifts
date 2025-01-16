import './TimePicker.css'
import { useState, useEffect, useRef } from 'react'
export default function TimePicker({ onChange }) {
    const [hour, setHour] = useState('')
    const [minute, setMinute] = useState('')
    const [amOrPm, setAmOrPm] = useState('AM')
    const [showError, setShowError] = useState(false)

    const amPmRef = useRef(null)
    const minuteRef = useRef(null)

    useEffect (()=>{
        if (hour !== '' && minute !== '') {
            if (amOrPm === 'PM' && parseInt(hour) < 12) {
                setHour(parseInt(hour) + 12)
            } else if (amOrPm === 'AM' && parseInt(hour) > 12) {
                setHour(`0${parseInt(hour) - 12}`)
            } else if(amOrPm === 'AM' && parseInt(hour) === 12) {
                setHour('00')
            }
            onChange(`${hour}:${minute}`)
        }
    },[hour, minute, amOrPm])
    
    return (
        <div>
            <div className='time-picker-container'>
                <input 
                    className={showError ? 'error' : ''}
                    type="text" 
                    id='hour' 
                    placeholder='HH' 
                    maxLength={'2'} 
                    onChange={(e)=>{
                        if (e.target.value.length === 2) {
                            setShowError(false)
                            setHour(e.target.value)
                            minuteRef.current.focus()
                            document.getElementById('hour').classList.remove('error')
                        } else {
                            setShowError(true)
                        }
                    }}
                />

                <span>:</span>

                <input 
                    className={showError ? 'error' : ''}
                    type="text" 
                    id='minute' 
                    placeholder='MM' 
                    max={'2'}
                    ref={minuteRef}
                    onChange={(e)=>{
                        if (e.target.value.length === 2) {
                            setShowError(false)
                            setMinute(e.target.value)
                            amPmRef.current.focus()
                            document.getElementById('minute').classList.remove('error')
                        } else {
                            setShowError(true)
                        }
                    }}
                />

                <select 
                    name="am/pm" id="am/pm" 
                    defaultValue={'AM'} 
                    ref={amPmRef}
                    onChange={(e)=>setAmOrPm(e.target.value)}
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
            {showError && <p className='error-msg'>❗Please follow the format 'HH:MM'</p>}
        </div>
    )
}