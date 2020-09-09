const axios = require("axios");
const deviceStorage = require("../services/deviceStorage");
const baseUrl = require("../../baseUrl");
const config = {
  headers: {
    Authorizaton:
      "eyJhbGciOiJIUzI1NiJ9.TmF5ZWxpX0hlcnpvZzQyQHlhaG9vLmNvbQ.h2BXyk7RBRsI5eQoE7R-iArXxfVBQMlSbXBCIcLRHCg",
  },
};

const registerUser = () => {
  const { email, password, password_confirmation } = this.state;

  this.setState({ error: "", loading: true });

  // NOTE HTTP is insecure, only post to HTTPS in production apps

  axios
    .post("http://localhost:4000/api/v1/sign_up", {
      user: {
        email: email,
        password: password,
        password_confirmation: password_confirmation,
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

const populateArrayWithEventData = async () => {
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

console.log(populateArrayWithEventData());

module.exports = populateArrayWithEventData;
