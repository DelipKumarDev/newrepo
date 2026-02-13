import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';

const API = (Constants.manifest?.extra?.apiUrl || 'http://localhost:3001') + '/api';

export default function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('driver@example.com');
  const [password, setPassword] = useState('Driver@1234');
  const [deliveries, setDeliveries] = useState([]);

  const login = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      setToken(res.data.accessToken);
    } catch (err) {
      console.log(err.message);
    }
  };

  const loadDeliveries = async () => {
    try {
      const res = await axios.get(`${API}/deliveries`, { headers: { Authorization: `Bearer ${token}` } });
      setDeliveries(res.data.data || []);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (token) loadDeliveries();
  }, [token]);

  if (!token)
    return (
      <View style={{ padding: 24 }}>
        <Text>Login</Text>
        <TextInput value={email} onChangeText={setEmail} placeholder="email" />
        <TextInput value={password} onChangeText={setPassword} placeholder="password" secureTextEntry />
        <Button title="Login" onPress={login} />
      </View>
    );

  return (
    <View style={{ padding: 24 }}>
      <Text>My Deliveries</Text>
      <FlatList data={deliveries} keyExtractor={(i) => i._id} renderItem={({ item }) => (
        <View style={{ padding: 12, borderBottomWidth: 1 }}>
          <Text>{item.reference} — {item.status}</Text>
        </View>
      )} />
    </View>
  );
}
