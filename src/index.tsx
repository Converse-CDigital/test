import React, { useCallback, useEffect, useState } from 'react';

import { NativeModules, Platform, Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import DeviceInfo from 'react-native-device-info';

import DocumentScanner from './document-scanner';
import type { IFace, ILibProps } from './types';

export default function CBiometric({
  bundleIdentifier,
  licenseKey,
  handleReady = () => undefined,
  errorView = () => undefined,
  documentScannerView = () => undefined,
}: ILibProps) {
  const deviceInfo = DeviceInfo;
  const [isCameraSupported, setIsCameraSupported] = useState<boolean>(false);
  const [isLicenseOk, setIsLicenseOk] = useState<boolean | null>(null);

  const handleFaceDetected = useCallback(async (_faceArray: { faces: IFace[] }): Promise<void> => {
    console.log('log--------faceArray', _faceArray.faces);
  }, []);

  const ready = useCallback(() => {
    handleReady(200);
  }, [handleReady]);

  useEffect(() => {
    console.log('log----bundleId', deviceInfo.getBundleId());
    console.log('log----bundleIdentifier', bundleIdentifier);
    console.log('log----licenseKey', licenseKey);

    if (Platform.OS === 'android') {
      deviceInfo.isCameraPresent().then((isCameraPresent) => {
        setIsCameraSupported(isCameraPresent);
      });
    } else if (NativeModules.RNCameraManager)
      NativeModules.RNCameraManager.getCameraIds().then((camera: Array<never>) => {
        if (camera.length > 2) setIsCameraSupported(true);
      });
  }, [bundleIdentifier, deviceInfo, licenseKey]);

  useEffect(() => {
    if (DeviceInfo.getBundleId() === bundleIdentifier) {
      setIsLicenseOk(false);
      ready();
    } else {
      setIsLicenseOk(true);
    }
  }, [bundleIdentifier, ready]);

  return (
    <View style={{ flex: 1 }}>
      {isCameraSupported && isLicenseOk === false && false ? (
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

      {isCameraSupported && !isLicenseOk ? (
        <DocumentScanner documentScannerView={documentScannerView} />
      ) : null}

      {!isCameraSupported ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text>Camera is not supported</Text>
        </View>
      ) : null}

      {isLicenseOk ? errorView('string') : null}
    </View>
  );
}
