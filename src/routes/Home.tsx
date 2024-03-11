import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Select, DatePicker } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import isBetween from "dayjs/plugin/isBetween";
import DatePickerModal from "../components/DatePickerModal";
import { INITIAL_EVENTS, checkDayAdd } from "../utils/event";

dayjs.extend(isBetween);

const { Option } = Select;

const Home = () => {
  const [selectedView, setSelectedView] = useState("timeGridDay");
  const [open, setOpen] = useState(false);
  const calendarRef = useRef(null);
  const targetD = useRef(dayjs());
  const handleSelectChange = (value: React.SetStateAction<string>) => {
    setSelectedView(value);
  };
  const handleDateChange = (action: string) => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      switch (action) {
        case "prev":
          api.prev();
          targetD.current =
            calendarRef.current?.calendar?.currentData?.currentDate;
          break;
        case "today":
          api.today();
          const startDay = [
            "timeGridDay",
            "timeGridThreeDays",
            "timeGridFourDays",
          ].includes(selectedView)
            ? dayjs()
            : dayjs().startOf("week");
          targetD.current = startDay;
          break;
        case "next":
          api.next();
          targetD.current =
            calendarRef.current?.calendar?.currentData?.currentDate;
          break;
        default:
          break;
      }
    }
  };
  const handleDatePickerClick = () => {
    setOpen(true);
  };
  const handleDatePickerCancel = () => {
    setOpen(false);
  };
  const handleDatePickerSelect = (
    target: string | number | dayjs.Dayjs | Date | null | undefined
  ) => {
    if (calendarRef.current) {
      const targetDate = dayjs(target).format("YYYY-MM-DD");
      calendarRef.current.getApi().gotoDate(targetDate);
      targetD.current = dayjs(target);
    }
  };
  return (
    <div className="demo-app">
      <Select
        defaultValue={selectedView}
        style={{ width: 120 }}
        onChange={handleSelectChange}
      >
        {/* Your options here */}
        <Option value="timeGridDay">Day</Option>
        <Option value="timeGridWeek">Week</Option>
        <Option value="timeGridTwoWeek">2 Weeks</Option>
        <Option value="timeGridThreeWeek">3 Weeks</Option>
        <Option value="timeGridFourWeek">4 Weeks</Option>
        <Option value="timeGridThreeDays">3 Days Rolling</Option>
        <Option value="timeGridFourDays">4 Days Rolling</Option>
      </Select>
      <div className="date-edit flex w-[300px] items-center justify-around">
        <div
          className="cursor-pointer"
          onClick={() => handleDateChange("prev")}
        >
          {"<"}
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleDateChange("today")}
        >
          Today
        </div>
        <div className="cursor-pointer" onClick={handleDatePickerClick}>
          Date
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleDateChange("next")}
        >
          {">"}
        </div>
        <DatePickerModal
          open={open}
          onCancel={handleDatePickerCancel}
          selectedView={selectedView}
          getTargetDayFromDatepicker={handleDatePickerSelect}
          targetDay={targetD.current}
        />
      </div>
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={selectedView}
          views={{
            timeGridTwoWeek: {
              type: "timeGrid",
              duration: { days: 14 },
            },
            timeGridThreeWeek: {
              type: "timeGrid",
              duration: { days: 21 },
            },
            timeGridFourWeek: {
              type: "timeGrid",
              duration: { days: 28 },
            },
            timeGridThreeDays: {
              type: "timeGrid",
              duration: { days: 3 },
            },
            timeGridFourDays: {
              type: "timeGrid",
              duration: { days: 4 },
            },
          }}
          headerToolbar={false}
          key={selectedView}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={false}
          allDaySlot={false}
          dayHeaders={true}
          ref={calendarRef}
          initialEvents={INITIAL_EVENTS}
          eventContent={renderEventContent}
          dayHeaderContent={(args) => moment(args.date).format("D ddd")}
        />
      </div>
    </div>
  );
};

function renderEventContent(eventInfo: {
  timeText:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
  event: {
    title:
      | string
      | number
      | boolean
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | React.ReactFragment
      | React.ReactPortal
      | null
      | undefined;
  };
}) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default Home;
