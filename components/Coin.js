import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { Animated } from "react-native";
import styled from "styled-components/native";
import { GREY_COLOR } from "../colors";

const Wrapper = styled(Animated.createAnimatedComponent(View))`
  justify-content: center;
  align-items: center;
  background-color: ${GREY_COLOR};
  padding: 10px 0px;
`;

const CoinSymbol = styled.Text`
  color: white;
  font-size: 16px;
`;

export const CoinIcon = styled.Image`
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
`;

export const Coin = ({ symbol, index, id }) => {
  const navigation = useNavigation();
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(opacity, {
      toValue: 1,
      useNativeDriver: true,
      delay: index * 100,
    }).start();
  }, []);

  const scale = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  return (
    <TouchableOpacity
      style={{ flex: 0.3 }}
      onPress={() => navigation.navigate("Detail", { symbol, id })}
    >
      <Wrapper style={{ opacity, transform: [{ scale }] }}>
        <CoinIcon
          source={{
            uri: `https://cryptoicon-api.vercel.app/api/icon/${symbol.toLowerCase()}`,
          }}
        />
        <CoinSymbol>{symbol}</CoinSymbol>
      </Wrapper>
    </TouchableOpacity>
  );
};
