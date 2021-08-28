import { useActionSheet } from '@expo/react-native-action-sheet';
//Gifted Chat expects actionSheet to be a function—that’s why PropTypes was imported above
//With PropTypes, you can define what the props you send to a component should look like
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { LogBox, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);

export function CustomActions(props) {
	const { showActionSheetWithOptions } = useActionSheet();

	//Let the user pick an image from the device's image library
	const pickImage = async () => {
		const library = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (library.status !== 'granted') return alert('Sorry, we need camera roll permissions to make this work!');

		try {
		} catch (e) {
			console.log(`pickImage err: ${e}`);
		}
		let image = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!image.cancelled) {
			const imageURL = await uploadImageFetch(image.uri);
			props.onSend({ image: imageURL });
		}
	};

	//Let the user take a photo with device's camera
	const takePhoto = async () => {
		try {
			const camera = await ImagePicker.requestCameraPermissionsAsync();
			const library = await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (camera.status && library.status !== 'granted') return alert(`Camera and photo library access is needed to use this functionality`);

			let result = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});
			// Get the image blob and add the image to the onSend prop
			if (!result.cancelled) {
				const imageURL = await uploadImageFetch(result.uri);
				props.onSend({ image: imageURL });
			}
		} catch (e) {
			console.log(`takePhoto err: ${e}`);
		}
	};

	//get the location of the user by using GPS
	const getLocation = async () => {
		try {
			const locationAccess = await Location.requestForegroundPermissionsAsync();

			if (locationAccess.status === 'granted') {
				let location = await Location.getCurrentPositionAsync({});

				if (location) {
					props.onSend({
						location: {
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
						},
					});
				}
			}
		} catch (e) {
			console.log(`getLocation err: ${e}`);
		}
	};

	//Upload images to firebase
	const uploadImageFetch = async (uri) => {
		try {
			const blob = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = function () {
					resolve(xhr.response);
				};
				xhr.onerror = function (e) {
					console.log(e);
					reject(new TypeError('Network request failed'));
				};
				xhr.responseType = 'blob';
				xhr.open('GET', uri, true);
				xhr.send(null);
			});

			const imageNameBefore = uri.split('/');
			const imageName = imageNameBefore[imageNameBefore.length - 1];
			//To store the blob into storage, you must first create a reference to the file you want to operate on
			const ref = firebase.storage().ref().child(`images/${imageName}`);
			//use put to store the content retrieved from the Ajax request
			const snapshot = await ref.put(blob);
			//close the connection
			blob.close();

			return await snapshot.ref.getDownloadURL();
		} catch (e) {
			console.log(`uploadImageFetch err: ${e}`);
		}
	};

	//function that handles communication features
	const onActionPress = () => {
		const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
		const cancelButtonIndex = options.length - 1;
		//context class is used to hand down data to the Actionsheet component
		showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
			},
			async (buttonIndex) => {
				switch (buttonIndex) {
					case 0:
						console.log('user wants to pick an image');
						return pickImage();
					case 1:
						console.log('user wants to take a photo');
						return takePhoto();
					case 2:
						console.log('user wants to get their location');
						return getLocation();
					default:
				}
			}
		);
	};

	return (
		<TouchableOpacity accessible={true} accessibilityLabel="More options" accessibilityHint="Let’s you choose to send an image or your geolocation." style={[styles.container]} onPress={onActionPress}>
			<View style={[styles.wrapper, props.wrapperStyle]}>
				<Text style={[styles.iconText, props.iconTextStyle]}>+</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 26,
		height: 26,
		margin: 2,
	},
	wrapper: {
		borderRadius: 13,
		borderColor: '#b2b2b2',
		borderWidth: 2,
		flex: 1,
	},
	iconText: {
		color: '#b2b2b2',
		fontWeight: 'bold',
		fontSize: 16,
		backgroundColor: 'transparent',
		textAlign: 'center',
		justifyContent: 'center',
	},
});

//Before you can use context, however, you have to create an object to define this context type.
CustomActions.contextTypes = {
	//define actionSheet as a function so that you can use in your onActionPress function
	actionSheet: PropTypes.func,
};
