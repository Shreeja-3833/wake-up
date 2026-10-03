import DateTime from "@/components/DateTime";
import * as Application from "expo-application";
import * as IntentLauncher from "expo-intent-launcher";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RNAlarmModule from "react-native-alarmageddon";

const rma = RNAlarmModule;

export default function Alarm() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [activeAlarms, setActiveAlarms] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [alarm, setAlarm] = useState<boolean>(false);

  //Navigate to activity when alarm is ringing
  const redirecting = useRef(false);

  useFocusEffect(
    useCallback(() => {
      redirecting.current = false;

      const checkActiveAlarm = async () => {
        if (redirecting.current) return;
        try {
          const activeAlarm = await rma.getCurrentAlarmPlaying();
          console.log(activeAlarm, "active alarmmmmmmm ");

          if (activeAlarm) {
            redirecting.current = true;
            router.push({
              pathname: "/step-counter",
              params: { alarmId: activeAlarm["activeAlarmId"] },
            });
          }
        } catch (e) {
          console.warn("Alarm check failed", e);
        }
      };

      checkActiveAlarm(); // immediately on focus
      const interval = setInterval(checkActiveAlarm, 1000);

      // also check when app comes back to foreground
      const sub = AppState.addEventListener("change", (state) => {
        if (state === "active") checkActiveAlarm();
      });

      return () => {
        clearInterval(interval);
        sub.remove();
      };
    }, [router]),
  );

  const getPermission = async () => {
    const granted = await rma.ensurePermissions();

    const checkAndRequestAlarmPermission = () => {
      if (Platform.OS !== "android") return;

      if (!granted) {
        Alert.alert(
          "Permission Required",
          "This app needs exact alarm permission to wake you up on time. Please enable it in the settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => openAlarmSettings() },
          ],
        );
      } else {
        console.log("Exact alarm permission is already granted!");
      }
    };

    const openAlarmSettings = async () => {
      if (Platform.OS === "android") {
        const packageName = Application.applicationId;

        try {
          await IntentLauncher.startActivityAsync(
            "android.settings.REQUEST_SCHEDULE_EXACT_ALARM",
            { data: `package:${packageName}` },
          );
        } catch (error) {
          await IntentLauncher.startActivityAsync(
            IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
            { data: `package:${packageName}` },
          );
        }
      }
    };

    if (!granted) {
      checkAndRequestAlarmPermission();
    }
  };

  const refreshAlarmList = async () => {
    const list = await rma.listAlarms();
    setActiveAlarms(list);
  };
  useEffect(() => {
    getPermission();
    refreshAlarmList();
  }, []);

  const toLocalISO = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
      `T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
    );
  };

  const handleScheduleAlarm = async () => {
    try {
      await rma.scheduleAlarm({
        id: `alarm-${date}`,
        datetimeISO: toLocalISO(date),
      });
      Alert.alert("Alarm set successfully ✨");
      refreshAlarmList();
    } catch (error) {
      console.error(error, "something went wrong");
    }
  };

  useEffect(() => {
    if (alarm) handleScheduleAlarm();
  }, [alarm]);

  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={{ padding: 20, backgroundColor: "grey" }}
      >
        <Text>Set and Alarm ⏰</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTime
          date={date}
          setDate={setDate}
          setShowPicker={setShowPicker}
          alarm={alarm}
          setAlarm={setAlarm}
        />
      )}

      {activeAlarms &&
        activeAlarms.length > 0 &&
        activeAlarms.map((alarm) => (
          <Text
            key={alarm.id}
            style={{ fontSize: 16, marginVertical: 5, color: "#666" }}
          >
            ⏰ {new Date(alarm.datetimeISO).toLocaleTimeString()}
          </Text>
        ))}
    </View>
  );
}
