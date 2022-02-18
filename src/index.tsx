import React from 'react';
import { View } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default function CBiometric() {
  const handleFaceDetected = async (faceArray: any) => {
    const {faces} = faceArray;

    console.log('log--------faceArray', faces);
  };

  return (
    <View style={{flex: 1}}>
      <RNCamera
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        autoFocus={"on"}
        captureAudio={false}
        trackingEnabled={true}
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.none}
        faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onFacesDetected={handleFaceDetected}
        defaultVideoQuality={"288p"}
        detectedImageInEvent={false}
        videoStabilizationMode={"standard"}
        zoom={0}
        maxZoom={0}
      />
    </View>
  );
}
