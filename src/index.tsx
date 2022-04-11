import React, { useCallback, useEffect, useState } from 'react';

import { NativeModules, Platform, Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import DeviceInfo from 'react-native-device-info';

import { ScannerKey } from './config';
import type { Face, LibProps } from './types';

export default function CBiometric({
  bundleIdentifier,
  licenseKey,
  handleReady = () => undefined,
  errorView = () => undefined,
}: LibProps) {
  const deviceInfo = DeviceInfo;
  const MrzScanner = NativeModules.RNMrzscannerlib;
  const [isCameraSupported, setIsCameraSupported] = useState<boolean>(false);
  const [isLicenseWrong, setIsLicenseWrong] = useState<boolean | null>(null);

  const handleFaceDetected = useCallback(async (_faceArray: { faces: Face[] }): Promise<void> => {
    console.log('log--------faceArray', _faceArray.faces);
  }, []);

  const ready = useCallback(() => {
    handleReady(200);
  }, [handleReady]);

  useEffect(() => {
    console.log('log----bundleId', DeviceInfo.getBundleId());
    console.log('log----bundleIdentifier', bundleIdentifier);
    console.log('log----licenseKey', licenseKey);

    if (Platform.OS === 'android') {
      deviceInfo.isCameraPresent().then((isCameraPresent) => {
        setIsCameraSupported(isCameraPresent);
      });
    } else {
      NativeModules.RNCameraManager.getCameraIds().then((camera: Array<never>) => {
        if (camera.length > 2) setIsCameraSupported(true);
      });
    }
  }, [bundleIdentifier, deviceInfo, licenseKey]);

  useEffect(() => {
    if (isCameraSupported && isLicenseWrong === false) {
      MrzScanner.registerWithLicenseKey(ScannerKey);

      MrzScanner.setExtractIdBackEnabled(true);
      MrzScanner.setExtractFullPassportImageEnabled(true);
      MrzScanner.setScannerType(0);
      MrzScanner.startScanner();
    } else {
      MrzScanner.closeScanner();
    }
  }, [MrzScanner, deviceInfo, isCameraSupported, isLicenseWrong]);

  useEffect(() => {
    if (DeviceInfo.getBundleId() === bundleIdentifier) {
      setIsLicenseWrong(false);
      ready();
    } else {
      setIsLicenseWrong(true);
    }
  }, [bundleIdentifier, ready]);

  return (
    <View style={{ flex: 1 }}>
      {isCameraSupported && isLicenseWrong === false ? (
        <RNCamera
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          autoFocus="on"
          captureAudio={false}
          trackingEnabled
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
          defaultVideoQuality="288p"
          detectedImageInEvent={false}
          videoStabilizationMode="standard"
          zoom={0}
          maxZoom={0}
        />
      ) : null}

      {!isCameraSupported ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text>Camera is not supported</Text>
        </View>
      ) : null}

      {isLicenseWrong ? errorView('string') : null}
    </View>
  );
}
