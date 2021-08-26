import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView, Image, Button } from 'react-native';
import { GiftedChat, InputToolbar, Day, Bubble, SystemMessage, Actions, Composer, Send } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);

const firebase = require('firebase');
require('firebase/firestore');
//constructor in your chat class that will initialize the Firestore app.
//config info from Firestore database
const firebaseConfig = {
	apiKey: 'AIzaSyABSvLXkjpOGxmd909Iki1qphX4RbVdt4Q',
	authDomain: 'chat-e2ce3.firebaseapp.com',
	projectId: 'chat-e2ce3',
	storageBucket: 'chat-e2ce3.appspot.com',
	messagingSenderId: '169801407263',
	appId: '1:169801407263:web:04a283b74c1236bcf0ae2a',
	measurementId: 'G-VXQ713GGLG',
};
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
// Create reference to messages db
//a ref to “messages” collection in cloud firebase.This stores and retrieves the chat messages your users send.
const referenceChatMessages = db.collection('messages');

export function Chat(props) {
	const [text, setText] = useState('');
	const [messages, setMessages] = useState([]);
	const [uid, setUid] = useState('');
	const [online, setOnline] = useState(false);
	const isMounted = useRef(false);
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

	// referenceMessageUser = null;

	const onCollectionUpdate = (querySnapshot) => {
		const messages = [];
		// go through each document
		querySnapshot.forEach((doc) => {
			// get the QueryDocumentSnapshot's data
			let data = doc.data();
			messages.push({
				_id: data._id,
				text: data.text,
				createdAt: data.createdAt.toDate(),
				user: data.user,
			});
		});
		//all the data from the snapshot of the database is stored in the state
		setMessages(messages);
	};

	const addMessage = (currentMessage) => {
		const m = currentMessage;
		try {
			db.collection('messages').add({
				_id: m._id,
				text: m.text ? m.text : null,
				createdAt: m.createdAt,
				user: {
					_id: m.user._id,
					name: m.user.name,
					avatar: m.user.avatar,
				},
			});
		} catch (err) {
			console.log(err);
		}
	};

	const getMessages = async () => {
		let messages = '';
		try {
			console.log('in getMEssages');
			//read the messages in storage using getItem method, if none then set messages to be empty
			messages = (await AsyncStorage.getItem('messages')) || [];
			//asyncStorage can only store strings, use JSON.parse to convert string back to object
			setMessages(JSON.parse(messages));
		} catch (error) {
			console.log(error.message);
		}
	};

	// Save messages
	const saveMessages = async () => {
		try {
			await AsyncStorage.setItem('messages', JSON.stringify(messages));
			console.log('Messages saved to asyncStorge', messages);
		} catch (error) {
			console.log(error.message);
		}
	};

	// Delete messages
	const deleteMessages = async () => {
		try {
			await AsyncStorage.removeItem('messages');
			console.log('deleted all messages');
			setMessages([]);
		} catch (error) {
			console.log(error.message);
		}
	};

	useEffect(() => {
		// getMessages();
		let unsubscribeMessages;
		let authUnsubscribe;
		NetInfo.fetch().then((connection) => {
			if (connection.isConnected) {
				setOnline(true);
				console.log('Online');

				//first check whether the user is signed in. If they’re not, you need to create a new user
				//authenticate users anonymously onAuthStateChanged is an observer called when user's sign-in state changes and returns an unsubscribe function
				authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
					if (!user) {
						//calls the firebase auth service
						await firebase.auth().signInAnonymously();
					}
					setUid(user.uid);
					//listen for collection changes across documents that belong to the current user and create updated snapshot of the collection
					unsubscribeMessages = referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(onCollectionUpdate);
				});

				//componentWillUnmount
				return () => {
					// stop listening to authentication
					authUnsubscribe();
					// stop listening for changes
					unsubscribeMessages();
				};
			} else {
				setOnline(false);
				console.log('Offline');
				getMessages();
			}
		});
	}, []); // checks for changes in the values in this array

	//updates the asyncStorage messages when new messages are added
	useEffect(() => {
		if (isMounted.current) {
			console.log('Saving messages');
			saveMessages();
		}

		isMounted.current = true;
	}, [messages]);

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

	const renderSystemMessage = (props) => <SystemMessage {...props} textStyle={{ color: systemTextColor, fontWeight: '900' }} />;

	const renderInputToolbar = (props) =>
		online ? (
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
		) : (
			false
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

	// Use Callback hook prevent this method from be recreated every render.
	const onSend = useCallback((newMessages = []) => {
		setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
		addMessage(newMessages[0]);
		saveMessages();
	}, []); //parameter previousState, which is a reference to the component’s state at the time the change is applied
	//message a user has just sent gets appended to the state messages so that it can be displayed in the chat.

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: 'center',
			backgroundColor: theme,
		},
	});

	return (
		<View style={styles.container}>
			<Button onPress={deleteMessages} title="Delete all test messages" color="#FF0000" accessibilityLabel="Learn more about this purple button" />
			<GiftedChat
				renderDay={renderDay}
				messages={messages}
				text={text}
				onInputTextChanged={setText}
				onSend={onSend}
				user={{
					_id: uid,
					name: name,
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
