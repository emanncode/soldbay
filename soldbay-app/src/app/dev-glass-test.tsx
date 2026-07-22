import { View, Text, TouchableOpacity } from "react-native";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { GlassPanel } from "@/components/glass-panel";

export default function DevGlassTest() {
  return (
    <PageAtmosphere style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <GlassPanel variant="panel" style={{ width: "100%", padding: 24, marginBottom: 24 }}>
        <Text className="text-heading-m" style={{ color: "#ffffff" }}>Panel</Text>
        <Text className="text-body-m" style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>
          This is a standard glass panel with blur, semi-transparent background, inset highlight, and drop shadow.
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: "#e1261c",
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 999,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "600", fontSize: 16 }}>Action</Text>
        </TouchableOpacity>
      </GlassPanel>

      <GlassPanel variant="panel-focus" style={{ width: "100%", padding: 24 }}>
        <Text className="text-heading-m" style={{ color: "#ffffff" }}>Panel Focus</Text>
        <Text className="text-body-m" style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>
          Brighter variant with purple glow shadow — used on spotlighted surfaces.
        </Text>
      </GlassPanel>
    </PageAtmosphere>
  );
}
