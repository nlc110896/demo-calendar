import { Modal } from "antd";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { checkDayAdd } from "../utils/event";
const DatePickerModal = ({
  open,
  onCancel,
  selectedView,
  getTargetDayFromDatepicker,
  targetDay,
}: {
  open: boolean;
  onCancel: () => void;
  selectedView: string;
  getTargetDayFromDatepicker: (target: Date) => void;
  targetDay: Date;
}) => {
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date | null;
  }>({
    startDate: new Date(),
    endDate: null,
  });
  const handleDate = (dates, isTargetDay) => {
    const startDay = [
      "timeGridDay",
      "timeGridThreeDays",
      "timeGridFourDays",
    ].includes(selectedView)
      ? dayjs(
          isTargetDay || selectedView === "timeGridDay" ? dates : [...dates][0]
        ).toDate()
      : dayjs(isTargetDay ? dates : [...dates][0])
          .startOf("week")
          .toDate();
    const endDay = dayjs(startDay)
      .add(checkDayAdd(selectedView), "day")
      .toDate();
    getTargetDayFromDatepicker(startDay);
    setDateRange({ startDate: startDay, endDate: endDay });
  };
  const onChange = (dates: any) => {
    handleDate(dates, false);
  };

  useEffect(() => {
    handleDate(targetDay, true);
  }, [selectedView, targetDay]);
  return (
    <Modal
      open={open}
      getContainer={false}
      footer={false}
      closeIcon={null}
      maskClosable
      onCancel={onCancel}
    >
      <div className="modal-wrapper">
        <DatePicker
          onChange={(v) => onChange(v)}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          selectsRange={selectedView !== "timeGridDay"}
          inline
        />
      </div>
    </Modal>
  );
};

export default DatePickerModal;
