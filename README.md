# Chat App
A Native Android "Chat" application using React Native, Expo, and Google Firestore Database. The app provide users with a chat interface and options to share images and their
location. 

*See the [Detailed Description](#detailed-description) below for more information*
<p align="center">
<img alt="Demo video" src="assets/finalDemoGif.gif" height="600">
</p>

## Features
- A page where users can enter their name and choose a background color for the chat screen
before joining the chat.
- A page displaying the conversation, as well as an input field and submit button.
- The chat must provide users with two additional communication features: sending images
and location data.
- Data gets stored online and offline.

## Technical

- React Native.
- Developed using Expo.
- Chat conversations stored in Google Firestore Database.
- Users can pick and send images from the phone’s image library.
- Users take pictures with the device’s camera app, and send it.
- Images stored in Firebase Cloud Storage.
- Read and send the user’s location data.

## Detailed Description
The app was written in **[React Native](https://reactnative.dev/)**, a JavaScript framework for writing native applications for iOS and Android. A CLI tool, **[Expo](https://docs.expo.dev/)**, to set up and run the project. Testing on my computer was done using **[Android Studio](https://developer.android.com/studio)** as an Android emulator, and on my phone using the **[Expo Go app](https://expo.dev/client)**.

The chat screen’s layout, styling, and chat functionalities utilized **[Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat)**—a React Native library created specifically for developing chat apps. This library was used to create a chat interface, which includes a text input for typing messages and speech bubbles for sent and received messages.

**[Google Firebase’s Cloud Firestore database](https://firebase.google.com/products/storage/)**(a NoSQL database) allows for the app to have real-time data for messages and media.

***Real-time data*** (RTD) is information stored in a database that’s delivered to a user without delay, which is necessary for a chat app (another example is Google Docs, where multiple users can work within the same doc at the same time, and all updates made in that document are displayed instantaneously (i.e., in “real-time”).

As the Chat app utilizes **Cloud Firestore**, this not only handles the real-time connection between clients and the server, but also all the data storage (and data transfer) for the app. It basically provides the means for real-time data transfer between users and the database, allowing users to store and retrieve data in a streamlined and accessible way, without the developer having to write all the code from scratch. **Cloud Firestore** works by synchronizing data across multiple devices (iOS, Android, and web) and storing it in Firebase’s cloud.

Along with that, each message follows a format that’s accepted by **Gifted Chat** so there’s no need to manipulate or change anything when moving the data back and forth between the app and database. 

**[asyncStorage](https://github.com/react-native-async-storage/async-storage)** is used to give user offline access to their sent/received messages and **[NetInfo](https://docs.expo.dev/versions/latest/sdk/netinfo/)** is used to check whether or not the user is online. If the user is offline, the app will load and display the messages from **asyncStorage**, along with hiding the inputToolbar. If the user is online the app will authenticate the user via **Firebase**, load messages from **Firebase**, and save the new messages locally via **asyncStorage**.

Expo’s **[Permission API](https://docs.expo.dev/versions/v38.0.0/sdk/permissions/)**, **[ImagePicker API](https://docs.expo.dev/versions/latest/sdk/imagepicker/)**, and **[Location API](https://docs.expo.dev/versions/latest/sdk/location/)** are used to to ask the user to enable access to specific features like their camera, media, and location and then retrieve or access the corresponding native features or data on the device.

## Setting Up Expo to run and use the app

- To set up Expo and your development environment, you’ll need your terminal and Node.

- To start Expo, you’ll need to install the Expo Command Line Interface (CLI) on your machine. To do so, open up your terminal and type in the following command:

```
npm install expo-cli --global
```

- Next, you’ll need the Expo app for your phone to run your project on. Search for the Expo app in the relevant app store for your device (iOS or Android). The app icon should look something like this:

![Alt text](/assets/expo.png?raw=true 'ChatTime')

- Now, you need an Expo account. Head over to the [Expo signup page](https://expo.io/) and follow the instructions to create an account. Once that’s done, you should be able to log in to Expo from your browser and mobile app. At some point, you’ll be asked to log in to the Expo CLI, so do that, too, when it comes up:

- This is how the Expo app will look on your phone right after installation:

![Alt text](/assets/screen.png?raw=true 'ChatTime')

- After installing expo-cli and creating account clone or download the repository, open it with Visual Studio Code then open terminal and install all dependency.

### Install Dependencies

```
npm install
```

### Run

- You can run it on either way using the terminal

```
npm start
```

```
expo start
```

- And after running the app just scan the QR code to your Android or IOS make sure you install expo on your mobile devices to run it.
- This is how the terminal will look like after running the app

![Alt text](/assets/terminal.png?raw=true 'ChatTime')

- That's it happy coding!

**Note! this is the easiest way to run and test expo application**

- If you want to explore some other way or test on your local machine you should download Android Studio for Android devices and XCode for IOS devices, make sure you have a lot of space on your local drive and a caveat with this is the complexity. Below are the link with detailed steps on installing it.

- [Expo IOS Documentation](https://docs.expo.io/workflow/ios-simulator/)
- [Expo Android Documentation](https://docs.expo.io/workflow/android-studio-emulator/)
- Version: 1.0.0
- License: MIT
- Author: Rico John Dato-on
