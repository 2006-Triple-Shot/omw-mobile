import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'

class ViewProfile extends Component {
  render() {
    console.log(this.props)
    // const {user} = this.props.route.params;
    return (
      <View style={styles.container} >
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("MyProfile", {
              screen: "Profile",

            })
          }
        >
          <Text style={styles.button}>View Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#71C8E2",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    color: "white",
    backgroundColor: "black",
    fontSize: 18,
    width: 110,
    marginBottom: 10,
    justifyContent: "center",
    height: 45,
    textAlign: "center",
    alignContent: "center",
    alignSelf: "center",
  },
});

export default ViewProfile
