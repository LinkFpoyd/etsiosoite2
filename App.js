import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {

  const [search, setSearch] = useState('');
  const [marker, setMarker] = useState({});
  const [coordinates, setCoordinates] = useState({latitude: 60.200692,
    longitude: 24.934302, latitudeDelta: 0.0322,
    longitudeDelta: 0.0221});
  const [location, setLocation] = useState(null);

    useEffect(() => (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('No permission to get location')
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation(location);
        console.log('Location:', location)
        setCoordinates({latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0322,
          longitudeDelta: 0.0221 })
      })(), []);

  const searchLocation = () => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=ze9mXWJ57Byb8Vlq7dbzo3a7SxGhVm6L&location=${search}`)
    .then(response => response.json())
    .then(data => setMarker(data.results))
    .catch (error => {
      Alert.alert('Error', error.toString());
    });

    console.log(marker);

    let coordinate = {latitude: marker[0].locations[0].latLng.lat,
      longitude: marker[0].locations[0].latLng.lng,
      latitudeDelta: 0.0322, longitudeDelta: 0.0221}

    setCoordinates(coordinate)
  }

  return (
    <View style={styles.container}>
      <MapView  style={styles.map}   
        region={coordinates}>
        <Marker
          coordinate={coordinates}
          title={search} />
        </MapView>
      <View>
        <TextInput style={styles.input} onChangeText={text => setSearch(text)}/>
        <Button title='etsi' onPress={searchLocation}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  input: {
    borderWidth: 1,
    height: 40,
    width: 200
  }
});
