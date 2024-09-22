import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '../components/Button';
import axios from 'axios';
import * as Font from 'expo-font';
import { createDrawerNavigator } from '@react-navigation/drawer';

  

const API_KEY = 'AIzaSyCaZliArhyJUaWzXK9WLCW9es8K_vEwPow';
const URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
      });
      setFontLoaded(true);
    }
    loadFont();
  }, []);

  if (!fontLoaded) {
    return null; // Mostrar un indicador de carga si la fuente no se ha cargado
  }


  return (
    <View style={styles.container}>
      <View style={styles.inicioContainer}></View>
      <View style={styles.tituloContainer}>
        <Text style ={styles.title}>
          Drink detector
        </Text>
        
      </View>

      <View style={styles.imagenContainer}>
        <Image
          source={require('../assets/imagenCentral3.jpeg')} // Reemplaza con la ruta a tu imagen local
          style={styles.image}
        />
      </View>
      <View style={styles.footerContainerBoton}>
        <View style={styles.spacer}>
        <Button label="Galeria" onPress={pickImageAsync} fontFamily="Poppins-Bold"/>
        </View>
        <View style={styles.spacer}>
        <Button label="Camara" onPress={takePhotoAsync} fontFamily="Poppins-Bold"/>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
    
  );
}


const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Feed" component={Feed} />
      <Drawer.Screen name="Article" component={Article} />
    </Drawer.Navigator>
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    marginBottom: 0,
    fontFamily: 'Poppins-Bold', // Cambiar a la fuente personalizada
  },
  spacerContainer: {
    width: '100%', // Ocupar todo el ancho
    height: '19%', // Ocupar el 10% de la altura total
    backgroundColor: '#d2c4a8',
    justifyContent: 'center', // Centrar contenido verticalmente
    alignItems: 'center', // Centrar contenido horizontalmente
    position: 'absolute', // Posicionarlo en la parte superior
    top: '20%', // Anclarlo en la parte superior
  },
  inicioContainer: {
    width: '100%', // Ocupar todo el ancho
    height: '5%', // Ocupar el 10% de la altura total
    backgroundColor: '#d2c4a8',
    justifyContent: 'center', // Centrar contenido verticalmente
    alignItems: 'center', // Centrar contenido horizontalmente
    position: 'absolute', // Posicionarlo en la parte superior
    top: 0, // Anclarlo en la parte superior
  },
  tituloContainer: {
  width: '100%', // Ocupar todo el ancho
  height: '15%', // Ocupar el 10% de la altura total
  backgroundColor: '#2C3E50',
  justifyContent: 'center', // Centrar contenido verticalmente
  alignItems: 'center', // Centrar contenido horizontalmente
  position: 'absolute', // Posicionarlo en la parte superior
  top: '5%', // Anclarlo en la parte superior
},
imagenContainer: {
  width: '100%',
  height: '60%', // Aumenté el tamaño
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: '20%', // Ajusté el margen superior
  backgroundColor: '#b55b1f', // Color de fondo para evitar que se vea blanco
},
image: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover', // Cambié a 'cover'
},

footerContainerBoton: {
  width: '100%', // Ocupar todo el ancho
  height: '20%', // Ocupar el 10% de la altura total
  backgroundColor: '#2C3E50',
  flexDirection: 'row', // Alinear los botones en fila
  justifyContent: 'space-around', // Distribuir espacio entre los botones
  alignItems: 'center',
  position: 'absolute',
  top: '80%', // Anclarlo en la parte superior
},
spacer: {
  width: '40%', // Ancho de cada botón
  height: '70%', // Ajustar altura de los botones
  backgroundColor: '#2C3E50',
  justifyContent: 'center', // Centrar contenido verticalmente
  alignItems: 'center', // Centrar contenido horizontalmente
},
});
