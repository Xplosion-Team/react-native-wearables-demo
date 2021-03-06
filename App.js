import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Data } from "react-native-wearables";
import { VictoryArea, VictoryChart, VictoryAxis } from "victory-native";
import { histogram } from "d3-array";

export default class App extends React.Component {
  state = {
    error: null,
    samples: null
  };

  componentDidMount() {
    Data.authorize([Data.Types.heartRateBpm])
      .then(() =>
        Data.read(Data.Types.heartRateBpm, {
          startDate: new Date("2018-05-01"),
          endDate: new Date()
        })
      )
      .then(samples => console.log(samples) || this.setState({ samples }))
      .catch(error => console.error(error) || this.setState({ error }));
  }

  render() {
    const { error, samples } = this.state;

    let child;
    if (error) {
      child = <Text>Something went wrong :(</Text>;
    } else if (samples && samples.length === 0) {
      child = <Text>No data.</Text>;
    } else if (samples) {
      const bins = histogram()(samples.map(s => s.value));
      child = <React.Fragment>
          <Text>Heart rate over the last 10 days</Text>
          <VictoryChart>
            <VictoryArea
              data={bins.map(bin => ({ x: bin.x0, y: bin.length }))}
            />
            <VictoryAxis />
          </VictoryChart>
      </React.Fragment>;
    } else {
      child = <Text>Reading data...</Text>;
    }

    return <View style={styles.container}>{child}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
