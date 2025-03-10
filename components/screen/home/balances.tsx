import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { useState } from "react";
import BalanceCard from "./balance-card";
import { Button, ButtonText } from "@/components/ui/button";
import BalanceMain from "./balance-main";
import { BankAccountsProvider } from "@/context/bank-accounts-context";

export default function Balances() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  //000.00
  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <BankAccountsProvider>
      <Box className="w-full mb-4">
        <BalanceMain />
        <Box className="flex flex-row gap-3">
          <BalanceCard
            amount={0.00}
            title="Total income"
            icon={require("@/assets/images/chart_increasing.png")}
            color="text-green-400"
          />
          <BalanceCard
            amount={0.00}
            title="Total expenses"
            icon={require("@/assets/images/chart_decreasing.png")}
            color="text-red-400"
          />
        </Box>
      </Box>
    </BankAccountsProvider>
  );
}
