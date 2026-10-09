import { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { TabBar, TabItem } from "../components/ui/TabBar";
import { ScreenHeader } from "../components/ui/ScreenHeader";
import { SearchBar } from "../components/ui/SearchBar";
import { ProductCard } from "../components/ui/ProductCard";
import { OrderCard } from "../components/ui/OrderCard";
import { Button } from "../components/ui/Button";
import {
  DiscountBadge,
  VerifiedBadge,
  UnverifiedBadge,
  StatusPill,
} from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { ListItem } from "../components/ui/ListItem";
import { Avatar } from "../components/ui/Avatar";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { Toast, InlineContext } from "../components/ui/Feedback";
import { WarningCircle, Clock, CaretDown, Bell } from "phosphor-react-native";

export default function Index() {
  const [activeBuyerTab, setActiveBuyerTab] = useState<TabItem>("Browse");
  const [activeSellerTab, setActiveSellerTab] = useState<TabItem>("Hub");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ScrollView
      className="flex-1 bg-bgBase dark:bg-darkBg"
      contentContainerClassName="flex-grow justify-center py-12"
    >
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-title-2 text-primaryText dark:text-darkText mb-2 text-center">
          Component Library Preview
        </Text>
        <Text className="text-body text-secondaryText dark:text-borderDark mb-8 text-center">
          Pure UI components preview.
        </Text>
      </View>

      <View className="w-full bg-bgBase dark:bg-darkBg gap-8 pb-8">
        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">
            Screen Header
          </Text>
          <View className="px-4 py-4">
            <ScreenHeader title="Home" hasUnreadNotifications={true} userName="Debug User" />
          </View>
        </View>

        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">
            Search Bar
          </Text>
          <View className="px-4 py-4">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery("")}
            />
          </View>
        </View>

        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">
            Feedback
          </Text>
          <View className="px-4 py-4 gap-6">
            <EmptyState
              icon={<Text style={{ fontSize: 48 }}>🏫</Text>}
              title="No campus found"
              description="We couldn't find an institution matching your search."
            />

            <View className="gap-2">
              <Skeleton width="100%" height={120} />
              <Skeleton width="60%" height={20} />
              <Skeleton width="40%" height={16} />
            </View>

            <View className="items-center gap-4">
              <Toast type="success" message="Profile updated successfully" />
              <InlineContext
                message={
                  <Text>
                    Payment is <Text className="font-sora-bold">held</Text>{" "}
                    safely until you confirm pickup.
                  </Text>
                }
              />
              <InlineContext
                message={
                  <Text className="font-sora-bold text-error dark:text-darkError">
                    Pickup window has passed.
                  </Text>
                }
                icon={<WarningCircle size={20} color="#F87171" weight="fill" />}
                style={{ backgroundColor: "rgba(248, 113, 113, 0.15)" }}
              />
            </View>
          </View>
        </View>
        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">
            Lists & Identity
          </Text>
          <View className="px-4 py-4 gap-2">
            <ListItem
              title="Pickup Reminder"
              subtitle="You have a meeting with Samuel B."
              leftElement={
                <View className="w-12 h-12 rounded-sm bg-[#e0e0e0] items-center justify-center">
                  <Clock size={24} color="#063F42" />
                </View>
              }
              rightElement={
                <Text className="text-[11px] text-secondaryText dark:text-borderDark">
                  Oct 8
                </Text>
              }
            />
            <ListItem
              title="Samuel B."
              subtitle="@samuel_b"
              leftElement={<Avatar initials="SB" />}
              rightElement={<VerifiedBadge />}
            />
            <View className="flex-row gap-6 mt-4">
              <Avatar imageUrl="https://placehold.co/88x88/E2E8E8/063f42?text=P" />
              <Avatar initials="CE" />
            </View>
          </View>
        </View>
        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">
            Inputs
          </Text>
          <View className="px-4 py-4 gap-6">
            <Input label="Default Input" placeholder="Placeholder..." />
            <Input label="Filled Input" value="User Typed Text" />
            <Input
              label="Error Input"
              value="Invalid data"
              error="This field is required."
            />
            <Input
              label="Select / Dropdown (Closed)"
              value="University of Lagos"
              editable={false}
              rightIcon={<CaretDown size={20} color="#031F21" />}
            />
            <Input
              label="Textarea"
              placeholder="Type long description here..."
              multiline
            />
          </View>
        </View>
        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">
            Product Cards
          </Text>
          <View className="px-4 py-4 flex-row gap-4 flex-wrap">
            <View className="w-[47%]">
              <ProductCard
                title="MacBook Pro M1 2020"
                price={650000}
                originalPrice={700000}
                sellerName="@emmanuel_d"
                isVerifiedSeller={true}
                rating={4.8}
                reviewCount={24}
              />
            </View>
            <View className="w-[47%]">
              <ProductCard
                title="Engineering Drawing Kit"
                price={15000}
                sellerName="@sarah_j"
                isVerifiedSeller={false}
                rating={4.2}
                reviewCount={12}
              />
            </View>
            <View className="w-[47%]">
              <ProductCard
                title="Nike Air Force 1"
                price={25000}
                sellerName="@michael_c"
                isVerifiedSeller={true}
                rating={4.8}
                reviewCount={24}
                isSold={true}
                isWishlisted={true}
              />
            </View>
          </View>
        </View>

        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">
            Badges & Pills
          </Text>
          <View className="px-4 py-4 gap-4">
            <View className="flex-row items-center gap-4">
              <VerifiedBadge />
              <UnverifiedBadge />
              <DiscountBadge discountPercent={20} />
            </View>
            <View className="flex-row flex-wrap gap-4">
              <StatusPill status="success" label="Completed" />
              <StatusPill status="warning" label="Awaiting" />
              <StatusPill status="error" label="Disputed" />
              <StatusPill status="info" label="Pending" />
            </View>
          </View>
        </View>
        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">
            Buttons
          </Text>
          <View className="px-4 py-4 gap-4">
            <View className="flex-row gap-4">
              <Button label="Active" style={{ flex: 1 }} />
              <Button label="Disabled" disabled style={{ flex: 1 }} />
            </View>
            <View className="flex-row gap-4">
              <Button
                variant="secondary"
                label="Secondary"
                style={{ flex: 1 }}
              />
              <Button variant="secondary" label="Outline" style={{ flex: 1 }} />
            </View>
            <View className="flex-row gap-4 items-center">
              <Button
                icon={<Bell size={24} color="#031F21" />}
              />
              <Button
                variant="secondary"
                label="This is your listing"
                disabled
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">
            Badges & Pills
          </Text>
          <View className="px-4 py-4 gap-4">
            <View className="flex-row items-center gap-4">
              <VerifiedBadge />
              <UnverifiedBadge />
              <DiscountBadge discountPercent={20} />
            </View>
            <View className="flex-row flex-wrap gap-4">
              <StatusPill status="success" label="Completed" />
              <StatusPill status="warning" label="Awaiting" />
              <StatusPill status="error" label="Disputed" />
              <StatusPill status="info" label="Pending" />
            </View>
          </View>
        </View>
        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">
            Buttons
          </Text>
          <View className="px-4 py-4 gap-4">
            <View className="flex-row gap-4">
              <Button label="Active" style={{ flex: 1 }} onPress={() => {}} />
              <Button label="Disabled" disabled style={{ flex: 1 }} />
            </View>
            <View className="flex-row gap-4">
              <Button
                variant="secondary"
                label="Secondary"
                style={{ flex: 1 }}
                onPress={() => {}}
              />
              <Button
                variant="secondary"
                label="Outline"
                style={{ flex: 1 }}
                onPress={() => {}}
              />
            </View>
            <View className="flex-row gap-4 items-center">
              <Button
                icon={<Bell size={24} color="#031F21" />}
                onPress={() => {}}
              />
              <Button
                variant="secondary"
                label="This is your listing"
                disabled
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">
            Order Cards
          </Text>
          <View className="px-4 py-4 gap-4">
            <OrderCard
              title="Calculus Textbook"
              price={4000}
              personName="Samuel B."
              status="pending_pickup"
              countdownText="Auto-releases in 46h"
            />
            <OrderCard
              title="Lab Coat"
              price={2000}
              status="awaiting_handoff"
              countdownText="Auto-releases in 18h"
            />
            <OrderCard
              title="Nike Air Force 1"
              price={25000}
              status="completed"
            />
            <OrderCard title="MacBook Pro" price={650000} status="disputed" />
          </View>
        </View>
        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">
            Buyer Tab Bar
          </Text>
          <TabBar
            activeTab={activeBuyerTab}
            onTabPress={setActiveBuyerTab}
            variant="buyer"
            hasUnreadOrders={true}
          />
        </View>
        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">
            Seller Tab Bar
          </Text>
          <TabBar
            activeTab={activeSellerTab}
            onTabPress={setActiveSellerTab}
            variant="seller"
            hasUnreadOrders={false}
          />
        </View>
      </View>
    </ScrollView>
  );
}
