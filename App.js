import React, { useState } from "react";
import auth from "@react-native-firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import InNav from "./navigators/InNav";
import OutNav from "./navigators/OutNav";
import AppLoading from "expo-app-loading";
import { useAssets } from "expo-asset";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Settings } from "react-native-fbsdk-next";
import { QueryClient, QueryClientProvider } from "react-query";
import { GOOGLE_WEB_CLIENT_ID, FACEBOOK_SDK_APP_ID } from "@env";

const queryClient = new QueryClient();

export default function App() {
  const [assets] = useAssets([
    require("./assets/google.png"),
    require("./assets/facebook.png"),
  ]);
  const [ready, setReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const startLoading = () => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
    Settings.setAppID(FACEBOOK_SDK_APP_ID);
  };
  const onFinish = () => setReady(true);
  if (!ready || !assets) {
    return (
      <AppLoading
        onError={console.error}
        startAsync={startLoading}
        onFinish={onFinish}
      />
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {isLoggedIn ? <InNav /> : <OutNav />}
      </NavigationContainer>
    </QueryClientProvider>
  );
}
