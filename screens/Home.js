import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import styled from "styled-components/native";
import { useQuery } from "react-query";
import { coins } from "../api";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { BLACK_COLOR, GREY_COLOR } from "../colors";
import { Ionicons } from "@expo/vector-icons";
import { Coin } from "../components/Coin";

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
  padding: 20px 20px;
`;

const LogoutBtn = styled.TouchableOpacity``;
const LogoutBtnText = styled.Text``;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${BLACK_COLOR};
`;

const Home = ({ navigation: { setOptions } }) => {
  const { isLoading, data } = useQuery("coins", coins);
  const [cleanData, setCleanData] = useState([]);

  const onLogoutPress = async () => {
    await auth().signOut();
  };

  const LogoutBtn = () => (
    <TouchableOpacity onPress={onLogoutPress}>
      <Ionicons name="log-out-outline" color="white" size={24} />
    </TouchableOpacity>
  );
  useEffect(() => {
    if (data) {
      setCleanData(
        data.filter((coin) => coin.rank !== 0 && coin.is_active && !coin.is_new)
      );
    }
  }, [data]);

  useEffect(() => {
    setOptions({
      headerRight: () => <LogoutBtn />,
    });
  }, []);
  if (isLoading) {
    return (
      <Loader>
        <ActivityIndicator color="white" size={"large"} />
      </Loader>
    );
  }
  return (
    <Container>
      <FlatList
        data={cleanData}
        numColumns={3}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Coin symbol={item.symbol} id={item.id} index={index} />
        )}
      />
    </Container>
  );
};

export default Home;
