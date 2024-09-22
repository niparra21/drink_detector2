import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios'; // Librería para hacer solicitudes HTTP

export default function App() {
  const [location, setLocation] = useState(null); // Estado para almacenar la ubicación del usuario
  const [supermarkets, setSupermarkets] = useState([]); // Estado para almacenar los supermercados cercanos

  useEffect(() => {
    (async () => {
      // Solicitar permiso de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      // Obtener la ubicación actual del usuario
      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);

      // Hacer solicitud a Google Places API para obtener supermercados cercanos
      const apiKey = 'AIzaSyA9SBeKW6wW_QlhElbZ5LwrZqWA0DhbaoI'; // Inserta tu clave de API de Google Places
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.coords.latitude},${userLocation.coords.longitude}&radius=8000&type=supermarket&key=${apiKey}`;
      
      try {
        const response = await axios.get(url);
        console.log(response.data); // Verifica si hay errores en la respuesta
        setSupermarkets(response.data.results); // Almacena los supermercados en el estado
      } catch (error) {
        console.error("Error fetching data from Places API:", error);
      }
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Muestra la ubicación del usuario */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Tú estás aquí"
          pinColor="blue"
        />

        {/* Muestra los supermercados cercanos */}
        {supermarkets.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            title={place.name}
            description={place.vicinity}
          />
        ))}
      </MapView>
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
