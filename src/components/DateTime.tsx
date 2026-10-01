import "@react-native-community/datetimepicker";
import DateTimePicker, {
  DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform } from "react-native";

const DateTime = ({
  date,
  setDate,
  setShowPicker,
  alarm,
  setAlarm,
}: {
  date: Date;
  setDate: (value: Date) => void;
  setShowPicker: (value: boolean) => void;
  alarm: boolean;
  setAlarm: (value: boolean) => void;
}) => {
  const [mode, setMode] = useState<"date" | "time">("date");

  const onChange = (event: DateTimePickerChangeEvent, selectedDate: Date) => {
  setDate(selectedDate);
  if (Platform.OS === "android") {
    if (mode === "date") {
      setMode("time");
      setShowPicker(true);
    } else {
      setAlarm(true);
      setShowPicker(false);
    }
  } else {
    setAlarm(false);
    setShowPicker(false);
  }
};

  return (
    <DateTimePicker
      value={date}
      mode={mode}
      is24Hour={true}
      display={Platform.OS === "ios" ? "spinner" : "default"}
      onValueChange={onChange}
      timeZoneName="Asia/Kolkata"
    />
  );
};
export default DateTime;
