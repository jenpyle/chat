import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { clockRunning } from 'react-native-reanimated';

export function Start(props) {
  const [name, setName] = useState('');
  const [themeColor, setThemeColor] = useState('#090C08');
  const image = require('../assets/Background-Image.png');

  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <View style={styles.container}>
        <Text style={styles.title}>Hello World</Text>
        <View style={styles.startChattingContainer}>
          <View style={styles.yourNameContainer}>
            <TextInput
              style={styles.yourName}
              onChangeText={(name) => {
                setName(name);
              }}
              value={name}
              placeholder="Your Name"
            />
          </View>
          <Text style={styles.chooseThemeText}>Choose Background Color:</Text>
          <View style={styles.chooseThemeContainer}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Theme color"
              accessibilityHint="Let’s you choose to change the theme color of chat message"
              onPress={() => setThemeColor('#090C08')}
              style={styles.color1}
            ></TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Theme color"
              accessibilityHint="Let’s you choose to change the theme color of chat message"
              onPress={() => setThemeColor('#474056')}
              style={styles.color2}
            ></TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Theme color"
              accessibilityHint="Let’s you choose to change the theme color of chat message"
              onPress={() => setThemeColor('#8A95A5')}
              style={styles.color3}
            ></TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Theme color"
              accessibilityHint="Let’s you choose to change the theme color of chat message"
              onPress={() => setThemeColor('#B9C6AE')}
              style={styles.color4}
            ></TouchableOpacity>
          </View>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Start Chatting"
            accessibilityHint="Let you start chatting"
            style={styles.chatStartButton}
            onPress={() => props.navigation.navigate('Chat', { name: name, color: themeColor })}
          >
            <Text style={styles.chatStartButtonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    height: '50%',
    fontSize: 45,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  startChattingContainer: {
    flex: 1,
    width: '88%',
    height: '44%',
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  yourNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '88%',
    height: '3rem',
    borderColor: '#757083',
    borderWidth: 2,
    borderRadius: 3,
  },
  yourName: {
    paddingLeft: '0.5rem',
    fontSize: 16,
    height: '100%',
    width: '100%',
    fontWeight: '300',
    opacity: 50,
    color: '#757083',
  },
  chooseThemeText: {
    width: '88%',
    fontSize: 16,
    color: '#757083',
    opacity: 100,
  },
  chooseThemeContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '88%',
    justifyContent: 'space-evenly',
  },
  color1: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#090C08',
  },
  color2: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#474056',
  },
  color3: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#8A95A5',
  },
  color4: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#B9C6AE',
  },
  chatStartButton: {
    marginTop: 10,
    backgroundColor: '#757083',
    width: '88%',
    padding: 15,
  },
  chatStartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF',
  },
});
