import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export function Start(props) {
	const [name, setName] = useState('');
	const [themeColor, setThemeColor] = useState('#090C08');
	const [textColor, setTextColor] = useState('#090C08');
	const [accentColor, setAccentColor] = useState('#020FC8F');
	const [accentColor2, setAccentColor2] = useState('#020FC8F');
	const [systemTextColor, setSystemTextColor] = useState('#FFD100');
	const [rightBubble, setRightBubble] = useState('#F7AEF8');
	const [leftBubble, setLeftBubble] = useState('#F2A900');

	const image = require('../assets/Background-Image.png');

	return (
		<ImageBackground source={image} resizeMode="cover" style={styles.image}>
			<View style={styles.container}>
				<Text style={styles.title}>Hello World</Text>
				<View style={styles.startChattingContainer}>
					<View style={styles.yourNameContainer}>
						<TextInput
							accessible={true}
							accessibilityLabel="User name input"
							accessibilityHint="Type your name here"
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
							onPress={() => {
								setThemeColor('#c1fba4'), setTextColor('#ff206e'), setAccentColor('#e4c1f9'), setAccentColor2('#ffef9f'), setSystemTextColor('#432371'), setRightBubble('#90f1ef'), setLeftBubble('#ffd6e0');
							}}
							style={styles.color1}
						></TouchableOpacity>
						<TouchableOpacity
							accessible={true}
							accessibilityLabel="Theme color"
							accessibilityHint="Let’s you choose to change the theme color of chat message"
							onPress={() => {
								setThemeColor('#eec4dd'), setTextColor('#a32265'), setAccentColor('#a32265'), setAccentColor2('#fcd6f9'), setSystemTextColor('#e0fbfc'), setRightBubble('#f4e6f1'), setLeftBubble('#f4e6f1');
							}}
							// onPress={() => setThemeColor('#474056')}
							style={styles.color2}
						></TouchableOpacity>
						<TouchableOpacity
							accessible={true}
							accessibilityLabel="Theme color"
							accessibilityHint="Let’s you choose to change the theme color of chat message"
							// onPress={() => setThemeColor('#8A95A5')}
							onPress={() => {
								setThemeColor('#fabb6b'), setTextColor('#fffffa'), setAccentColor('#fedc97'), setAccentColor2('#faf1a1'), setSystemTextColor('#e64c8f'), setRightBubble('#ffc43d'), setLeftBubble('#f8af86');
							}}
							style={styles.color3}
						></TouchableOpacity>
						<TouchableOpacity
							accessible={true}
							accessibilityLabel="Theme color"
							accessibilityHint="Let’s you choose to change the theme color of chat message"
							onPress={() => {
								setThemeColor('#a4c3b2'), //dark
									setTextColor('#6b9080'), //dark
									setAccentColor('#bee3db'), //any
									setAccentColor2('#f6fff8'), //light
									setSystemTextColor('#6b9080'), //very light or dark
									setRightBubble('#eaf4f4'), //middle
									setLeftBubble('#cce3de'); //middle
							}}
							style={styles.color4}
						></TouchableOpacity>
					</View>
					<TouchableOpacity
						accessible={true}
						accessibilityLabel="Start Chatting"
						accessibilityHint="Let you start chatting"
						style={styles.chatStartButton}
						onPress={() =>
							props.navigation.navigate('Chat', {
								name: name,
								themeColor: themeColor,
								textColor: textColor,
								accentColor: accentColor,
								accentColor2: accentColor2,
								systemTextColor: systemTextColor,
								rightBubble: rightBubble,
								leftBubble: leftBubble,
							})
						}
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
		minHeight: 200,
		backgroundColor: '#FFFFFF',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		marginBottom: 15,
	},
	yourNameContainer: {
		flexDirection: 'row',
		width: '88%',
		height: 50,
		borderColor: '#757083',
		borderWidth: 2,
		borderRadius: 3,
	},
	yourName: {
		paddingLeft: 15,
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
		backgroundColor: '#eec4dd',
	},
	color3: {
		width: 50,
		height: 50,
		borderRadius: 50,
		backgroundColor: '#fabb6b',
	},
	color4: {
		width: 50,
		height: 50,
		borderRadius: 50,
		backgroundColor: '#a4c3b2',
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
