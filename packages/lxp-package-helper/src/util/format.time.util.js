export default (dateString) => {
  const date = new Date(dateString);

  const pad = (num) => (num < 10 ? `0${num}` : num);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth() is zero-indexed
  const day = pad(date.getDate());
  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours %= 12;
  hours = hours ? pad(hours) : '12'; // the hour '0' should be '12'

  // Format date and time
  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};
