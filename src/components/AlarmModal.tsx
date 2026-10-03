import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import RNAlarmModule from "react-native-alarmageddon";

const rma = RNAlarmModule;

const AlarmModal = ({
  alarmId,
  modalVisible,
  setModalVisible,
  onDone,
}: {
  alarmId: string;
  modalVisible?: boolean;
  setModalVisible?: (value: boolean) => void;
  onDone?: () => void;
}) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Modal animationType="slide" visible={modalVisible} transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Stop or snooze alarm</Text>
              <View style={styles.actionButtons}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={async () => {
                    // console.log('clicking stop');
                    // console.log(alarmId);
                    await rma.stopCurrentAlarm(alarmId);
                    //   setModalVisible?.(false);
                    onDone?.();
                  }}
                >
                  <Text style={styles.textStyle}>Stop</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={async () => {
                    await rma.snoozeCurrentAlarm(alarmId, 5);
                    //   setModalVisible?.(false);
                    onDone?.();
                  }}
                >
                  <Text style={styles.textStyle}>Snooze</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  actionButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    width: "98%",
  },
});

export default AlarmModal;
