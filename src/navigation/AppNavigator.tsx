import Alarm from "@/app/Alarm";
import Home from "@/app/HomeScreen";
import { createNativeStackNavigator } from "expo-router/build/react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export const AppNavigator=()=> {
  return (
    <Stack.Navigator
      initialRouteName="Alarm"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Alarm" component={Alarm}/>
    </Stack.Navigator>
  );
}
