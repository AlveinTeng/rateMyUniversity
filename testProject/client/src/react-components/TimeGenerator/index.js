import React from "react";

const log = console.log;

const TimeGenerator = (newDate) => {
  let date = (new Date(newDate)).toLocaleString();
  const month = date.substring(0, date.indexOf('/'));
  date = date.substring(date.indexOf('/')+1);
  const day = date.substring(0, date.indexOf('/'));
  date = date.substring(date.indexOf('/')+1);
  const year = date.substring(0, date.indexOf(','));
  date = date.substring(date.indexOf(',')+2);
  const hour = date.substring(0, date.indexOf(':'));
  date = date.substring(date.indexOf(':')+1);
  const minute = date.substring(0, date.indexOf(':'));
  date = date.substring(date.indexOf(':')+4);
  const a = date.substring(date.indexOf(' '+1));

  const time = `${year}/${month}/${day} ${hour}:${minute} ${a}`;
  return time;
}

export default TimeGenerator;