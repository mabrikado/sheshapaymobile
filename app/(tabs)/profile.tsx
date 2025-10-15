import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function ProfileScreen(){

    const router = useRouter();

    useEffect(()=>{
      router.replace("/login")
    } , [])
  

    return (
        <View style={styles.container}>
        <Text style={styles.text}>Profile screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});