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
} from "@/components";
import { colors } from "@/theme/colors";
import { elevation } from "@/theme/elevation";

export default function IndexPage() {
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
      </ScrollView>
    </ScrollView>
  );
}
