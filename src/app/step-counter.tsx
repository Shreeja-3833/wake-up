import AlarmModal from "@/components/AlarmModal";
import * as Application from "expo-application";
import * as IntentLauncher from "expo-intent-launcher";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";

const StepCounter = () => {
  const router = useRouter();
  const { alarmId } = useLocalSearchParams();
  // console.log(alarmId, "alarmId alarmId alarmId alarmId alarmId");

  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [alarmActionModal, setAlarmActionModal] = useState(false);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();

    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      return Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });
    }
  };

  const openStepsSettings = async () => {
    if (Platform.OS === "android") {
      const packageName = Application.applicationId;

      try {
        await IntentLauncher.startActivityAsync(
          "android.settings.ACTIVITY_RECOGNITION",
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

  const getPermissions = async (): Promise<boolean> => {
    const current = await Pedometer.getPermissionsAsync();

    if (current.granted) {
      return true;
    }

    if (!current.canAskAgain) {
      Alert.alert(
        "Permission Required",
        "This app needs activity recognition permission to count your steps. Please enable it in settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => openStepsSettings() },
        ],
      );
      return false;
    }

    const requested = await Pedometer.requestPermissionsAsync();
    return requested.granted;
  };

useEffect(() => {
  let subscription: { remove: () => void } | undefined;
  let timer: ReturnType<typeof setTimeout>;

  (async () => {
    const granted = await getPermissions();
    if (!granted) return;

    subscription = await subscribe();

    // after one minute: stop pedometer and show the modal
    timer = setTimeout(() => {
      subscription?.remove();
      subscription = undefined;
      setAlarmActionModal(true);
    }, 60000);
  })();

  return () => {
    subscription?.remove();
    clearTimeout(timer);
  };
}, []);

const handleDone = () => {
  setAlarmActionModal(false);
  router.back();
};

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
      {alarmActionModal && (
        <AlarmModal alarmId={String(alarmId)} modalVisible={alarmActionModal} onDone={handleDone}/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StepCounter;
