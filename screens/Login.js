import React, { useRef, useState } from "react";
import auth from "@react-native-firebase/auth";
import styled from "styled-components/native";
import { BLACK_COLOR, BLUE_COLOR } from "../colors";
import { ActivityIndicator, Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import google from "../assets/google.png";
import facebook from "../assets/facebook.png";

const Container = styled.View`
  background-color: ${BLACK_COLOR};
  flex: 1;
  color: white;
  padding: 60px 20px;
`;

const Wrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

const EmailInput = styled.TextInput`
  width: 100%;
  padding: 12px 20px;
  border-radius: 20px;
  margin-bottom: 16px;
  font-size: 16px;
  color: white;
  background-color: rgba(255, 255, 255, 0.5);
`;
const PasswordInput = styled.TextInput`
  width: 100%;
  padding: 12px 20px;
  border-radius: 20px;
  margin-bottom: 16px;
  font-size: 16px;
  color: white;
  background-color: rgba(255, 255, 255, 0.5);
`;

const Btn = styled.TouchableOpacity`
  width: 100%;
  padding: 12px 20px;
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

const GoogleLogin = styled.View`
  margin-top: 16px;
  flex-direction: row;
`;

const GoogleContainer = styled.View`
  margin: 0px 40px;
  position: relative;
  background-color: white;
  width: 100%;
  height: 44px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const GoogleBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 100%;
`;

const GoogleLogo = styled.Image`
  position: absolute;
  top: -4px;
  left: 10px;
  z-index: 10;
  width: 52px;
  height: 52px;
  padding-left: 10px;
`;

const GoogleText = styled.Text`
  color: ${BLACK_COLOR};
  font-size: 16px;
  background-color: white;
  width: 90%;
  text-align: center;
`;

const FacebookLogin = styled.View`
  margin-top: 16px;
  flex-direction: row;
`;

const FacebookContainer = styled.View`
  margin: 0px 40px;
  position: relative;
  background-color: white;
  width: 100%;
  height: 44px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const FacebookBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 100%;
`;

const FacebookLogo = styled.Image`
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
  width: 30px;
  height: 30px;
  padding-left: 10px;
`;

const FacebookText = styled.Text`
  color: ${BLACK_COLOR};
  font-size: 16px;
  background-color: white;
  width: 90%;
  text-align: center;
`;

const SignInContainer = styled.View`
  margin-top: 16px;
  flex-direction: row;
`;

const SignInText = styled.Text`
  font-size: 16px;
  text-align: center;
  color: white;
`;

const SignInBtn = styled.TouchableOpacity``;

const SighInBtnText = styled.Text`
  font-size: 16px;
  color: ${BLUE_COLOR};
  font-weight: 600;
  margin-left: 8px;
`;

const Login = ({ navigation: { navigate } }) => {
  const passwordInput = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
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
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password": {
          Alert.alert("비밀번호를 확인하세요");
          break;
        }
        case "auth/user-not-found": {
          Alert.alert("가입되지 않은 이메일입니다");
          break;
        }
        case "auth/invalid-email": {
          Alert.alert("이메일 형식에 맞지 않습니다. 이메일 주소를 확인하세요");
          break;
        }
        case "auth/user-disabled": {
          Alert.alert("로그인 할 수 없는 계정입니다. 관리자에게 문의해주세요");
          break;
        }
        case "auth/too-many-requests": {
          Alert.alert("잠시 후 로그인 해주세요");
          break;
        }
        default:
          console.log(error.code);
      }
    }
    setLoading(false);
  };

  const onGoogleLoginPress = async () => {
    if (googleLoading) {
      return;
    }
    setGoogleLoading(true);
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error);
    }
    setGoogleLoading(false);
  };

  const onFacebookPress = async () => {
    if (facebookLoading) {
      return;
    }
    setFacebookLoading(true);
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (result.isCancelled) {
        throw "User cancelled the login process";
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw "Something went wrong obtaining access token";
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken
      );

      // Sign-in the user with the credential
      return auth().signInWithCredential(facebookCredential);
    } catch (error) {
      console.log(error);
    }
    setFacebookLoading(false);
  };
  return (
    <Container>
      <Wrapper>
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
            <BtnText>로그인</BtnText>
          )}
        </Btn>
        <GoogleLogin>
          <GoogleContainer>
            {googleLoading ? (
              <ActivityIndicator color="grey" />
            ) : (
              <GoogleBtn onPress={onGoogleLoginPress}>
                <GoogleLogo source={google} />
                <GoogleText>Google 계정으로 로그인</GoogleText>
              </GoogleBtn>
            )}
          </GoogleContainer>
        </GoogleLogin>
        <FacebookLogin>
          <FacebookContainer>
            {facebookLoading ? (
              <ActivityIndicator color="grey" />
            ) : (
              <FacebookBtn onPress={onFacebookPress}>
                <FacebookLogo source={facebook} />
                <FacebookText>Facebook 계정으로 로그인</FacebookText>
              </FacebookBtn>
            )}
          </FacebookContainer>
        </FacebookLogin>
        <SignInContainer>
          <SignInText>계정이 없으신가요?</SignInText>
          <SignInBtn onPress={() => navigate("Join")}>
            <SighInBtnText>가입하기</SighInBtnText>
          </SignInBtn>
        </SignInContainer>
      </Wrapper>
    </Container>
  );
};

export default Login;
