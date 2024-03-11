let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: "Timed event",
    start: todayStr + "T12:00:00",
  },
];

export function createEventId() {
  return String(eventGuid++);
}

export const checkDayAdd = (selectedView: any) => {
  let dayAdd = 0;
  switch (selectedView) {
    case "timeGridDay":
      break;
    case "timeGridWeek":
      dayAdd = 6;
      break;
    case "timeGridTwoWeek":
      dayAdd = 13;
      break;
    case "timeGridThreeWeek":
      dayAdd = 20;
      break;
    case "timeGridFourWeek":
      dayAdd = 27;
      break;
    case "timeGridThreeDays":
      dayAdd = 2;
      break;
    case "timeGridFourDays":
      dayAdd = 3;
      break;
    default:
      break;
  }
  return dayAdd;
};
