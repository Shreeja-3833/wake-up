import * as Application from "expo-application";
import * as IntentLauncher from "expo-intent-launcher";
import { useRouter } from "expo-router";
import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";

const StepCounter = () => {
  const router=useRouter()
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [currentStepCount, setCurrentStepCount] = useState(0);

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
    let startTime: number;
    let timer: ReturnType<typeof setInterval>;

    (async () => {
      const granted = await getPermissions();
      if (granted) {
        subscription = await subscribe();
        startTime = Date.now();

        timer = setInterval(() => {
          const elapsed = Date.now() - startTime;

          if (elapsed >= 60000) {
            () => {
              subscription?.remove();
            };
            // console.log('stopping step counter');
            Alert.alert("Stopping step counter");
            clearInterval(timer);
            router.back();
            return;
          }
        }, 1000);
      }
    })();

    return () => {
      subscription?.remove();
      clearInterval(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
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
