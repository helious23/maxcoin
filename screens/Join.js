import React, { useRef, useState } from "react";
import auth from "@react-native-firebase/auth";
import styled from "styled-components/native";
import { BLACK_COLOR } from "../colors";
import { ActivityIndicator, Alert } from "react-native";

const Container = styled.View`
  background-color: ${BLACK_COLOR};
  flex: 1;
  align-items: center;
  color: white;
  padding: 60px 20px;
`;

const EmailInput = styled.TextInput`
  width: 100%;
  padding: 10px 20px;
  border-radius: 20px;
  margin-bottom: 16px;
  font-size: 16px;
  color: white;
  background-color: rgba(255, 255, 255, 0.5);
`;
const PasswordInput = styled.TextInput`
  width: 100%;
  padding: 10px 20px;
  border-radius: 20px;
  margin-bottom: 16px;
  font-size: 16px;
  color: white;
  background-color: rgba(255, 255, 255, 0.5);
`;

const Btn = styled.TouchableOpacity`
  width: 100%;
  padding: 10px 20px;
  border-width: 1px;
  border-radius: 20px;
  border-color: rgba(255, 255, 255, 0.5);
  justify-content: center;
  align-items: center;
`;
const BtnText = styled.Text`
  color: white;
  font-size: 16px;
`;

const Join = () => {
  const passwordInput = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmitEditing = () => {
    passwordInput.current.focus();
  };
  const onSubmitPasswordEditing = async () => {
    if (email === "" || password === "") {
      return Alert.alert("이메일과 비밀번호를 입력해주세요");
    }
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      switch (error.code) {
        case "auth/weak-password": {
          Alert.alert("비밀번호는 6글자 이상입니다");
          break;
        }
        case "auth/email-already-in-use": {
          Alert.alert("이미 사용중인 이메일입니다");
          break;
        }
        case "auth/invalid-emai": {
          Alert.alert("이메일 형식에 맞지 않습니다. 이메일을 확인해주세요");
          break;
        }
        default:
          console.log(error.code);
      }
    }
    setLoading(false);
  };

  return (
    <Container>
      <EmailInput
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(text) => setEmail(text)}
        placeholder="E-mail"
        returnKeyType="next"
        placeholderTextColor="rgba(255, 255, 255, 0.7)"
        onSubmitEditing={onSubmitEditing}
      />
      <PasswordInput
        ref={passwordInput}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        placeholderTextColor="rgba(255, 255, 255, 0.7)"
        onSubmitEditing={onSubmitPasswordEditing}
      />
      <Btn onPress={onSubmitPasswordEditing}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <BtnText>회원가입</BtnText>
        )}
      </Btn>
    </Container>
  );
};

export default Join;
