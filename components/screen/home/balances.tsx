import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "react-native";
import { useState } from "react";

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
    <Box className="p-4">
      <Card size="md" variant="elevated" className="mb-3">
        <Text className="text-md mb-2">🏦 Total Balance</Text>
        <Heading size="xl" className="mb-1">
          $000.00
        </Heading>
      </Card>
      <HStack space="md">
        <Card size="md" variant="elevated" className="flex-1">
          <Text className="text-sm mb-2">📈 Total expenses</Text>
          <Heading size="lg" className="mb-1">
            $000.00
          </Heading>
        </Card>
        <Card size="md" variant="elevated" className="flex-1">
          <Text className="text-sm mb-2">📉 Total income </Text>
          <Heading size="lg" className="mb-1">
            $000.00
          </Heading>
        </Card>
      </HStack>
    </Box>
  );
}
