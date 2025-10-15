import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

// Interfaces
interface Profile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  businessName: string;
  address: string;
}

interface Account {
  accountNumber: string;
  registered: string;
  balance: number;
  accountType: string;
}

interface Transaction {
  id: number;
  fromAccount?: string | null;
  toAccount?: string | null;
  amount: string;
  externalSource?: string | null;
  type: "DEPOSIT" | "PAYMENT" | "WITHDRAWAL" | "TRANSFER";
  timestamp: string;
}

interface DashboardResponse {
  profile: Profile;
  transactions: Transaction[];
  account: Account;
}

const API = "https://photographable-chrissy-tiredly.ngrok-free.dev/";

// Cross-platform token getter
const getToken = async () => {
  if (Platform.OS === "web") return localStorage.getItem("access_token");
  return await SecureStore.getItemAsync("access_token");
};

// Map transaction types to colors
const getTransactionColor = (type: string) => {
  switch (type) {
    case "DEPOSIT":
      return { bg: "#d1fae5", text: "#16a34a" }; // green
    case "WITHDRAWAL":
      return { bg: "#fee2e2", text: "#dc2626" }; // red
    case "TRANSFER":
      return { bg: "#dbeafe", text: "#2563eb" }; // blue
    case "PAYMENT":
      return { bg: "#fff7ed", text: "#f97316" }; // orange
    default:
      return { bg: "#f3f4f6", text: "#6b7280" }; // gray
  }
};

export default function DashboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = await getToken();
        if (!token) {
          router.replace("/login");
          return;
        }

        setLoading(true);

        const res = await axios.get<DashboardResponse>(`${API}account/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setProfile(data.profile);
        setAccount(data.account);
        setTransactions(
          data.transactions.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        );
      } catch (err: any) {
        console.error("Dashboard error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text>Loading your dashboard...</Text>
      </View>
    );
  }

  if (!profile || !account) {
    return (
      <View style={styles.center}>
        <Text>No dashboard data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 👤 Profile */}
      <View style={styles.profileCard}>
        <Text style={styles.name}>
          {profile.firstName} {profile.lastName}
        </Text>
        <Text style={styles.business}>{profile.businessName}</Text>
        <Text style={styles.username}>@{profile.username}</Text>
        <Text style={styles.email}>{profile.email}</Text>
        <Text style={styles.phone}>{profile.phone}</Text>
        <Text style={styles.address}>{profile.address}</Text>
      </View>

      {/* 💳 Account Info */}
      <View style={styles.accountCard}>
        <Text style={styles.accountNumber}>Account: {account.accountNumber}</Text>
        <Text style={styles.balance}>Balance: R{account.balance.toFixed(2)}</Text>
        <Text style={styles.accountType}>Type: {account.accountType}</Text>
      </View>

      {/* 💰 Transactions */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isExpanded = expanded === item.id;
          const colors = getTransactionColor(item.type);
          return (
            <View style={[styles.transactionItem, { backgroundColor: colors.bg }]}>
              <TouchableOpacity onPress={() => setExpanded(isExpanded ? null : item.id)}>
                <View style={styles.transactionHeader}>
                  <Text style={[styles.transactionType, { color: colors.text }]}>
                    {item.type}
                  </Text>
                  <Text style={[styles.transactionAmount, { color: colors.text }]}>
                    {item.type === "DEPOSIT" ? "+" : "-"}R{parseFloat(item.amount).toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.timestamp}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>

                {isExpanded && (
                  <View style={styles.transactionDetails}>
                    {item.fromAccount && <Text>From: {item.fromAccount}</Text>}
                    {item.toAccount && <Text>To: {item.toAccount}</Text>}
                    {item.externalSource && <Text>External: {item.externalSource}</Text>}
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#6b7280", marginTop: 20 }}>
            No transactions available.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  profileCard: {
    backgroundColor: "#2b8a3e",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  name: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  business: { fontSize: 16, color: "#fff" },
  username: { fontSize: 14, color: "#e0e0e0" },
  email: { fontSize: 14, color: "#e0e0e0" },
  phone: { fontSize: 14, color: "#e0e0e0" },
  address: { fontSize: 14, color: "#e0e0e0" },

  accountCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  accountNumber: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  balance: { fontSize: 18, fontWeight: "bold", color: "#16a34a" },
  accountType: { fontSize: 14, color: "#666" },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },

  transactionItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionType: { fontWeight: "600", fontSize: 16 },
  transactionAmount: { fontWeight: "bold", fontSize: 16 },
  timestamp: { fontSize: 12, color: "#888" },
  transactionDetails: { marginTop: 8, paddingLeft: 4 },
});
