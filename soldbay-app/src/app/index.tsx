import { ScrollView, Text, View } from "react-native";
import {
  CampusDeliveryIcon,
  CampusPickupIcon,
  DormEssentialsIcon,
  ElectronicsIcon,
  EmptyCrateIllustration,
  FashionIcon,
  SoldbayAppIcon,
  SoldbayMark,
  SoldStamp,
  TextbooksIcon,
  VerifiedShieldIcon,
  Button,
  TextField,
  SearchBar,
  BuyerBottomNav,
  FilterChip,
  ListingCard,
  SkeletonCard,
  EmptyState,
} from "@/components";
import { MagnifyingGlass, BookOpen, DeviceMobile, TShirt, Lamp, Faders, SquaresFour, ArrowClockwise } from "phosphor-react-native";
import { useState } from "react";
import { colors } from "@/theme/colors";
import { elevation } from "@/theme/elevation";

export default function IndexPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "search" | "orders" | "profile">("browse");
  return (
    <ScrollView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 48 }}
        className="flex-1 px-2.5 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Soldbay Brand Mark */}
        <View className="mb-4 flex-row items-center gap-2">
          <SoldbayMark size={40} />
          <View className="flex-1">
            <Text className="font-fraunces text-h1 text-text-primary">
              Soldbay
            </Text>
            <Text className="font-manrope text-small text-text-secondary">
              Project Logo & Custom Icons (design.pen & Section 22)
            </Text>
          </View>
        </View>

        {/* 1. Official Project Logo & App Icon (Section 22 Update) */}
        <View className="mb-4">
          <Text className="mb-1.5 font-manrope-semibold text-body-semibold uppercase tracking-wider text-text-secondary">
            1. Project Logo & App Icons (Section 22)
          </Text>

          <View
            style={elevation.card}
            className="rounded-lg bg-surface-elevated p-2.5"
          >
            <View className="flex-row items-center justify-around py-1">
              {/* iOS Icon */}
              <View className="items-center">
                <View
                  style={elevation.raised}
                  className="rounded-xl overflow-hidden"
                >
                  <SoldbayAppIcon size={76} variant="ios" rounded={true} />
                </View>
                <Text className="mt-2 font-manrope-semibold text-body-medium text-text-primary">
                  iOS App Icon
                </Text>
                <Text className="font-manrope text-caption text-text-secondary">
                  Cream + Olive S + Tan Dot
                </Text>
                <Text className="text-[10px] font-manrope text-text-tertiary">
                  1024×1024
                </Text>
              </View>

              {/* Android Adaptive Icon */}
              <View className="items-center">
                <View
                  style={elevation.raised}
                  className="rounded-xl overflow-hidden"
                >
                  <SoldbayAppIcon size={76} variant="android" rounded={true} />
                </View>
                <Text className="mt-2 font-manrope-semibold text-body-medium text-text-primary">
                  Android Foreground
                </Text>
                <Text className="font-manrope text-caption text-text-secondary">
                  Olive Bg + Cream S + Tan Dot
                </Text>
                <Text className="text-[10px] font-manrope text-text-tertiary">
                  512×512 Adaptive
                </Text>
              </View>

              {/* Android Themed Monochrome */}
              <View className="items-center">
                <View
                  style={elevation.raised}
                  className="rounded-xl overflow-hidden"
                >
                  <SoldbayAppIcon
                    size={76}
                    variant="monochrome"
                    rounded={true}
                  />
                </View>
                <Text className="mt-2 font-manrope-semibold text-body-medium text-text-primary">
                  Monochrome
                </Text>
                <Text className="font-manrope text-caption text-text-secondary">
                  Material You Themed
                </Text>
                <Text className="text-[10px] font-manrope text-text-tertiary">
                  512×512 Mask
                </Text>
              </View>
            </View>

            {/* Spec metadata badge */}
            <View className="mt-3 rounded-md bg-surface p-2">
              <Text className="font-manrope-medium text-caption text-text-primary">
                Design Spec: Fraunces SemiBold &quot;S&quot; glyph with
                signature Tan Accent period dot (#B8A678) tucked next to the
                bottom-right terminal curve.
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Trust & Verification Custom Icons (Section 10 & 13) */}
        <View className="mb-4">
          <Text className="mb-1.5 font-manrope-semibold text-body-semibold uppercase tracking-wider text-text-secondary">
            2. Trust & Status (Section 10 & 13)
          </Text>

          <View
            style={elevation.card}
            className="rounded-lg bg-surface-elevated p-2.5"
          >
            {/* Verified Seller Shield */}
            <View className="mb-3 border-b border-border pb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                  <View className="h-7 w-7 items-center justify-center rounded-full bg-accent-tint/60">
                    <VerifiedShieldIcon size={18} />
                  </View>
                  <View>
                    <Text className="font-manrope-semibold text-body-medium text-text-primary">
                      Verified Campus Seller
                    </Text>
                    <Text className="font-manrope text-caption text-text-secondary">
                      Shield-check path (ID: ZXAqa) in Accent tan
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-1.5">
                  <VerifiedShieldIcon size={14} />
                  <VerifiedShieldIcon size={20} />
                  <VerifiedShieldIcon size={26} />
                </View>
              </View>
            </View>

            {/* Sold Stamp */}
            <View>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-manrope-semibold text-body-medium text-text-primary">
                    Sold / Unavailable Stamp
                  </Text>
                  <Text className="font-manrope text-caption text-text-secondary">
                    Border fill + Olive bold text (-4° tilt)
                  </Text>
                </View>

                <View className="flex-row items-center gap-1.5">
                  <SoldStamp size="sm" />
                  <SoldStamp size="md" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 3. Marketplace-Specific Concepts (Section 13) */}
        <View className="mb-4">
          <Text className="mb-1.5 font-manrope-semibold text-body-semibold uppercase tracking-wider text-text-secondary">
            3. Marketplace Logistics (Section 13)
          </Text>

          <View className="flex-row gap-2">
            {/* Campus Pickup Point */}
            <View
              style={elevation.card}
              className="flex-1 rounded-lg bg-surface-elevated p-2"
            >
              <View className="mb-2 h-7 w-7 items-center justify-center rounded-md bg-surface">
                <CampusPickupIcon size={22} />
              </View>
              <Text className="font-manrope-semibold text-body-medium text-text-primary">
                Campus Pickup
              </Text>
              <Text className="mt-0.5 font-manrope text-caption text-text-secondary">
                Designated safe campus meetup pin with mortarboard cap
              </Text>
            </View>

            {/* Delivery-on-Campus */}
            <View
              style={elevation.card}
              className="flex-1 rounded-lg bg-surface-elevated p-2"
            >
              <View className="mb-2 h-7 w-7 items-center justify-center rounded-md bg-surface">
                <CampusDeliveryIcon size={22} />
              </View>
              <Text className="font-manrope-semibold text-body-medium text-text-primary">
                Campus Delivery
              </Text>
              <Text className="mt-0.5 font-manrope text-caption text-text-secondary">
                Soldbay-only speedy on-campus courier parcel
              </Text>
            </View>
          </View>
        </View>

        {/* 4. Product Taxonomy Category Icons (Section 13) */}
        <View className="mb-4">
          <Text className="mb-1.5 font-manrope-semibold text-body-semibold uppercase tracking-wider text-text-secondary">
            4. Taxonomy Category Art (Section 13)
          </Text>

          <View
            style={elevation.card}
            className="rounded-lg bg-surface-elevated p-2"
          >
            <View className="flex-row justify-between">
              {/* Textbooks */}
              <View className="items-center">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-surface">
                  <TextbooksIcon size={22} />
                </View>
                <Text className="mt-1 font-manrope-medium text-caption text-text-primary">
                  Textbooks
                </Text>
              </View>

              {/* Electronics */}
              <View className="items-center">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-surface">
                  <ElectronicsIcon size={22} />
                </View>
                <Text className="mt-1 font-manrope-medium text-caption text-text-primary">
                  Electronics
                </Text>
              </View>

              {/* Fashion */}
              <View className="items-center">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-surface">
                  <FashionIcon size={22} />
                </View>
                <Text className="mt-1 font-manrope-medium text-caption text-text-primary">
                  Fashion
                </Text>
              </View>

              {/* Dorm Essentials */}
              <View className="items-center">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-surface">
                  <DormEssentialsIcon size={22} />
                </View>
                <Text className="mt-1 font-manrope-medium text-caption text-text-primary">
                  Dorm
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. Empty State / Shelf Illustration (Section 9) */}
        <View className="mb-4">
          <Text className="mb-1.5 font-manrope-semibold text-body-semibold uppercase tracking-wider text-text-secondary">
            5. Bespoke Empty State Art (Section 9)
          </Text>

          <View
            style={elevation.card}
            className="items-center justify-center rounded-lg bg-surface-elevated p-4"
          >
            <EmptyCrateIllustration
              size={96}
              crateColor={colors.textPrimary}
              sparkleColor={colors.accent}
            />
            <Text className="mt-3 font-manrope-semibold text-h2 text-text-primary">
              No Listings Found
            </Text>
            <Text className="mt-1 text-center font-manrope text-body text-text-secondary">
              Bespoke line art crate shelf with discovery sparkles (IDs:
              pt_filt_crate, pt37ac8)
            </Text>
          </View>
        </View>

        {/* 6. Buttons & Forms */}
        <View className="mb-4">
          <Text className="mb-1.5 font-manrope-semibold text-body-semibold uppercase tracking-wider text-text-secondary">
            6. Buttons & Forms
          </Text>

          <View style={elevation.card} className="rounded-lg bg-surface-elevated p-4">
            <View className="mb-4 flex-row flex-wrap gap-2">
              <Button label="Primary" />
              <Button label="Outline" variant="outline" />
              <Button label="Secondary" variant="secondary" />
              <Button label="Ghost" variant="ghost" />
            </View>
            <View className="mb-4">
              <TextField label="Text Input" placeholder="Placeholder text..." />
            </View>
            <View className="mb-4">
              <TextField label="Error Input" error="This field is required" defaultValue="Invalid value" />
            </View>
            <View>
              <SearchBar placeholder="Search textbooks, tech, dorm..." />
            </View>
          </View>
        </View>

        {/* 7. Navigation & Filtering */}
        <View className="mb-4">
          <Text className="mb-1.5 font-manrope-semibold text-body-semibold uppercase tracking-wider text-text-secondary">
            7. Navigation & Filtering
          </Text>

          <View style={elevation.card} className="rounded-lg bg-surface-elevated p-4">
            <Text className="font-manrope-medium text-caption text-text-secondary mb-2">Filter Chips</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible">
              <View className="flex-row gap-2 pb-2">
                <FilterChip label="Filters" badgeCount={2} icon={Faders} onPress={() => {}} />
                <FilterChip label="All" isActive variant="secondary" icon={SquaresFour} onPress={() => {}} />
                <FilterChip label="Textbooks" icon={BookOpen} onPress={() => {}} />
                <FilterChip label="Tech" icon={DeviceMobile} isActive variant="accent" onPress={() => {}} />
              </View>
            </ScrollView>

            <Text className="font-manrope-medium text-caption text-text-secondary mt-4 mb-2">Buyer Bottom Nav</Text>
            <View className="border border-border rounded-lg overflow-hidden">
              <BuyerBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            </View>
          </View>
        </View>

        {/* 8. Listing Cards & Skeletons */}
        <View className="mb-4">
          <Text className="mb-1.5 font-manrope-semibold text-body-semibold uppercase tracking-wider text-text-secondary">
            8. Listing Cards & Skeletons
          </Text>

          <View className="flex-row flex-wrap gap-3">
            <ListingCard 
              title="MacBook Pro M1 2020 8GB/256GB" 
              price={500000} 
              sellerName="Kemi Thrift Store" 
            />
            <ListingCard 
              title="AirPods Pro Gen 2" 
              price={85000}
              discountPrice={70000}
              sellerName="Campus Gadgets Hub Long Name" 
            />
            <ListingCard 
              title="Calculus Early Transcendentals 9th Ed." 
              price={15000} 
              sellerName="Ade & Sons" 
              isSold 
            />
            <SkeletonCard />
          </View>
        </View>

        {/* 9. Empty States */}
        <View className="mb-10">
          <Text className="mb-1.5 font-manrope-semibold text-body-semibold uppercase tracking-wider text-text-secondary">
            9. Empty States
          </Text>

          <View style={elevation.card} className="rounded-lg bg-surface-elevated overflow-hidden mb-4">
            <View className="h-[300px]">
              <EmptyState variant="filtered" onClearFilters={() => {}} />
            </View>
          </View>

          <View style={elevation.card} className="rounded-lg bg-surface-elevated overflow-hidden">
            <View className="h-[300px]">
              <EmptyState variant="empty" />
            </View>
          </View>
        </View>

      </ScrollView>
    </ScrollView>
  );
}
