import React, { useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import TransactionCard from "@/components/screen/home/transaction-card";

export default function Transactions() {
  return (
    <Box className="mb-2">
      <Heading size="lg" className="mb-4">
        💰 Recent Transactions
      </Heading>
      <VStack space="md">
        <TransactionCard
          title="🍗 Comida"
          description="Pago de comida"
          amount={52040.6}
          isIncome={true}
        />
      </VStack>
    </Box>
  );
}