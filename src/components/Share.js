import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";

export const Share = (props) => {
  const {
    requestDriver,
    lookingForPassengers,
    lookForPassengers,
    isDriver,
    isPassenger,
  } = props;
  if (isDriver) {
    return (
      <TouchableOpacity style={styles.bottomButton}>
        <View>
          <Text style={styles.bottomButtonText}>Share location</Text>
        </View>
      </TouchableOpacity>
    );
  } else if (isPassenger) {
    return (
      <TouchableOpacity style={styles.bottomButton}>
        <View>
          <Text style={styles.bottomButtonText}>Request Share</Text>
        </View>
      </TouchableOpacity>
    );
  } else return null;
};

const styles = StyleSheet.create({
  bottomButton: {
    backgroundColor: "black",
    marginTop: "auto",
    margin: 20,
    padding: 15,
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: "center",
  },
  bottomButtonText: {
    color: "white",
    fontSize: 20,
  },
});

export default Share;
