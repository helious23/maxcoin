import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { BLACK_COLOR } from "../colors";
import { Detail } from "../components/Detail";
import Home from "../screens/Home";

const Nav = createNativeStackNavigator();

const InNav = () => (
  <Nav.Navigator
    screenOptions={{
      headerTintColor: "white",
      presentation: "modal",
      headerStyle: {
        backgroundColor: BLACK_COLOR,
      },
    }}
  >
    <Nav.Screen name="Coins" component={Home} />
    <Nav.Screen name="Detail" component={Detail} />
  </Nav.Navigator>
);

export default InNav;
