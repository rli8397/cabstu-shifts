import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewDay } from '@schedule-x/calendar';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createResizePlugin } from '@schedule-x/resize';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './WeeklySchedule.css';

export default function DayShifts({ dayInfo, selectedDay }) {
    if (dayInfo == null || dayInfo.startTime === '' || dayInfo.endTime === '' || dayInfo.startTime == dayInfo.endTime) 
        return;

    const handleShiftChanges = async (e) => {

        const docRef = doc(db, "weekly-shifts", selectedDay);

        const data = await (await getDoc(docRef)).data();
        console.log(data)
        // const updatedShifts = data.shifts.map(shift =>
        //     shift.id === e.id ? { ...shift, start: e.start, end: e.end } : shift
        // );

        // console.log(updateShifts)
        // await updateDoc(docRef, { shifts: updatedShifts });
        
    };

    const calendar = useCalendarApp({
        views: [ createViewDay() ],
        events: dayInfo.shifts,
        plugins: [
            createDragAndDropPlugin({
                onEventDrop: handleShiftChanges,
                onEventResize: handleShiftChanges,
            }),
            createResizePlugin({
                onEventResize: handleShiftChanges,
            }),
        ],
        dayBoundaries: {
            start: dayInfo.startTime,
            end: dayInfo.endTime,
        },
        selectedDate: selectedDay,
        callbacks: {
            onEventUpdate: handleShiftChanges,
        }
    });

    return (
        <div>
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
    );
}