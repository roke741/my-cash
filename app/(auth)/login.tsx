import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  const handleSubmit = () => {
    if (pin === "1234") { // Reemplaza con tu lógica de validación de PIN
      router.replace("/(dashboard)");
    } else {
      alert("PIN incorrecto");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingrese su PIN</Text>
      <TextInput
        style={styles.input}
        placeholder="PIN"
        keyboardType="numeric"
        secureTextEntry
        value={pin}
        onChangeText={setPin}
      />
      <Button title="Entrar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
  },
});
