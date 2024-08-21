import { StyleSheet, View, Pressable, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Button({ label, onPress, fontFamily }) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={[styles.buttonLabel, { fontFamily }]}>{label}</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  buttonContainer: {
    width: 140,
    height: 58,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 20,
    borderWidth: 3, // Ancho del borde
    borderColor: '#000000', // Color del borde (puedes cambiarlo según tu preferencia)
    backgroundColor: '#8a2be2',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#ebbdf7',
    fontSize: 16,
  },
});
