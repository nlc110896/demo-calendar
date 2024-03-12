import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { Select } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import isBetween from "dayjs/plugin/isBetween";
import DatePickerModal from "../components/DatePickerModal";
import useStore from "../utils/store";
import { VISIBLE, editDate, formatUTC, options } from "../utils/event";
import { css } from "@emotion/css";

dayjs.extend(isBetween);

const { Option } = Select;

const Home: React.FC = () => {
  const { data, setData, externalList, setExternalList } = useStore();
  const [selectedView, setSelectedView] = useState("timeGridDay");
  const [open, setOpen] = useState(false);
  const calendarRef = useRef<any>(null);
  const targetD = useRef(dayjs());
  const handleSelectChange = (value: React.SetStateAction<string>) => {
    setSelectedView(value);
  };
  const handleDateChange = (action: string) => {
    if (!calendarRef.current) return;
    // @ts-ignore
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
  };
  const handleDatePickerClick = (event) => {
    if (event === VISIBLE.OPEN) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };
  const handleDatePickerSelect = (target) => {
    if (!calendarRef.current) return;
    const targetDate = dayjs(target).format("YYYY-MM-DD");
    calendarRef.current.getApi().gotoDate(targetDate);
    targetD.current = dayjs(target);
  };
  const convertDate = (value: string) => {
    const date = dayjs(value).toDate();
    date.setUTCHours(date.getUTCHours() + -7);
    return date.toISOString();
  };
  const convertData = (data: any) => {
    if (!data.length) return [];
    return data.map((v: any) => {
      return {
        content: { content: v?.tile, color: v?.color },
        id: v?.event?.id,
        start: convertDate(v?.event?.start),
        end: convertDate(v?.event?.end),
      };
    });
  };
  const handleEvent = ({
    event,
    isResize,
  }: {
    event: any;
    isResize: boolean;
  }) => {
    const updatedEvents = data.map((existingEvent) => {
      if (existingEvent.event.id === event.id) {
        const updatedStart = formatUTC(event.start);
        const updatedEnd = formatUTC(event.end || event.start);
        return {
          ...existingEvent,
          event: {
            ...existingEvent.event,
            start: updatedStart,
            end: updatedEnd,
          },
          color: {
            ...existingEvent.color,
            background: isResize ? "#7d2b2b" : "#2a2b2a",
          },
        };
      }
      return existingEvent;
    });
    setData(updatedEvents);
  };
  const isEventIntoExternal = function (x, y) {
    const external_events = document.getElementById(
      "external-events-container"
    );
    if (!external_events) return false;
    const offset = external_events.getBoundingClientRect();
    const right = offset.left + external_events.offsetWidth;
    const bottom = offset.top + external_events.offsetHeight;
    if (x >= offset.left && y >= offset.top && x <= right && y <= bottom) {
      return true;
    }
    return false;
  };

  const handleEventExternalToCalendar = (event) => {
    const startDate = dayjs(event.start);
    const endDate = dayjs(event.end);
    const diffMinutes = endDate.diff(startDate, "minute");
    const updatedStartDate = formatUTC(event.startTime);
    const updatedEndDate = formatUTC(
      dayjs(event.startTime).add(diffMinutes, "minute")
    );
    const index = externalList.findIndex((v) => v?.event?.id === event?.id);
    if (index < 0) return;
    const currentEvent = [...data, externalList[index]];
    const except = [
      ...externalList.slice(0, index),
      ...externalList.slice(index + 1),
    ];
    currentEvent[currentEvent.length - 1].event["start"] = updatedStartDate;
    currentEvent[currentEvent.length - 1].event["end"] = updatedEndDate;
    setData(currentEvent);
    setExternalList(except);
  };
  const handleCalendarToExternal = (eventId) => {
    const updatedCalendarEvents = data.filter(
      (event) => event.event.id !== eventId
    );
    setData(updatedCalendarEvents);
    const updatedExternalEvents = [
      ...externalList,
      data.find((event) => event.event.id === eventId),
    ];
    setExternalList(updatedExternalEvents);
  };
  useEffect(() => {
    let draggableEl = document.getElementById("external-events");
    if (!draggableEl) return;
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        let title = eventEl.getAttribute("title");
        let data = eventEl.getAttribute("data-content");
        return {
          title: title,
          id: title,
          content: data,
          create: false,
        };
      },
    });
  }, []);

  return (
    <div className="demo-app">
      <Select
        defaultValue={selectedView}
        style={{ width: 120 }}
        onChange={handleSelectChange}
      >
        {options.map(({ value, label }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>
      <div className="date-edit flex w-[300px] items-center justify-around">
        {editDate.map(({ value, label }, i) => (
          <div
            key={i}
            className="cursor-pointer"
            onClick={() => {
              if (value === "date") {
                handleDatePickerClick(VISIBLE.OPEN);
              } else {
                handleDateChange(value);
              }
            }}
          >
            {label}
          </div>
        ))}
        <DatePickerModal
          open={open}
          onCancel={() => handleDatePickerClick(VISIBLE.CLOSE)}
          selectedView={selectedView}
          getTargetDayFromDatepicker={handleDatePickerSelect}
          targetDay={targetD.current}
        />
      </div>
      <div className="flex gap-[20px]">
        <div className="wrapper w-[80%]">
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
              editable
              selectable
              selectMirror
              dayMaxEvents={false}
              allDaySlot={false}
              dayHeaders
              ref={calendarRef}
              events={convertData(data)}
              eventContent={renderEventContent}
              dayHeaderContent={(args) => moment(args.date).format("D ddd")}
              eventDrop={(e) => {
                handleEvent({ event: e.event, isResize: false });
              }}
              eventResize={(e) =>
                handleEvent({ event: e.event, isResize: true })
              }
              drop={(e) => {
                let data = e.draggedEl.getAttribute("data-content");
                const newData = JSON.parse(data || "");
                newData["startTime"] = e.date;
                handleEventExternalToCalendar(newData);
              }}
              droppable
              eventOverlap
              eventDragStop={(e) => {
                if (isEventIntoExternal(e.jsEvent.clientX, e.jsEvent.clientY)) {
                  handleCalendarToExternal(e?.event?.id);
                }
              }}
              scrollTimeReset={false}
              slotDuration="00:15:00"
              slotLabelInterval="01:00:00"
            />
          </div>
        </div>
        <div className="drop-outside w-[20%]" id="external-events-container">
          <div id="external-events" className="d-flex flex-wrap">
            {convertData(externalList).map((event) => {
              const content = event.content?.content;
              return (
                <div
                  className="fc-event"
                  title={event.id}
                  data-content={JSON.stringify(event)}
                  key={event.id}
                >
                  <div className="fc-event-main">
                    <b>{content?.header}</b>
                    {content?.content?.map((v, i) => (
                      <p key={i}>{v}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

function renderEventContent(eventInfo) {
  let color;
  const content = eventInfo.event.extendedProps?.content;
  const isString = typeof content === "string";
  if (isString) {
    color = JSON.parse(content);
  }
  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        background-color: ${isString
          ? color?.background
          : content?.color?.background};
        color: ${isString ? color?.text : content?.color?.text};
        border: 1px solid ${isString ? color?.border : content?.color.border};
      `}
    >
      <b>{eventInfo.timeText}</b>
      {content?.content?.content?.map((v, i) => (
        <p key={i}>{v}</p>
      ))}
    </div>
  );
}

export default Home;
