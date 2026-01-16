function getEventStatus(eventDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDay = new Date(eventDate);
  eventDay.setHours(0, 0, 0, 0);

  if (eventDay > today) return "upcoming";
  if (eventDay.getTime() === today.getTime()) return "ongoing";
  return "past";
}

module.exports = getEventStatus;
