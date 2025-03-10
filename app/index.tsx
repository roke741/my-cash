import React, { useEffect } from "react";
import { ScrollView, useColorScheme } from "react-native";
import Header from "@/components/screen/home/header";
import Balances from "@/components/screen/home/balances";
import Actions from "@/components/screen/home/actions";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import TransactionCard from "@/components/screen/home/transaction-card";
import { DollarSign } from "lucide-react-native";
import Transactions from "@/components/screen/home/transactions";
import { Toaster } from "sonner-native";

export default function DashboardScreen() {
  return (
    <ScrollView>
      <Header />
      <Balances />
      <Actions />
      <Transactions />
    </ScrollView>
  );
}
