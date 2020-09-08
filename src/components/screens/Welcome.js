import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import NativeForms from "native-forms";

const Welcome = () => {
  const [hasForm, showForm] = useState(false);
  const show = () => showForm(true);
  const hide = () => showForm(false);

  return (
    <View style={styles.container}>
      <Text>Register</Text>

      <Button title="Sign in now" onPress={show} color="#20f" />

      {hasForm && (
        <NativeForms
          form="https://my.nativeforms.com/YjcLV2aW1jZmUmN3oUM31Db"
          onClose={hide}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Welcome;