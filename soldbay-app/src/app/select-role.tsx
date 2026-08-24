import { useState, useRef, type ComponentProps } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";
import { PrimaryButton } from "@/components/primary-button";

type Role = "seller" | "buyer";

const ROLES: {
  id: Role;
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  description: string;
  cta: string;
}[] = [
  {
    id: "buyer",
    icon: "bag-handle-outline",
    label: "Buyer",
    description: "Discover deals, chat with sellers, and shop safely on your campus",
    cta: "Start shopping",
  },
  {
    id: "seller",
    icon: "storefront-outline",
    label: "Seller",
    description: "List items, manage orders, and earn money from fellow students",
    cta: "Start selling",
  },
];

function RoleCardItem({
  role,
  isSelected,
  onSelect,
  disabled,
}: {
  role: (typeof ROLES)[0];
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.roleCard,
          isSelected && styles.roleCardSelected,
          disabled && { opacity: 0.7 },
          { transform: [{ scale }] },
        ]}
      >
        <View
          style={[
            styles.roleIconCircle,
            isSelected && styles.roleIconCircleSelected,
          ]}
        >
          <Ionicons
            name={role.icon}
            size={24}
            color={isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.6)"}
          />
        </View>

        <View style={styles.roleInfo}>
          <Text
            style={[
              styles.roleLabel,
              isSelected && styles.roleLabelSelected,
            ]}
          >
            {role.label}
          </Text>
          <Text style={styles.roleDesc}>{role.description}</Text>
        </View>

        <View
          style={[
            styles.radioCircle,
            isSelected && styles.radioCircleSelected,
          ]}
        >
          {isSelected && (
            <Ionicons name="checkmark" size={14} color="#ffffff" />
          )}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export default function SelectRoleScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>("buyer");
  const [loading, setLoading] = useState(false);

  async function continueToDashboard() {
    if (!selectedRole) return;
    setLoading(true);
    try {
      const targetRoute = selectedRole === "seller" ? "/seller/verify" as const : "/buyer/home" as const;
      await router.replace(targetRoute);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayoutWrapper backRoute="/buyer/home" backTitle="Back">
      <View style={styles.container}>
        <Text style={styles.cardTitle}>Choose your Role</Text>
        <Text style={styles.cardSubtitle}>
          How do you want to use SoldBay? You can switch between buying and selling anytime in settings.
        </Text>

        {/* Role Cards */}
        <View style={styles.rolesList}>
          {ROLES.map((role) => (
            <RoleCardItem
              key={role.id}
              role={role}
              isSelected={selectedRole === role.id}
              onSelect={() => setSelectedRole(role.id)}
              disabled={loading}
            />
          ))}
        </View>

        {/* Action Button */}
        <View style={{ marginTop: 12 }}>
          <PrimaryButton
            label={selectedRole
              ? ROLES.find((r) => r.id === selectedRole)?.cta || "Continue"
              : "Continue"}
            onPress={continueToDashboard}
            loading={loading}
            disabled={!selectedRole}
          />
        </View>
      </View>
    </AuthLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  cardTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  rolesList: {
    gap: 14,
  },
  roleCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  roleCardSelected: {
    borderColor: "#22c55e",
    backgroundColor: "rgba(34, 197, 94, 0.12)",
  },
  roleIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  roleIconCircleSelected: {
    backgroundColor: "#22c55e",
  },
  roleInfo: {
    flex: 1,
    gap: 4,
  },
  roleLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 17,
    color: "#f4f4f5",
  },
  roleLabelSelected: {
    color: "#ffffff",
  },
  roleDesc: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.65)",
    lineHeight: 18,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: "#22c55e",
    backgroundColor: "#22c55e",
  },
});