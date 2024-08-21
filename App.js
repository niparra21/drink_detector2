import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
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
    base64:true,
  });

  if (!result.canceled) {
    // Obtener la imagen en base64
    const base64Image = result.assets[0].base64;

    try {
      // Configurar el cuerpo de la solicitud
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'LOGO_DETECTION',
                maxResults: 5,
              },
              {
                type: 'LABEL_DETECTION',
                maxResults: 5,
              },
              {
                type: 'TEXT_DETECTION',
                maxResults: 5,
              },
              {
                type: 'OBJECT_LOCALIZATION', // Detección de objetos
                maxResults: 10,
              },
            ],
          },
        ],
      };

      // Realizar la solicitud POST a la API de Google Cloud Vision
      const response = await axios.post(URL, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Obtener las etiquetas de la respuesta
      const labels = response.data.responses[0].labelAnnotations;
      const logoAnnotations = response.data.responses[0].logoAnnotations;
      const textAnnotations = response.data.responses[0].textAnnotations;
      const localizedObjectAnnotations = response.data.responses[0].localizedObjectAnnotations;

      // Mostrar los resultados

      if (logoAnnotations && logoAnnotations.length > 0) {
        let logoText = logoAnnotations.map(logo => `${logo.description}: ${Math.round(logo.score * 100)}%`).join('\n');
        if(logoText.toLowerCase().includes('the coca-cola company')){
          Alert.alert('Coca-Cola Detectado');
        } else {
          Alert.alert('Marca detectada:', logoText);
        }
      } else if (textAnnotations && textAnnotations.length > 0){
        const detectedText = textAnnotations[0].description;
        if(detectedText.toLowerCase().includes('tropical')){
          Alert.alert('Tropical Detectado');
        } else {
          Alert.alert('Texto detectado:', detectedText);
        }
      } else if(localizedObjectAnnotations && localizedObjectAnnotations.length > 0){
        objectResult = 'Objetos detectados:\n' + localizedObjectAnnotations.map(object => `${object.name}: ${Math.round(object.score * 100)}%`).join('\n');
        const foundGlass = localizedObjectAnnotations.find(object =>['cup', 'glass', 'mug', 'tableware'].includes(object.name.toLowerCase()));
        if(foundGlass){
          Alert.alert('Posible vaso de vidrio detectado');
        } else {
          Alert.alert('Objetos detectados:', objectResult);
        }
      }else if(labels){
        let resultText = labels.map(label => `${label.description}: ${Math.round(label.score * 100)}%`).join('\n');
        Alert.alert('Resultados:', resultText);
      } else {
        Alert.alert('No se detectó elementos para procesar');
      }

    } catch (error) {
      if (error.response) {
        console.error('Error en la solicitud:', error.response.data);
        Alert.alert('Error', `Código de error: ${error.response.status}\nMensaje: ${error.response.data.error.message}`);
      } else if (error.request) {
        console.error('Error en la solicitud:', error.request);
        Alert.alert('Error', 'No se recibió respuesta del servidor.');
      } else {
        console.error('Error', error.message);
        Alert.alert('Error', 'Hubo un problema al analizar la imagen.');
      }
    }
  } else {
    alert('You did not take any photo.');
  }
};

const pickImageAsync = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    quality: 1,
    base64: true, // Obtener imagen en base64
  });

  if (!result.canceled) {
    // Obtener la imagen en base64
    const base64Image = result.assets[0].base64;

    try {
      // Configurar el cuerpo de la solicitud
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'LOGO_DETECTION',
                maxResults: 5,
              },
              {
                type: 'LABEL_DETECTION',
                maxResults: 5,
              },
              {
                type: 'TEXT_DETECTION',
                maxResults: 5,
              },
              {
                type: 'OBJECT_LOCALIZATION', // Detección de objetos
                maxResults: 10,
              },
            ],
          },
        ],
      };

      // Realizar la solicitud POST a la API de Google Cloud Vision
      const response = await axios.post(URL, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Obtener las etiquetas de la respuesta
      const labels = response.data.responses[0].labelAnnotations;
      const logoAnnotations = response.data.responses[0].logoAnnotations;
      const textAnnotations = response.data.responses[0].textAnnotations;
      const localizedObjectAnnotations = response.data.responses[0].localizedObjectAnnotations;

      


      // Mostrar los resultados
      if (logoAnnotations && logoAnnotations.length > 0) {
        let logoText = logoAnnotations.map(logo => `${logo.description}: ${Math.round(logo.score * 100)}%`).join('\n');
        if(logoText.toLowerCase().includes('the coca-cola company')){
          Alert.alert('Coca-Cola Detectado');
        } else {
          Alert.alert('Marca detectada:', logoText);
        }
      } else if (textAnnotations && textAnnotations.length > 0){
        const detectedText = textAnnotations[0].description;
        if(detectedText.toLowerCase().includes('tropical')){
          Alert.alert('Tropical Detectado');
        } else {
          Alert.alert('Texto detectado:', detectedText);
        }
      } else if(localizedObjectAnnotations && localizedObjectAnnotations.length > 0){
        objectResult = 'Objetos detectados:\n' + localizedObjectAnnotations.map(object => `${object.name}: ${Math.round(object.score * 100)}%`).join('\n');
        const foundGlass = localizedObjectAnnotations.find(object =>['cup', 'glass', 'mug', 'tableware'].includes(object.name.toLowerCase()));
        if(foundGlass){
          Alert.alert('Posible vaso de vidrio detectado');
        } else {
          Alert.alert('Objetos detectados:', objectResult);
        }
      }else if(labels){
        let resultText = labels.map(label => `${label.description}: ${Math.round(label.score * 100)}%`).join('\n');
        Alert.alert('Resultados:', resultText);
      } else {
        Alert.alert('No se detectó elementos para procesar');
      }
      
    } catch (error) {
      if (error.response) {
        console.error('Error en la solicitud:', error.response.data);
        Alert.alert('Error', `Código de error: ${error.response.status}\nMensaje: ${error.response.data.error.message}`);
      } else if (error.request) {
        console.error('Error en la solicitud:', error.request);
        Alert.alert('Error', 'No se recibió respuesta del servidor.');
      } else {
        console.error('Error', error.message);
        Alert.alert('Error', 'Hubo un problema al analizar la imagen.');
      }
    }
  } else {
    alert('No seleccionaste ninguna imagen.');
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
