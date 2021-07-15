import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export function Chat(props) {
  let name = props.route.params.name;
  let color = props.route.params.color;
  props.navigation.setOptions({ title: name });
  return (
    <View style={styles.container}>
      <Text>Hello Chat!</Text>
      <Button title="Go to Start" onPress={() => props.navigation.navigate('Start')} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
