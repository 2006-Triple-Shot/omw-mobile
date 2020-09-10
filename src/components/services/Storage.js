import axios from "axios";
import React, { Component } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import deviceStorage from "../services/deviceStorage";
import baseUrl from "../../../baseUrl";

export default class Storage extends Component {
  constructor() {
    super();
    this.state = {
      userId: 0,
      email: "",
      token: "",
      userEvents: [],
      userContacts: [],
    };
    this.populateArrayWithEventData = this.populateArrayWithEventData.bind(
      this
    );
  }
  async populateArrayWithEventData() {
    try {
      const events = await axios.get(`${baseUrl}/api/users/test/events`, {
        headers: {
          Authorizaton:
            "eyJhbGciOiJIUzI1NiJ9.TmF5ZWxpX0hlcnpvZzQyQHlhaG9vLmNvbQ.h2BXyk7RBRsI5eQoE7R-iArXxfVBQMlSbXBCIcLRHCg",
        },
      });
      const results = [...events];
      return results;
    } catch (err) {
      console.log(err, "It failed");
    }
  }
}

console.log(populateArrayWithEventData());

export const populateArrayWithEventData = async () => {
  try {
    const events = await axios.get(
      `${baseUrl}/api/users/test/events`,
      config.headers
    );
    const results = [...events];
    return results;
  } catch (err) {
    console.log(err, "It failed");
  }
};

export const registerUser = async () => {
  try {
    const login = await axios.post(`${baseUrl}/auth/login`, {
      email: "Nayeli_Herzog42@yahoo.com",
      password: "guest1",
    });
  } catch (err) {
    console.log(err);
  }
};
