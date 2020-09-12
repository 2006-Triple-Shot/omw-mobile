
import React, { Component } from "react";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import NativeForms from "native-forms";
import { TouchableOpacity } from "react-native-gesture-handler";

class Welcome extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require("/Users/esy/Fullstack-Academy/seniorPhase/capstone/On-My-Way/omw-mobile/src/components/images/lilbackboat.png")}
          style={styles.backgroundImage}
        />

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Login")}
        >
          <View>
            <Text style={styles.button}>Login</Text>
          </View>
        </TouchableOpacity>
      </View>
    );

  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#71C8E2",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroungImage: {
    flex: 1,
    justifyContent: "flex-start",
    paddingVertical: 30,
  },
  button: {
    color: "#71C8E2",
    backgroundColor: "black",
    fontSize: 30,
    width: 110,
    marginBottom: 10,
    justifyContent: "center",
    height: 45,
    justifyContent: "center",
    flexDirection: "row",
    textAlign: "center",
    alignContent: "center",
    alignSelf: "center",
  },
});

export default Welcome;



// import React, { useState } from "react";
// import { Button, StyleSheet, Text, View } from "react-native";
// import NativeForms from "native-forms";

// const Welcome = () => {
//   const [hasForm, showForm] = useState(false);
//   const show = () => showForm(true);
//   const hide = () => showForm(false);

//   return (
//     <View style={styles.container}>
//       <Text>Host</Text>

//       <Button
//         title="Create Events | Invite Guests"
//         onPress={show}
//         color="#20f"
//       />

//       {hasForm && (
//         <NativeForms
//           form="https://my.nativeforms.com/wNy5UUa1jZmUmN3oUM31Db"
//           onClose={hide}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

// export default Welcome;
