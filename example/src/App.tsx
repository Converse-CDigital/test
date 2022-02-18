import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import CBiometric from 'react-native-c-biometric';

export default function App() {

  return (
    <View style={styles.container}>
      <CBiometric />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});
