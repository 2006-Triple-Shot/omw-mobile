import React, { Component } from "react";
import { StyleSheet, Image } from "react-native";

class FrontPage extends Component {
  render() {
    return (
      <Image
        source={{
          uri:
            "https://images.unsplash.com/photo-1597995505938-2387426962ef?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
        }}
        style={styles.container}
      ></Image>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,

    width: null,
    height: null,
  },
});

// let styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover', // or 'stretch'
//   }
// });

export default FrontPage;


// import React, { Component } from "react";
// import { StyleSheet, Image } from "react-native";

// class FrontPage extends Component {
//   render() {
//     return (
//       <Image
//         source={{
//           uri:
//             "https://images.unsplash.com/photo-1597995505938-2387426962ef?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
//         }}
//         style={styles.container}
//       ></Image>
//     );
//   }
// }

// let styles = StyleSheet.create({
//   container: {
//     flex: 1,

//     width: null,
//     height: null,
//   },
// });

// // let styles = StyleSheet.create({
// //   backgroundImage: {
// //     flex: 1,
// //     resizeMode: 'cover', // or 'stretch'
// //   }
// // });

// export default FrontPage;
