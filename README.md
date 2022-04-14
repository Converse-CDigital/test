# react-native-c-biometric

user identification

https://mrzscanner.com/v1.x/knowledge/react-native mrzscanner documentation

This package works only in real devices.

## Installation

```sh
npm install react-native-c-biometric
```
```sh
yarn add react-native-c-biometric
```

## Usage

```js
import CBiometric from "react-native-c-biometric";

// ...

<CBiometric
  bundleIdentifier="am.cdigital.biometric" //or you can use react-native-device-info -> DeviceInfo.getBundleId()
  licenseKey="hgj23g4jh2g3h4jg23hjg4hj2g3jh4gjh23g4ghj23g4jh"
  handleReady={(code) => console.log('log----------', code)}
  errorView={(error) => (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
      }}
    >
      <Text style={{ color: 'white' }}>{error}</Text>
    </View>
  )}
  documentScannerView={(handleDocumentScan: (documentType: number) => void) => (
    <View>
      <Button title="Passport Scanner" onPress={() => handleDocumentScan(0)} />
      <Button title="ID Card Scanner" onPress={() => handleDocumentScan(1)} />
    </View>
  )}
/>
```

## Document Type Enum

```ts
enum DocumentType {
  passport,
  idCardFrontSide,
  idCardBackSide,
}
```

## iOS - other required steps
Add permissions with usage descriptions to your app *Info.plist*:

```js
<!-- Required with iOS 10 and higher -->
<key>NSCameraUsageDescription</key>
<string>Your message to user when the camera is accessed for the first time</string>

<!-- Required with iOS 11 and higher: include this only if you are planning to use the camera roll -->
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Your message to user when the photo library is accessed for the first time</string>

<!-- Include this only if you are planning to use the camera roll -->
<key>NSPhotoLibraryUsageDescription</key>
<string>Your message to user when the photo library is accessed for the first time</string>
```

## For IFace Detection:
Add dependency towards react-native-camera in your Podfile with subspecs using one of the following:

```js
pod 'react-native-camera', path: '../node_modules/react-native-camera', subspecs: [
  'FaceDetectorMLKit'
]
```

Additional information in case of problems
If you see build errors like ld: symbol(s) not found for architecture armv7 you will need to exclude armv7 arch in your Xcode (Xcode -> Build Setting -> Excluded Architectures -> Add 'armv7' for 'Any iOS SDK' ).


## Android - other required steps
Add permissions to your app *android/app/src/main/AndroidManifest.xml* file:

```js
<!-- Required -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Include this only if you are planning to use the camera roll -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

Insert the following lines in *android/app/build.gradle*:

```js
android
{
  ...
  defaultConfig
  {
    ...
    missingDimensionStrategy 'react-native-camera', 'mlkit' // <--- insert this line
  }
}
```

## Setting up MLKit

If you don't use any other Firebase component in your project

1. Add the folowing to project level *build.gradle*:

```js
buildscript {
  dependencies {
  // Add this line
  classpath 'com.google.android.gms:strict-version-matcher-plugin:1.2.1' // <--- you might want to use different version
  }
}
```
2. add to the bottom of *android/app/build.gradle* file

```js
apply plugin: 'com.google.android.gms.strict-version-matcher-plugin'
```

If you have Firebase integrated already

1. Add the folowing to project level *build.gradle*:

```js
buildscript {
  dependencies {
  // Add this line
  classpath 'com.google.gms:google-services:4.3.3'  // Google Services plugin(you might want to use different version)
  }
}
```

2. add to the bottom of *android/app/build.gradle* file

```js
apply plugin: 'com.google.gms.google-services'  // Google Services plugin
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
