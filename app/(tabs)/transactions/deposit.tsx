import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API } from '@env';

const DepositForm: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDeposit = async () => {
        if (!amount) {
            Alert.alert('Error', 'Please enter an amount.');
            return;
        }
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('access_token');
            if (!token) {
                Alert.alert('Error', 'No access token found.');
                setLoading(false);
                return;
            }
            await axios.post(
                API + 'transactions/deposit',
                { amount: parseFloat(amount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Success', `Deposited ${amount} successfully`);
            setAmount('');
        } catch (error) {
            Alert.alert('Error', 'Deposit failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Deposit</Text>
            <TextInput
                style={styles.input}
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
                <Button
                    title={loading ? 'Processing...' : 'Deposit'}
                    onPress={handleDeposit}
                    color="#16a34a"
                    disabled={loading}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#16a34a',
    },
    input: {
        borderWidth: 1,
        borderColor: '#16a34a',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 8,
    },
});

export default DepositForm;