import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { Icon } from "react-native-elements";
import styles from "./Styles";
import api from "../../services/api";
const logo = require("../../../assets/logo.png");

export default function ChangePassword({ route, navigation }) {
  const [passVisible, setPassVisible] = useState(true);
  const [passIcon, setPassIcon] = useState("visibility-off");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [passDiff, setPassDiff] = useState(false);
  const [passWeak, setPassWeak] = useState(false);

  function validadePass() {
    return (
      password.match(/[A-Z]/g) &&
      password.match(/[a-z]/g) &&
      password.match(/\d/g) &&
      password.match(/[!@#$*\.%]/g) &&
      password.length >= 6 &&
      password.length <= 16
    );
  }

  function showPass() {
    passVisible ? setPassVisible(false) : setPassVisible(true);
    passIcon == "visibility-off"
      ? setPassIcon("visibility")
      : setPassIcon("visibility-off");
  }

  function changePass() {
    if (password != password1 || (password || password1).length <= 4) {
      setPassDiff(true);
    } else {
      if (validadePass(password)) {
        const form = new FormData();
        form.append("newPassword", password);
        api.post("/reset-password/change", form).then((res) => {
          if (res.data.success) {
            Alert.alert(
              "Senha alterada!",
              "Sua senha foi alterada com sucesso!",
              [
                {
                  text: "Ok",
                },
              ]
            );
            navigation.navigate("Tab");
          }
        });
      } else {
        setPassWeak(true);
        Alert.alert("Senha fraca");
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerImg}>
        <Image style={styles.logo} source={logo} />
      </View>

      <Text style={styles.text}>
        Você está usando uma senha temporária!{"\n"}Altere sua senha!
      </Text>

      {passWeak ? (
        <View style={{ alignItems: "center" }}>
          <Text style={styles.passLikeTitle}>Sua senha deve possuir:</Text>
          <Text style={styles.passLike}>
            Um símbolo (!@#$*.%){"\n"} Tamanho entre 6 e 16 caracteres{"\n"}
            Pelo menos uma letra maiúscula e uma minúscula{" "}
          </Text>
        </View>
      ) : (
        <></>
      )}

      <View style={styles.containerInput}>
        <TextInput
          style={styles.input}
          placeholder="senha"
          textContentType="password"
          autoCompleteType="password"
          secureTextEntry={passVisible}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPassDiff(false);
            setPassWeak(false);
          }}
        />
        <TouchableOpacity
          style={styles.buttonPass}
          activeOpacity={0.9}
          onPress={() => {
            showPass();
          }}
        >
          <Icon name={passIcon} type="material" color="#2A6484" />
        </TouchableOpacity>
      </View>

      <View style={styles.containerInput}>
        <TextInput
          style={styles.input}
          placeholder="senha"
          textContentType="password"
          autoCompleteType="password"
          secureTextEntry={passVisible}
          value={password1}
          onChangeText={(text) => {
            setPassword1(text);
            setPassDiff(false);
            setPassWeak(false);
          }}
        />
      </View>

      {passDiff ? (
        <Text style={styles.txtPassDiff}>Senhas diferentes!</Text>
      ) : (
        <></>
      )}

      <View style={styles.showPassContainer}></View>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.4}
        onPress={() => changePass()}
      >
        <Text style={styles.text}>Alterar Senha</Text>
      </TouchableOpacity>
    </View>
  );
}
