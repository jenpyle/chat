import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView, Image } from 'react-native';
import {
  GiftedChat,
  InputToolbar,
  Day,
  Bubble,
  SystemMessage,
  Actions,
  Composer,
  Send,
} from 'react-native-gifted-chat';

export function Chat(props) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  let name = props.route.params.name;
  let theme = props.route.params.themeColor;
  let textColor = props.route.params.textColor;
  let accentColor = props.route.params.accentColor;
  let accentColor2 = props.route.params.accentColor2;
  let systemTextColor = props.route.params.systemTextColor;
  let leftBubble = props.route.params.leftBubble;
  let rightBubble = props.route.params.rightBubble;
  props.navigation.setOptions({
    title: name,
    headerStyle: {
      backgroundColor: accentColor2,
    },
    headerTintColor: textColor,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // alignItems: 'center',!!BAD!
      justifyContent: 'center',
      backgroundColor: theme,
    },
  });

  const renderBubble = (props) => (
    //create renderBubble function after adding the renderBubble prop in the GiftedChat component
    //the altered Bubble component is returned from GiftedChat
    <Bubble
      {...props}
      //inheriting props
      wrapperStyle={{
        //Bubble component is given a new wrapperStyle
        right: {
          //left and right speech bubbles can be targeted
          backgroundColor: rightBubble,
          borderWidth: 1,
          borderColor: accentColor,
        },
        left: {
          backgroundColor: leftBubble,
          borderWidth: 1,
          borderColor: accentColor,
        },
      }}
      textStyle={{
        right: {
          color: textColor,
        },
        left: {
          color: textColor,
        },
      }}
    />
  );

  const renderSystemMessage = (props) => (
    <SystemMessage {...props} textStyle={{ color: systemTextColor, fontWeight: '900' }} />
  );

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: rightBubble,
        paddingTop: 4,
        borderTopWidth: 2,
        borderTopColor: accentColor,
      }}
      primaryStyle={{ alignItems: 'center' }}
    />
  );

  const renderComposer = (props) => (
    //the inner text input space
    <Composer
      {...props}
      textInputStyle={{
        color: '#000000',
        backgroundColor: accentColor2,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: theme,
        paddingTop: 8.5,
        paddingHorizontal: 12,
        marginLeft: 0,
      }}
    />
  );

  const renderActions = (props) => (
    <Actions
      {...props}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 0,
      }}
      icon={() => (
        <Image
          style={{ width: 32, height: 32, borderRadius: 10 }}
          source={{
            uri: 'https://placeimg.com/32/32/any',
          }}
        />
      )}
      options={{
        'Choose From Library': () => {
          console.log('Choose From Library');
        },
        Cancel: () => {
          console.log('Cancel');
        },
      }}
      optionTintColor="#222B45"
    />
  );

  const renderSend = (props) => (
    <Send
      {...props}
      disabled={!props.text}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
        textColor: '#c21e65',
      }}
    >
      <Text accessible={true} accessibilityLabel="Send message" accessibilityHint="Press to send your message">
        SEND
      </Text>
    </Send>
  );

  const renderDay = (props) => <Day {...props} textStyle={{ color: systemTextColor }} />;

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: `Hello, ${name}! Welcome to Chat!`,
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []); // checks for changes in the values in this array

  const onSend = (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  }; //parameter previousState, which is a reference to the component’s state at the time the change is applied
  //message a user has just sent gets appended to the state messages so that it can be displayed in the chat.

  return (
    <View style={styles.container}>
      <GiftedChat
        renderDay={renderDay}
        messages={messages}
        text={text}
        onInputTextChanged={setText}
        onSend={onSend}
        user={{
          _id: 1,
          name: 'Aaron',
          avatar: 'https://placeimg.com/150/150/any',
        }}
        renderBubble={renderBubble} //renderBubble prop, looked up props in documentation
        renderSystemMessage={renderSystemMessage}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderActions={renderActions}
        renderSend={renderSend}
      />

      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
}
