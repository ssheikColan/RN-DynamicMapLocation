import { View, Text,SafeAreaView,
    StyleSheet,
    Image,
    PermissionsAndroid,
    Platform,
    Linking,
    Button, } from 'react-native'
import React , { useEffect, useState }from 'react'
import Geolocation from '@react-native-community/geolocation';

export default function Map() {
    //  state to hold location
    const [location,
       setLocation] = useState(false);
       const [watchId, setWatchId] = useState(null)
       const[latitude,setLatitude] =useState('')
       const[longitude,setLongitude] =useState('')
       const [currentLocation, setCurrentLocation] = useState(null);



    useEffect(() => {
      
      const hasLocationPermission = requestLocationPermission();
      if (hasLocationPermission) {
        console.log('Location permission granted, getting current location');
        Geolocation.getCurrentPosition(
          (position) => {
            getLocation()
            watchLocation()
            // setCurrentLocation({
            //   latitude: position.coords.latitude,
            //   longitude: position.coords.longitude,
            // });
          },
          (error) => console.log(error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    }, []);
    
  // Function to get permission for location
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};


// function to check permissions and get Location
const getLocation = () => {
  const result = requestLocationPermission();
  result.then(res => {
    console.log('res is:', res);
    if (res) {
      Geolocation.getCurrentPosition(
        position => {
          // console.log('latt',position.latitude,'=',position.longitude);
       
          setLocation(position);

          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

              // Call the watchLocation()
              watchLocation();
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
          setLocation(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  });
 
 
};



const watchLocation = () => {
    setWatchId(
      Geolocation.watchPosition(
        (position) => {
         
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.log(error),
        { enableHighAccuracy: true, distanceFilter: 10 },
      ),
    );
  };


const clearWatch = () => {
  Geolocation.clearWatch(watchId);
  setWatchId(null);
};




  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.boldText}>{}</Text>
        <Text
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 16,
          }}>
          {/* Longitude: {currentLocation.longitude} */}
        </Text>
        <Text
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 16,
          }}>
          {/* Latitude: {currentLocation.latitude} */}
          {console.log('location==',currentLocation)}
        </Text>
        <View style={{ marginTop: 20 }}>
          <Button title="Button" onPress= {()=>getLocation} />
          <Button title="Button" onPress={()=>clearWatch()} />
        </View>
      </View>
    </View>
  </SafeAreaView>
  )

}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boldText: {
      fontSize: 25,
      color: 'red',
      marginVertical: 16,
    },
  });