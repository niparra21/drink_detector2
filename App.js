import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from './components/Button';





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
    console.log(result);
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
