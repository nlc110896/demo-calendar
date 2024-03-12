import moment from "moment-timezone";
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

export const formatUTC = (date) => {
  const originalDate = new Date(date);
  const isodate = moment(originalDate)
    .format("YYYY-MM-DDTHH:mm:ssZ")
    .split("+");
  return `${isodate[0]}+00:00`;
};

export const options = [
  { value: "timeGridDay", label: "Day" },
  { value: "timeGridWeek", label: "Week" },
  { value: "timeGridTwoWeek", label: "2 Weeks" },
  { value: "timeGridThreeWeek", label: "3 Weeks" },
  { value: "timeGridFourWeek", label: "4 Weeks" },
  { value: "timeGridThreeDays", label: "3 Days Rolling" },
  { value: "timeGridFourDays", label: "4 Days Rolling" },
];

export const editDate = [
  { value: "prev", label: "<" },
  { value: "today", label: "Today" },
  { value: "date", label: "Date" },
  { value: "next", label: ">" },
];

export enum VISIBLE {
  OPEN = "open",
  CLOSE = "close",
}
