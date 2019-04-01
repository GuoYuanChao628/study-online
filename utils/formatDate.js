export default function formatDate(num) {
    var date = new Date()
    var y = date.getFullYear()
    var m = date.getMonth() + 1;
    var d = date.getDate() > 10 ? date.getDate() : '0' + date.getDate();
    // var newDate = y + '-' + m + '-' + d 
    var addMonth = parseInt(num)
    if (addMonth + m > 12) {
        var newYear = y+1;
        var newMonth = addMonth + m -12
        var newDay = d
    } else {
        var newYear = y;
        var newMonth = m + addMonth;
        var newDay = d
    }
    var newDate = newYear + '-' + (newMonth > 10 ? newMonth : '0' + newMonth) + '-' + (newDay > 10 ? newDay : '0' + newDay)
    return newDate
}