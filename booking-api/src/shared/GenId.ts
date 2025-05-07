import * as dayjs from "dayjs"

export const BookingIdGen = () => {
    const formatDay = dayjs().format('DDMMYY')
    const formatTime = dayjs().format('HH-mm-ss')
    return `Booking-` + formatDay + "-" + formatTime
}