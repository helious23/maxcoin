import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { useQuery } from "react-query";
import styled from "styled-components/native";
import { VictoryChart, VictoryLine, VictoryScatter } from "victory-native";
import { history, info } from "../api";
import { BLACK_COLOR } from "../colors";
import { CoinIcon } from "./Coin";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Container = styled.ScrollView`
  background-color: ${BLACK_COLOR};
`;

export const Detail = ({
  navigation,
  route: {
    params: { symbol, id },
  },
}) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <CoinIcon
          source={{
            uri: `https://cryptoicon-api.vercel.app/api/icon/${symbol.toLowerCase()}`,
          }}
        />
      ),
    });
  }, []);
  const {
    isLoading: infoLoading,
    data: infoData,
    isError: infoError,
  } = useQuery(["coinInfo", id], () => info(id));
  const {
    isLoading: historyLoading,
    data: historyData,
    isError: historyError,
  } = useQuery(["coinHistory", id], () => history(id));
  const [victoryData, setVictoryData] = useState(null);
  useEffect(() => {
    if (historyData) {
      setVictoryData(
        historyData.map((price) => ({
          x: new Date(price.timestamp).getTime(),
          y: price.price,
        }))
      );
    }
  }, [historyData]);

  return (
    <Container>
      {victoryData && (
        <VictoryChart height={360}>
          <VictoryLine
            animate={{
              duration: 200,
            }}
            interpolation="linear"
            data={victoryData}
            style={{ data: { stroke: "#0984e3" } }}
          />
          <VictoryScatter
            data={victoryData}
            style={{ data: { fill: "#0984e3" } }}
          />
        </VictoryChart>
      )}
    </Container>
  );
};
