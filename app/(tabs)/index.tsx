import { Text, View , StyleSheet } from "react-native";
import { Link } from "expo-router";


export default function Index() {
  return (
    <View
        style = {styles.container}
    >
      <Text style = {styles.text}>Identify your self program</Text>
      <Link href="/profile" style = {styles.button}>About Program</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor : "#25292e",
    alignItems : "center",
    justifyContent : "center"
  },
  text: {
    color : "#fff"
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
})
