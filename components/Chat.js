import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, KeyboardAvoidingView, LogBox, Platform, StyleSheet, Text, View } from 'react-native';
import { Bubble, Composer, Day, GiftedChat, InputToolbar, Send, SystemMessage } from 'react-native-gifted-chat';
import MapView from 'react-native-maps';
import { CustomActions } from './CustomActions';

LogBox.ignoreLogs(['Setting a timer', 'Animated.event now requires a second argument for options']);

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
				user: {
					_id: data.user._id,
					name: data.user.name,
					avatar: data.user.avatar,
				},
				image: data.image || null,
				location: data.location || null,
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
				image: m.image ? m.image : null,
				location: m.location ? m.location : null,
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
		//return a function that will be run on cleanup
		isMounted.current = false;
	}, []); // checks for changes in the values in this array

	//updates the asyncStorage messages when new messages are added
	useEffect(() => {
		props.navigation.setOptions({
			title: name,
			headerStyle: {
				backgroundColor: accentColor2,
			},
			headerTintColor: textColor,
		});

		if (isMounted.current) {
			console.log('Saving messages');
			saveMessages();
		}
		//return a function that will be run on cleanup.
		isMounted.current = false;
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
				paddingHorizontal: 12,
				marginLeft: 0,
			}}
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

	const renderCustomActions = (props) => <CustomActions {...props} />;

	const renderCustomView = (props) => {
		const { currentMessage } = props;
		if (currentMessage.location) {
			return (
				<MapView
					style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
					region={{
						latitude: currentMessage.location.latitude,
						longitude: currentMessage.location.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			);
		}
		return null;
	};
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
			{messages.length < 1 ? null : <Button onPress={deleteMessages} title="Delete all test messages" color="#DB7093" accessibilityLabel="Learn more about this purple button" />}
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
				renderActions={renderCustomActions}
				renderInputToolbar={renderInputToolbar}
				renderComposer={renderComposer}
				renderCustomView={renderCustomView}
				renderSend={renderSend}
			/>
			{Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
		</View>
	);
}
