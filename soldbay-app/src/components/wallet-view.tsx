import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Lock,
  Wallet as WalletIcon,
} from "lucide-react-native";
import { EmptyState } from "./empty-state";
import { colors } from "@/theme/colors";
import {
  type WalletTransaction,
  type WalletTransactionType,
} from "@/lib/api";

export interface WalletViewData {
  role: "SELLER" | "BUYER";
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

interface WalletViewProps {
  data: WalletViewData | null;
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  intro?: string;
}

const TYPE_META: Record<
  WalletTransactionType,
  {
    label: string;
    sign: "+" | "-" | "";
    color: string;
    icon: typeof ArrowUpRight;
  }
> = {
  PAYOUT: {
    label: "Payout",
    sign: "+",
    color: colors.success,
    icon: ArrowUpRight,
  },
  ESCROW_HOLD: {
    label: "Escrow hold",
    sign: "",
    color: colors.accent,
    icon: Lock,
  },
  ESCROW_RELEASE: {
    label: "Escrow released",
    sign: "+",
    color: colors.success,
    icon: ArrowDownLeft,
  },
  REFUND: {
    label: "Refund",
    sign: "+",
    color: colors.success,
    icon: ArrowDownLeft,
  },
};

function formatAmount(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function WalletRow({ tx }: { tx: WalletTransaction }) {
  const meta = TYPE_META[tx.type] ?? TYPE_META.ESCROW_HOLD;
  const Icon = meta.icon;

  return (
    <View className="flex-row items-center rounded-xl border border-border bg-surface-elevated p-3">
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.neutral100 }}
      >
        <Icon size={18} color={meta.color} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-manrope-medium text-body text-text-primary">
          {tx.description}
        </Text>
        <Text className="mt-0.5 font-manrope text-caption text-text-secondary">
          {meta.label} · {formatDate(tx.createdAt)}
        </Text>
      </View>
      <Text
        className={
          meta.sign === "+"
            ? "font-manrope-semibold text-body text-success"
            : "font-manrope-semibold text-body text-text-primary"
        }
      >
        {meta.sign === "" ? "" : meta.sign}
        {formatAmount(tx.amount)}
      </Text>
    </View>
  );
}

/**
 * SOLDBAY WALLET
 *
 * Balance summary card + a scrolling list of wallet transactions. Shared by
 * the buyer and seller wallet screens; the surrounding tab bar is provided by
 * the calling screen.
 */
export function WalletView({
  data,
  loading,
  refreshing,
  onRefresh,
  intro,
}: WalletViewProps) {
  const transactions = data?.transactions ?? [];

  const balanceLabel = useMemo(() => {
    if (!data) return "$0.00";
    if (data.role === "SELLER") {
      return formatAmount(data.balance);
    }
    // Buyers have no real balance (funds flow through the payment provider);
    // show their active escrow "on hold" as an informational balance.
    const held = data.transactions
      .filter((t) => t.type === "ESCROW_HOLD")
      .reduce((sum, t) => sum + t.amount, 0);
    return formatAmount(held);
  }, [data]);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 12 }}
      data={transactions}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
        />
      }
      ListHeaderComponent={
        <>
          {/* Balance card */}
          <View className="rounded-xl bg-accent p-4">
            <View className="flex-row items-center">
              <WalletIcon size={20} color={colors.textInverse} />
              <Text className="ml-2 font-manrope text-caption text-text-inverse">
                {data?.role === "SELLER" ? "Available balance" : "Escrow on hold"}
              </Text>
            </View>
            <Text className="mt-2 font-manrope-semibold text-h1 text-text-inverse">
              {balanceLabel}
            </Text>
            <Text className="mt-1 font-manrope text-caption text-text-inverse">
              {data?.currency ?? "NGN"}
              {intro ? ` · ${intro}` : ""}
            </Text>
          </View>

          <View className="pt-1">
            <Text className="font-manrope-semibold text-h2 text-text-primary">
              Transactions
            </Text>
          </View>
        </>
      }
      renderItem={({ item }) => <WalletRow tx={item} />}
      ListEmptyComponent={
        <View className="pt-8">
          <EmptyState
            icon={<WalletIcon size={28} color={colors.neutral500} />}
            title="No transactions yet"
            description="Your wallet activity will appear here."
          />
        </View>
      }
    />
  );
}
