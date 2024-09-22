import './gesture-handler';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from './components/Button';
import axios from 'axios';
import * as Font from 'expo-font';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './screens/HomeScreen'; 
import DetectorScreen from './screens/DetectorScreen';
import MapScreen from './screens/MapScreen'; 

const Drawer = createDrawerNavigator();

export default function App() {
  return (
  <NavigationContainer>
      <Drawer.Navigator initialRouteName="Detector">
        <Drawer.Screen name="Detector" component={DetectorScreen} />
        <Drawer.Screen name="HomeScreen" component={HomeScreen} />
        <Drawer.Screen name="MapScreen" component={MapScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}