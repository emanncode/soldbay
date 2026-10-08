import React from "react";
import { View, ScrollView } from "react-native";
import { useAppRouter as useRouter } from "@/hooks/useAppRouter";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { OrderCard, OrderStatus } from "../../components/ui/OrderCard";

const MOCK_ORDERS = [
  {
    id: "ord_1",
    title: "MacBook Pro M1 2020",
    price: 450000,
    personName: "Seller: Amina Y.",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
    status: "awaiting_handoff" as OrderStatus,
    countdownText: "Funds held • Auto-release in 47h 12m",
  },
  {
    id: "ord_2",
    title: "Fundamentals of Physics 10th Ed",
    price: 15000,
    personName: "Seller: Chidi E.",
    imageUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    status: "completed" as OrderStatus,
  },
  {
    id: "ord_3",
    title: "Chemistry Lab Coat",
    price: 5000,
    personName: "Seller: Tunde B.",
    imageUrl:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800",
    status: "disputed" as OrderStatus,
    countdownText: "Dispute under review",
  },
];

export default function OrdersTab() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-bgBase dark:bg-darkBg">
      <View className="px-4 pt-16 mb-3">
        <ScreenHeader
          title="Orders"
          hasUnreadNotifications={true}
          onNotificationPress={() => router.push("/notifications")}
        />
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 96 }}
      >
        {MOCK_ORDERS.map((order) => (
          <OrderCard
            key={order.id}
            title={order.title}
            price={order.price}
            personName={order.personName}
            imageUrl={order.imageUrl}
            status={order.status}
            countdownText={order.countdownText}
            onPress={() => router.push(`/order/${order.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
