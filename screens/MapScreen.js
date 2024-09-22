import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

export default function App() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.7749, // Latitud de San Francisco (puedes cambiarla)
          longitude: -122.4194, // Longitud de San Francisco
          latitudeDelta: 0.05, // Nivel de zoom
          longitudeDelta: 0.05, // Nivel de zoom
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});