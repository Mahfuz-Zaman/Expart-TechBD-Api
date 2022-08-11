// const moment = require('moment');
var moment = require('moment-timezone');

exports.getDateString = (date) => {
    return moment(date).format('YYYY-MM-DD');
}

exports.getDateDifference = (diffType, startDate, endDate) => {
    if (typeof startDate === "string") {
        startDate = new Date(startDate)
    }
    if (typeof endDate === "string") {
        endDate = new Date(endDate)
    }
    const a = moment(startDate, 'M/D/YYYY');
    const b = moment(endDate, 'M/D/YYYY');
    return a.diff(b, diffType ? diffType : 'd');
}

exports.convertToDateTime = (dateStr, timeStr) => {
    const date = moment(dateStr).tz("Asia/Dhaka");
    const time = moment(timeStr, 'HH:mm');

    date.set({
        hour: time.get('hour'),
        minute: time.get('minute'),
        second: time.get('second')
    });
    return date.format();
}

exports.getStartDateTimeDifference = (date) => {
    const today = moment(new Date(), 'M/D/YYYY HH:mm:ss');
    const newDay = moment(new Date(date), 'M/D/YYYY HH:mm:ss');
    return today.diff(newDay,  'minutes');
}


exports.getEndDateTimeDifference = (date) => {
    const today = moment(new Date(), 'M/D/YYYY HH:mm:ss');
    const newDay = moment(new Date(date), 'M/D/YYYY HH:mm:ss');
    return newDay.diff(today,  'minutes');
}

exports.getDateTimeDifference = (date) => {
    const today = moment(new Date(), 'M/D/YYYY HH:mm:ss');
    const newDay = moment(new Date(date), 'M/D/YYYY HH:mm:ss');
    return newDay.diff(today,  'minutes');
}



// outputs: "00:39:30"
