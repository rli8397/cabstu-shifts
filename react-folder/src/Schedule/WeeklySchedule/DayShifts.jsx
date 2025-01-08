import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewDay } from '@schedule-x/calendar';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createResizePlugin } from '@schedule-x/resize';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getDate } from './WeeklySchedule';
import './WeeklySchedule.css';

export default function DayShifts({ dayInfo, selectedDay }) {
    if (dayInfo === null) { return }
    let startTime = dayInfo.startTime;
    let endTime = dayInfo.endTime;
    if (dayInfo.startTime === '' || dayInfo.endTime === '' || dayInfo.startTime == dayInfo.endTime) {
        startTime = '09:00';
        endTime = '17:00';
    }
    const handleShiftChanges = async (e) => {

        const docRef = doc(db, "weekly-shifts", selectedDay);

        const data = await (await getDoc(docRef)).data();
        const updatedShifts = data.shifts.map(shift =>
            shift.id === e.id ? { ...shift, start: e.start, end: e.end } : shift
        );

        await updateDoc(docRef, { shifts: updatedShifts });
        
    };

    const calendar = useCalendarApp({
        views: [ createViewDay() ],
        events: dayInfo.shifts,
        plugins: [
            createDragAndDropPlugin(),
            createResizePlugin(),
        ],
        dayBoundaries: {
            start: startTime,
            end: endTime,
        },
        selectedDate: getDate(selectedDay),
        callbacks: {
            onEventUpdate: handleShiftChanges,
        }
    });

    return (
        <div className='day-shifts'>
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
    );
}