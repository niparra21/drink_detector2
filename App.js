import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from './components/Button';
import axios from 'axios';

const API_KEY = 'AIzaSyCaZliArhyJUaWzXK9WLCW9es8K_vEwPow';
const URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

export default function App() {
  return (
    <View style={styles.container}>
      <Text style ={styles.title}>
        Drink detector
      </Text>
      <View style={styles.footerContainer}>
        <Button label="Choose a photo" onPress={pickImageAsync} />
        <View style={styles.spacer}></View>
        <Button label="Use this photo" onPress={takePhotoAsync} />
      </View>
      <StatusBar style="auto" />
    </View>
    
  );
}

const takePhotoAsync = async () => {
  // Solicitar permisos para usar la cámara
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    alert('Permission to access camera is required!');
    return;
  }

  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    console.log(result);
  } else {
    alert('You did not take any photo.');
  }
};

const pickImageAsync = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    console.log(result);//Original
    // * * * * *
    const base64Image = result.assets[0].base64;
    try {
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'LABEL_DETECTION', // Tipo de análisis que deseas realizar
                maxResults: 5, // Número máximo de resultados
              },
            ],
          },
        ],
      };

      const response = await axios.post(URL, requestBody);
      const labels = response.data.responses[0].labelAnnotations;

      // Mostrar resultados
      if (labels) {
        let resultText = labels.map(label => `${label.description}: ${Math.round(label.score * 100)}%`).join('\n');
        Alert.alert('Resultados:', resultText);
      } else {
        Alert.alert('No se detectaron etiquetas.');
      }
    } catch (error) {
      console.error('Error al analizar la imagen:', error);
      Alert.alert('Error', 'Hubo un problema al analizar la imagen.');
    }
    // * * * * *
  } else {
    alert('You did not select any image.');
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffebd1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#000000',
    fontSize: 24, // Tamaño del texto más grande
    marginBottom: 20, // Espacio entre el texto y los botones
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  spacer: {
    height: 20, // Espacio entre los botones
  },
});
