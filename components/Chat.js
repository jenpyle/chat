import React from 'react';
import { View, Text, Button } from 'react-native';

export function Chat(props) {
  let name = props.route.params.name;
  let color = props.route.params.color;
  props.navigation.setOptions({ title: color });
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello Chat!</Text>
      <Button title="Go to Start" onPress={() => props.navigation.navigate('Start')} />
    </View>
  );
}
