import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { CirclePlus } from "lucide-react-native";

import { useBankAccounts } from "@/context/bank-accounts-context";
import BankAccountForm from "./forms/bank-account-form";

// import { BlurView } from "expo-blur";
// import { Dimensions, StyleSheet } from "react-native";

export default function BalanceMain() {
  const [showForm, setShowForm] = useState(false);
  const { balance } = useBankAccounts();

  return (
    <>
      <Card size="lg" variant="elevated" className="mb-3 px-4 py-2">
        <Box className="flex flex-row gap-3 items-center">
          <Image
            size="md"
            source={require("@/assets/images/bank.png")}
            alt="money bag"
          />
          <Box>
            <Text size="lg" className="mb-2 font-semibold">
              Total Balance
            </Text>
            <Heading size="2xl">S/. {balance}</Heading>
          </Box>
          <Button
            size="lg"
            className="rounded-full p-3 ml-auto"
            onPress={() => setShowForm(true)}
          >
            <ButtonIcon as={CirclePlus} className="text-green-500" />
          </Button>
        </Box>
      </Card>
      <BankAccountForm isOpen={showForm} onClose={() => setShowForm(false)} />
    </>
  );
}

// const styles = StyleSheet.create({
//   blurContainer: {
//     overflow: "hidden",
//     position: "absolute",
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//   },
// });
