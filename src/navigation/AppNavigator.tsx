import Home from "@/app/HomeScreen";
import { createNativeStackNavigator } from "expo-router/build/react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export const AppNavigator=()=> {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
