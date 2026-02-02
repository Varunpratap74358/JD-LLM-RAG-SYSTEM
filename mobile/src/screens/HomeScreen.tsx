import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BACKEND_API from '../api';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }: any) => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const { isAdmin } = useAuth();

    // Load messages from storage on mount
    React.useEffect(() => {
        const loadMessages = async () => {
            try {
                const savedMessages = await AsyncStorage.getItem('chat_history');
                if (savedMessages) {
                    setMessages(JSON.parse(savedMessages));
                }
            } catch (error) {
                console.error('Failed to load messages', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadMessages();
    }, []);

    // Save messages to storage whenever they update, BUT ONLY after initial load
    React.useEffect(() => {
        const saveMessages = async () => {
            if (!isLoaded) return; // Don't save if we haven't loaded yet
            try {
                await AsyncStorage.setItem('chat_history', JSON.stringify(messages));
            } catch (error) {
                console.error('Failed to save messages', error);
            }
        };
        saveMessages();
    }, [messages, isLoaded]);

    const handleSend = async () => {
        if (!query.trim()) return;

        const userMsg = { id: Date.now(), text: query, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_API}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMsg.text }),
            });
            const data = await res.json();

            const aiMsg = {
                id: Date.now() + 1,
                text: data.answer,
                sender: 'ai',
                sources: data.sources
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Error connecting to backend.", sender: 'error' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <FlatList
                data={messages}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
                        <Text style={[styles.messageText, item.sender === 'user' && styles.userMessageText]}>{item.text}</Text>
                        {/* {item.sources && (
                            <View style={styles.sourceContainer}>
                                <Text style={styles.sourceTitle}>Source:</Text>
                                <Text style={styles.sourceText} numberOfLines={1}>{item.sources[0]?.text}</Text>
                            </View>
                        )} */}
                    </View>
                )}
                ListFooterComponent={
                    loading ? (
                        <View style={{ padding: 10, alignItems: 'center' }}>
                            <ActivityIndicator size="small" color="#4f46e5" />
                            <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 5 }}>AI is thinking...</Text>
                        </View>
                    ) : null
                }
            />


            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask anything..."
                    value={query}
                    onChangeText={setQuery}
                    placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
                    <Text style={styles.sendButtonText}>{loading ? '...' : 'Send'}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    message: { padding: 15, borderRadius: 16, marginBottom: 12, maxWidth: '85%' },
    userMessage: { alignSelf: 'flex-end', backgroundColor: '#4f46e5', borderBottomRightRadius: 4 },
    aiMessage: { alignSelf: 'flex-start', backgroundColor: '#ffffff', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    messageText: { fontSize: 16, lineHeight: 24, color: '#1f2937' },
    userMessageText: { color: '#ffffff' },
    sourceContainer: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
    sourceTitle: { fontSize: 11, fontWeight: 'bold', color: '#6b7280', marginBottom: 2 },
    sourceText: { fontSize: 11, color: '#6b7280', fontStyle: 'italic' },
    inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#f3f4f6', alignItems: 'center' },
    input: { flex: 1, height: 45, backgroundColor: '#f3f4f6', borderRadius: 25, paddingHorizontal: 20, marginRight: 10, fontSize: 16, color: '#1f2937' },
    sendButton: { backgroundColor: '#4f46e5', borderRadius: 25, width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
    sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    adminFab: { position: 'absolute', right: 20, bottom: 90, backgroundColor: '#4f46e5', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 6 },
    fabText: { color: '#fff', fontSize: 30, lineHeight: 32 }
});

export default HomeScreen;
