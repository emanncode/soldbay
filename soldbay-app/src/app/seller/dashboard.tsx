import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { GlassPanel } from "@/components/glass-panel";
import { getSellerMe, ApiError, type SellerMeResponse } from "@/lib/api";

const logo2 = require("../../../assets/logo2.png");

export default function SellerDashboardScreen() {
  const router = useRouter();
  const [data, setData] = useState<SellerMeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  async function loadDashboard() {
    try {
      const me = await getSellerMe();
      if (!me.verified) {
        router.replace("/seller/verify");
        return;
      }
      setData(me);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        router.replace("/seller/verify");
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  function formatNaira(amount: string): string {
    const num = parseFloat(amount) || 0;
    return "₦" + num.toLocaleString("en-NG");
  }

  function getInitial(name: string): string {
    return name?.charAt(0)?.toUpperCase() ?? "S";
  }

  function getStatusColor(status: string): { bg: string; text: string } {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return { bg: "rgba(22,163,74,0.15)", text: "#22c55e" };
      case "SOLD_OUT":
        return { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" };
      case "INACTIVE":
        return { bg: "rgba(113,113,122,0.15)", text: "#71717a" };
      default:
        return { bg: "rgba(22,163,74,0.15)", text: "#22c55e" };
    }
  }

  function getStatusLabel(status: string): string {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "Active";
      case "SOLD_OUT":
        return "Sold out";
      case "INACTIVE":
        return "Inactive";
      default:
        return status;
    }
  }

  if (loading) {
    return (
      <PageAtmosphere>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator color="#e1261c" size="large" />
          </View>
        </SafeAreaView>
      </PageAtmosphere>
    );
  }

  if (!data) return null;

  const listings = data.listings;

  return (
    <PageAtmosphere>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 52,
              paddingHorizontal: 24,
              paddingBottom: 24,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <LogoMark />
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: 17,
                  color: "#ffffff",
                }}
              >
                Seller Dashboard
              </Text>
            </View>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#ffffff1a",
                borderWidth: 1,
                borderColor: "#ffffff1f",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "BricolageGrotesque-Bold",
                  fontSize: 16,
                  color: "#ffffff",
                }}
              >
                {getInitial(data.name)}
              </Text>
            </View>
          </View>

          <View style={{ paddingHorizontal: 24, gap: 24 }}>
            {/* Wallet balance card */}
            <GlassPanel variant="panel-focus" style={{ borderRadius: 20 }}>
              <View style={{ padding: 20, gap: 12 }}>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 13,
                    color: "#ffffff80",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Wallet balance
                </Text>
                <Text
                  style={{
                    fontFamily: "BricolageGrotesque-Bold",
                    fontSize: 32,
                    color: "#ffffff",
                    fontWeight: "700",
                  }}
                >
                  {formatNaira(data.walletBalance)}
                </Text>
                <TouchableOpacity
                  onPress={() => setToast("Payout coming soon")}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: 13,
                      color: "#ffffff33",
                    }}
                  >
                    Request payout
                  </Text>
                </TouchableOpacity>
              </View>
            </GlassPanel>

            {/* Listings section */}
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontFamily: "BricolageGrotesque-SemiBold",
                    fontSize: 22,
                    color: "#ffffff",
                  }}
                >
                  Your listings
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    backgroundColor: "#e1261c",
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-SemiBold",
                      fontSize: 14,
                      color: "#ffffff",
                    }}
                  >
                    +
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter-SemiBold",
                      fontSize: 13,
                      color: "#ffffff",
                    }}
                  >
                    Add listing
                  </Text>
                </TouchableOpacity>
              </View>

              {listings.length === 0 ? (
                <EmptyState onAdd={() => setToast("Create listing coming soon")} />
              ) : (
                <View style={{ gap: 12 }}>
                  {listings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      statusStyle={getStatusColor(listing.status)}
                      statusLabel={getStatusLabel(listing.status)}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Toast */}
        {toast && (
          <View
            style={{
              position: "absolute",
              bottom: 40,
              alignSelf: "center",
              backgroundColor: "#1a1833ee",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
              borderRadius: 12,
              paddingHorizontal: 20,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ionicons name="information-circle" size={16} color="#ffffff99" />
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: 14,
                color: "#ffffffcc",
              }}
            >
              {toast}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </PageAtmosphere>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function LogoMark() {
  return (
    <Image
      source={logo2}
      style={{ width: 32, height: 32, borderRadius: 8 }}
      resizeMode="contain"
    />
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <GlassPanel variant="panel" style={{ borderRadius: 20, height: 300 }}>
      <View
        style={{
          flex: 1,
          padding: 32,
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "rgba(255,255,255,0.06)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="cube-outline" size={28} color="#ffffff33" />
        </View>
        <Text
          style={{
            fontFamily: "BricolageGrotesque-SemiBold",
            fontSize: 18,
            color: "#ffffffcc",
            textAlign: "center",
          }}
        >
          You haven't listed anything yet
        </Text>
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: "#ffffff66",
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          Start selling to students on your campus
        </Text>
        <TouchableOpacity
          onPress={onAdd}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: "#e1261c",
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 999,
            marginTop: 4,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: 16,
              color: "#ffffff",
            }}
          >
            +
          </Text>
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: 15,
              color: "#ffffff",
            }}
          >
            Add your first listing
          </Text>
        </TouchableOpacity>
      </View>
    </GlassPanel>
  );
}

interface ListingCardProps {
  listing: SellerMeResponse["listings"][number];
  statusStyle: { bg: string; text: string };
  statusLabel: string;
}

function ListingCard({ listing, statusStyle, statusLabel }: ListingCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.7}>
      <GlassPanel variant="panel" style={{ borderRadius: 16 }}>
        <View style={{ flexDirection: "row", padding: 12, gap: 12 }}>
          {/* Thumbnail */}
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            {listing.images[0] ? (
              <Image
                source={{ uri: listing.images[0] }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="image-outline" size={24} color="#ffffff22" />
              </View>
            )}
          </View>

          {/* Info */}
          <View style={{ flex: 1, justifyContent: "center", gap: 4 }}>
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: 15,
                color: "#ffffff",
              }}
              numberOfLines={1}
            >
              {listing.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="pricetag" size={12} color="#e1261c" />
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: 14,
                  color: "#ffffffcc",
                }}
              >
                ₦{parseFloat(listing.price).toLocaleString("en-NG")}
              </Text>
            </View>
          </View>

          {/* Status badge */}
          <View
            style={{
              alignSelf: "center",
              backgroundColor: statusStyle.bg,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: 11,
                color: statusStyle.text,
              }}
            >
              {statusLabel}
            </Text>
          </View>
        </View>
      </GlassPanel>
    </TouchableOpacity>
  );
}
