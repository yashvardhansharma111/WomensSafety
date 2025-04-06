import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootSiblingParent } from 'react-native-root-siblings';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HealthDataScreen from './src/screens/HealthDataScreen';
import EducationalScreen from './src/screens/EducationalScreen';
import SOSButton from './src/components/SOSButton';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <RootSiblingParent>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#7e57c2',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: "Women's Safety" }}
              />
              <Stack.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{ title: 'User Profile' }}
              />
              <Stack.Screen 
                name="HealthData" 
                component={HealthDataScreen} 
                options={{ title: 'Health Analytics' }}
              />
              <Stack.Screen 
                name="Educational" 
                component={EducationalScreen} 
                options={{ title: 'Learn More' }}
              />
            </Stack.Navigator>
            <SOSButton />
          </NavigationContainer>
        </SafeAreaProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;