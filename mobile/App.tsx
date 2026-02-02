import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import AddContentScreen from './src/screens/AddContentScreen';
import { Button, View, ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

const Navigation = () => {
    const { isAdmin, logout, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={({ navigation }) => ({
                        title: 'MiniRAG Chat',
                        headerRight: () => (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 10 }}>
                                {isAdmin && (
                                    <Button
                                        title="+"
                                        onPress={() => navigation.navigate('AddContent')}
                                        color="#4f46e5"
                                    />
                                )}
                                {isAdmin ? (
                                    <Button title="Logout" onPress={logout} color="#ef4444" />
                                ) : (
                                    <Button title="Admin" onPress={() => navigation.navigate('Login')} color="#4f46e5" />
                                )}
                            </View>
                        ),
                    })}
                />
                <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Admin Login' }} />
                <Stack.Screen name="AddContent" component={AddContentScreen} options={{ title: 'Add Knowledge' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <Navigation />
        </AuthProvider>
    );
}
