const moment = require('moment');

moment.suppressDeprecationWarnings = true;

function safeFormattedDate(date, defaultValue = undefined) {
  if (!date) { return }
  return moment.utc(date).isValid() ? moment.utc(date).format() : defaultValue;
}

function safeAndPrettyFormattedDate(date, convertToTimestamp = true){
  if (!date) { return null }

  const timestamp = convertToTimestamp
    ? Math.floor(+new Date(date)/1000)
    : Math.floor(date/1000);
    
	return timestamp > 0 && timestamp < (Math.pow(2, 31) -1)
    ? timestamp
    : null
}

function earliestDate(date1, date2) {
  if (!date1 && !date2) { return; }
  if (!moment.utc(date1).isValid() && !moment.utc(date2).isValid()) { return; }
  if ((!date1 || !moment.utc(date1).isValid()) && moment.utc(date2).isValid()) { return moment.utc(date2).format(); }
  if ((!date2 || !moment.utc(date2).isValid()) && moment.utc(date1).isValid()) { return moment.utc(date1).format(); }
  return moment(date1).isBefore(date2) ? moment.utc(date1).format() : moment.utc(date2).format();  
}

module.exports = {
  safeFormattedDate,
  safeAndPrettyFormattedDate,
  earliestDate,
}