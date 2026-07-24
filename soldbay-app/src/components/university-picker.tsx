import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassFormField } from "@/components/glass-form-field";
import { BASE_URL } from "@/lib/api";

export interface University {
  id: string;
  name: string;
  code: string;
}

interface UniversityPickerProps {
  value: University | null;
  onSelect: (university: University) => void;
  error?: string;
}

export function UniversityPicker({
  value,
  onSelect,
  error,
}: UniversityPickerProps) {
  const [open, setOpen] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && universities.length === 0) {
      setLoading(true);
      fetch(`${BASE_URL}/api/universities`)
        .then((res) => res.json())
        .then((data) => setUniversities(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [open, universities.length]);

  const handleSelect = useCallback(
    (u: University) => {
      onSelect(u);
      setOpen(false);
    },
    [onSelect],
  );

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.7}>
        <View pointerEvents="none">
          <GlassFormField
            label="University"
            placeholder="Select your university"
            value={value?.name ?? ""}
            error={error}
            autoCapitalize="none"
          />
        </View>
        <View
          style={{
            position: "absolute",
            right: 14,
            top: 0,
            bottom: 0,
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="chevron-down"
            size={18}
            color="rgba(255,255,255,0.6)"
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", paddingHorizontal: 24 }}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={{
              backgroundColor: "#1a1833",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
              maxHeight: Dimensions.get("window").height * 0.6,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.08)",
              }}
            >
              <Text
                style={{
                  fontFamily: "BricolageGrotesque-SemiBold",
                  fontSize: 18,
                  color: "#ffffff",
                }}
              >
                Select University
              </Text>
              <TouchableOpacity onPress={() => setOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={{ padding: 40, alignItems: "center" }}>
                <ActivityIndicator color="#e1261c" />
              </View>
            ) : (
              <FlatList
                data={universities}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter-Regular",
                        fontSize: 15,
                        color:
                          value?.id === item.id
                            ? "#e1261c"
                            : "#ffffffcc",
                      }}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                style={{ maxHeight: Dimensions.get("window").height * 0.5 }}
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}