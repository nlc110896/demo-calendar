import { Modal } from "antd";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { checkDayAdd } from "../utils/event";
interface DatePickerModalProps {
  open: boolean;
  onCancel: () => void;
  selectedView: string;
  getTargetDayFromDatepicker: (target: Date) => void;
  targetDay: any;
}
const DatePickerModal: React.FC<DatePickerModalProps> = ({
  open,
  onCancel,
  selectedView,
  getTargetDayFromDatepicker,
  targetDay,
}) => {
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date | null;
  }>({
    startDate: new Date(),
    endDate: null,
  });
  const handleDate = (dates) => {
    const isDayView = [
      "timeGridDay",
      "timeGridThreeDays",
      "timeGridFourDays",
    ].includes(selectedView);
    const value = Array.isArray(dates) ? dates : [dates];
    const startDay = isDayView
      ? dayjs([...value][0]).toDate()
      : dayjs([...value][0])
          .startOf("week")
          .toDate();
    const endDay = dayjs(startDay)
      .add(checkDayAdd(selectedView), "day")
      .toDate();
    getTargetDayFromDatepicker(startDay);
    setDateRange({ startDate: startDay, endDate: endDay });
  };
  const handleOnChange = (dates: any) => {
    handleDate(dates);
  };

  useEffect(() => {
    if (open) handleDate(targetDay);
  }, [open]);
  return (
    <Modal
      open={open}
      getContainer={false}
      footer={false}
      closeIcon={null}
      maskClosable
      onCancel={onCancel}
      width={"fit-content"}
    >
      <div className="modal-wrapper">
        <DatePicker
          onChange={handleOnChange}
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
