import { BASE_URL, COINS_URL } from "@env";

export const coins = () => fetch(COINS_URL).then((response) => response.json());

export const info = (coinId) =>
  fetch(`${COINS_URL}/${coinId}`).then((response) => response.json());
export const history = (coinId) =>
  fetch(
    `${BASE_URL}/tickers/${coinId}/historical?start=${
      new Date().toISOString().split("T")[0]
    }&interval=30m`
  ).then((response) => response.json());
