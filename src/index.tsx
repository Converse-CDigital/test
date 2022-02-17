import React from 'react';
import { Text, View } from 'react-native';

import { Camera, useCameraDevices } from 'react-native-vision-camera';

export default function CBiometric() {
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;

  return (
    <View>
      {device == null ? <Text>Camera not found</Text> : <Camera device={device} isActive={true} />}
    </View>
  );
}
