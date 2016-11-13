export default (minutes) => {
  const hours = Math.floor(minutes / 60);
  return {
    hour: hours > 13 ? hours - 12 : hours,
    minutes: minutes % 60 || '00',
  };
};
