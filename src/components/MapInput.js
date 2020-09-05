import React, { Component } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { apiKey } from "../../secret";

class MapInput extends Component {
  render() {
    return (
      <GooglePlacesAutocomplete
        placeholder="Where ya buds at?"
        minLength={2}
        returnKeyType={"search"}
        listViewDisplayed={false}
        fetchDetails={true}
        onPress={(data, details = null) => {
          //details is provided when fetchDetails = true
          this.props.notifyChange(details.geometry.location);
        }}
        query={{
          key: apiKey,
          language: "en",
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={200}
      />
    );
  }
}

export default MapInput;
