import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import axios from "axios";

const api = "https://photographable-chrissy-tiredly.ngrok-free.dev/";

export default function RegisterScreen({ navigation}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    profileType: "CUSTOMER",
    role: "CUSTOMER",
  });

  const [usernameStatus, setUsernameStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "username" && value.length >= 5) {
      axios
        .get(`${api}users/check-username?username=${value}`)
        .then((res) => setUsernameStatus(res.data.message))
        .catch(
          (err) =>
            setUsernameStatus(err.response?.data?.message || "Error checking username")
        );
    } else if (name === "username") {
      setUsernameStatus("Username must be at least 5 characters");
    }

    if (name === "email" && value.length > 5) {
      axios
        .get(`${api}users/check-email?email=${value}`)
        .then((res) => setEmailStatus(res.data.message))
        .catch(
          (err) =>
            setEmailStatus(err.response?.data?.message || "Error checking email")
        );
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(api + "auth/register", form);
      if (response.status === 201) {
        Alert.alert("Success", "Registration successful!");
        router.replace("/login")
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.title}>REGISTER</Text>

        <View style={styles.row}>
          <TextInput
            placeholder="First Name"
            value={form.firstName}
            onChangeText={(val) => handleChange("firstName", val)}
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            placeholder="Last Name"
            value={form.lastName}
            onChangeText={(val) => handleChange("lastName", val)}
            style={[styles.input, styles.halfInput]}
          />
        </View>

        <TextInput
          placeholder="Username"
          value={form.username}
          onChangeText={(val) => handleChange("username", val)}
          style={styles.input}
        />
        {usernameStatus ? (
          <Text
            style={[
              styles.statusText,
              usernameStatus.includes("available")
                ? styles.textGreen
                : usernameStatus.includes("least")
                ? styles.textYellow
                : styles.textRed,
            ]}
          >
            {usernameStatus}
          </Text>
        ) : null}

        <TextInput
          placeholder="Email"
          value={form.email}
          onChangeText={(val) => handleChange("email", val)}
          style={styles.input}
          keyboardType="email-address"
        />
        {emailStatus ? (
          <Text
            style={[
              styles.statusText,
              emailStatus.includes("available") ? styles.textGreen : styles.textRed,
            ]}
          >
            {emailStatus}
          </Text>
        ) : null}

        <TextInput
          placeholder="Password"
          value={form.password}
          onChangeText={(val) => handleChange("password", val)}
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          placeholder="Phone"
          value={form.phone}
          onChangeText={(val) => handleChange("phone", val)}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          placeholder="Address"
          value={form.address}
          onChangeText={(val) => handleChange("address", val)}
          multiline
          style={[styles.input, styles.textArea]}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Loading..." : "REGISTER"}</Text>
        </TouchableOpacity>

       <Text style={styles.footerText}>
            Already have an account?{" "}
            <Link href="/login" style={styles.linkText}>
                Login
            </Link>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  formCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: "#22c55e",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#22c55e",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  input: {
    width: "100%",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    width: "100%",
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    textAlign: "center",
    color: "#374151",
  },
  linkText: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  statusText: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  textGreen: {
    color: "#16a34a",
  },
  textRed: {
    color: "#dc2626",
  },
  textYellow: {
    color: "#f59e0b",
  },
});
