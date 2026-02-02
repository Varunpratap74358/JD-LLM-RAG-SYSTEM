import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import BACKEND_API from '../api';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('varun@gmail.com');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!username || !password) return;
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_API}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const data = await res.json();
                await login(data.access_token);
                navigation.replace('Home');
            } else {
                Alert.alert('Error', 'Invalid credentials');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to connect to backend');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔐 Admin Access</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f3f4f6' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#1f2937' },
    subTitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 30 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 5 },
    input: { height: 50, backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#d1d5db', fontSize: 16 },
    button: { height: 50, backgroundColor: '#4f46e5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default LoginScreen;
