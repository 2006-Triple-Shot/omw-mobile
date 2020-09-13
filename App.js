import React, { Component } from "react";

// Main Screens
import {
  Welcome,
  Guest,
  Host,
  MyEvents,
  SingleEvent,
  New,
  Profile,
  Settings,
  ViewProfile,
} from "./src/components"
import Login from "./eLogin";


import { StyleSheet, Button, View, Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from '@expo/vector-icons';
import { TabActions } from "@react-navigation/native";

const Stack = createStackNavigator();
const MaterialBottomTabs = createMaterialBottomTabNavigator();

const createBottomTabs = (props) => {
  return (
    <MaterialBottomTabs.Navigator
      screenOptions={{
        tabBarColor: "#080C0E",
      }}
    >
      <MaterialBottomTabs.Screen
        name="MyEvents"
        component={MyEvents}
        options={{
          user: props.route.params.user,
          token: props.route.params.token,
          isHost: props.route.params.isHost,
        }}
      />
      <MaterialBottomTabs.Screen
        name="Guest"
        component={Guest}
        options={{
          user: props.route.params.user,
          token: props.route.params.token,
          isHost: props.route.params.isHost,
        }}
      />
      <MaterialBottomTabs.Screen
        name="Host"
        component={Host}
        options={{
          user: props.route.params.user,
          token: props.route.params.token,
          isHost: props.route.params.isHost,
        }}
      />
      <MaterialBottomTabs.Screen
        name="ViewProfile"
        component={ViewProfile}
        options={{
          user: props.route.params.user,
          token: props.route.params.token,
          isHost: props.route.params.isHost,
        }}
      />
      <MaterialBottomTabs.Screen
        name="New"
        component={New}
        options={{
          user: props.route.params.user,
          token: props.route.params.token,
          isHost: props.route.params.isHost,
        }}
      />
      <MaterialBottomTabs.Screen
        name="Settings"
        component={Settings}
        options={{
          user: props.route.params.user,
          token: props.route.params.token,
          isHost: props.route.params.isHost,
        }}
      />
    </MaterialBottomTabs.Navigator>
  );
}

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#71C8E2",
              borderColor: "#2e2c2b",
            },
            headerTitleStyle: {
              color: "black",
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={Welcome}
            options={{
              headerStyle: { backgroundColor: "#71C8E2" },
              headerTitleStyle: { color: "black" },
            }}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="Tabs"
            children={createBottomTabs}
            options={{
              title: "On My Way",
              headerStyle: { backgroundColor: "black" },
              headerTitleStyle: { color: "white" },
            }}
          />
          <Stack.Screen
            name="SingleEvent"
            component={SingleEvent}
            options={{
              title: "On My Way",
              headerStyle: { backgroundColor: "black" },
              headerTitleStyle: { color: "white" },
            }}
          />
          <Stack.Screen
            name={"MyProfile"}
            component={Profile}
            options={{
              title: "On My Way",
              headerStyle: { backgroundColor: "black" },
              headerTitleStyle: { color: "white" },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}












