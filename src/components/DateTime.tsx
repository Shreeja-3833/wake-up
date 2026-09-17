import "@react-native-community/datetimepicker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform } from "react-native";

const DateTime = ({
  date,
  setDate,
  setShowPicker,
  selectedTime,
}: {
  date: Date;
  setDate: (value: Date) => void;
  setShowPicker: (value: boolean) => void;
  selectedTime?: Date;
}) => {
  const [mode, setMode] = useState<"date" | "time">("date");

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if(event.type=='dismissed') {
        setShowPicker(false)
        return;
    }

    if (selectedDate) {
      setDate(selectedDate);
      if (Platform.OS == "android") {
        if (mode == "date") {
          setMode("time");
          setShowPicker(true);
        } else {
          setShowPicker(false);
        }
      } else {
        setShowPicker(false);
      }
    }
  };

  return (
    <DateTimePicker
      value={date}
      mode={mode}
      is24Hour={true}
      display={Platform.OS === "ios" ? "spinner" : "default"}
      onChange={onChange}
      timeZoneName="Asia/Kolkata"
    />
  );
};
export default DateTime;
