import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { GlassPanel } from "@/components/glass-panel";
import { PrimaryButton } from "@/components/primary-button";

type Role = "seller" | "buyer";

const ROLES: {
  id: Role;
  icon: string;
  label: string;
  description: string;
  cta: string;
}[] = [
  {
    id: "seller",
    icon: "storefront-outline",
    label: "Seller",
    description: "List items, manage orders, earn money",
    cta: "Start selling",
  },
  {
    id: "buyer",
    icon: "bag-handle-outline",
    label: "Buyer",
    description: "Discover deals, chat with sellers, buy safely",
    cta: "Start shopping",
  },
];

export default function SelectRoleScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  async function continueToDashboard() {
    if (!selectedRole) return;
    setLoading(true);
    try {
      await router.replace(`/${selectedRole}/dashboard`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageAtmosphere>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button + heading */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 12,
              paddingHorizontal: 24,
              paddingBottom: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#ffffff1a",
                borderWidth: 1,
                borderColor: "#ffffff1f",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="chevron-back" size={24} color="#ffffff" />
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: "BricolageGrotesque-SemiBold",
                fontSize: 22,
                color: "#ffffff",
              }}
            >
              Choose your role
            </Text>

            <View style={{ width: 44 }} />
          </View>

          <View style={{ paddingHorizontal: 24, gap: 20, paddingTop: 8 }}>
            {/* Subtitle */}
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 15,
                color: "#ffffff99",
                lineHeight: 22,
              }}
            >
              How do you want to use Soldbay? You can switch later in settings.
            </Text>

            {/* Role cards */}
            <View style={{ gap: 16 }}>
              {ROLES.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  selected={selectedRole === role.id}
                  onPress={() => setSelectedRole(role.id)}
                />
              ))}
            </View>

            {/* Continue button */}
            <PrimaryButton
              label={selectedRole
                ? ROLES.find((r) => r.id === selectedRole)?.cta || "Continue"
                : "Continue"}
              onPress={continueToDashboard}
              loading={loading}
              disabled={!selectedRole}
              style={{ marginTop: 8 }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </PageAtmosphere>
  );
}

function RoleCard({
  role,
  selected,
  onPress,
}: {
  role: (typeof ROLES)[0];
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        borderRadius: 20,
        borderWidth: 1,
        borderColor: selected ? "#e1261c" : "rgba(255,255,255,0.12)",
        backgroundColor: selected
          ? "rgba(225,38,28,0.08)"
          : "rgba(255,255,255,0.06)",
        padding: 20,
        gap: 12,
        ...(selected
          ? {
              shadowColor: "rgba(225,38,28,0.3)",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 1,
              shadowRadius: 24,
              elevation: 12,
            }
          : {}),
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: selected
              ? "rgba(225,38,28,0.15)"
              : "rgba(255,255,255,0.08)",
            borderWidth: 1,
            borderColor: selected
              ? "rgba(225,38,28,0.3)"
              : "rgba(255,255,255,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={role.icon}
            size={24}
            color={selected ? "#e1261c" : "#ffffffcc"}
          />
        </View>

        <View style={{ flex: 1, gap: 4, paddingTop: 4 }}>
          <Text
            style={{
              fontFamily: "BricolageGrotesque-SemiBold",
              fontSize: 18,
              color: selected ? "#ffffff" : "#ffffffe6",
            }}
          >
            {role.label}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 13,
              color: "#ffffff80",
              lineHeight: 19,
            }}
          >
            {role.description}
          </Text>
        </View>

        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: selected ? "#e1261c" : "rgba(255,255,255,0.3)",
            backgroundColor: selected ? "#e1261c" : "transparent",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          {selected && (
            <Ionicons name="checkmark" size={16} color="#ffffff" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}