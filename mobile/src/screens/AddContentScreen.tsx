import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import BACKEND_API from '../api';
import { useAuth } from '../context/AuthContext';

const AddContentScreen = ({ navigation }: any) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const handleIngest = async () => {
        if (!text.trim()) return;
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_API}/ingest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text, source: 'mobile' }),
            });

            if (res.ok) {
                Alert.alert('Success', 'Content indexed successfully!');
                setText('');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed to add content. Unauthorized?');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to connect to backend');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>📚 Add to Knowledge Base</Text>
            <Text style={styles.subtitle}>Paste text to chunk and store in Vector DB.</Text>

            <TextInput
                style={styles.textArea}
                placeholder="Enter information here..."
                value={text}
                onChangeText={setText}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
            />

            <TouchableOpacity
                style={[styles.button, !text.trim() && { backgroundColor: '#9ca3af' }]}
                onPress={handleIngest}
                disabled={loading || !text.trim()}
            >
                <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Index Content'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f3f4f6', flexGrow: 1 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
    textArea: { backgroundColor: '#fff', borderRadius: 8, padding: 15, height: 300, borderWidth: 1, borderColor: '#d1d5db', marginBottom: 20 },
    button: { height: 50, backgroundColor: '#4f46e5', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default AddContentScreen;
