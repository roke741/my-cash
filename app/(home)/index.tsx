"use client";
import { Box } from "@/components/ui/box";
import { Text, ScrollView, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import Header from "@/components/screen/home/header";
import Balances from "@/components/screen/home/balances";
import Actions from "@/components/screen/home/actions";

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  return (
    <ScrollView>
      <Header />
      <Balances />
      <Actions />
      <Box className="p-4">
        <Heading size="lg" className="mb-4">
          💰 Recent Transactions
        </Heading>
        <VStack space="md">
          <Card size="md" variant="elevated" className="mb-3">
            <HStack space="md" className="justify-between">
              <VStack space="md">
                <Text className="text-md mb-2">Payment</Text>
                <Text className="text-sm">Payment from John Doe</Text>
              </VStack>
              <Text className="text-md">💲52040.60</Text>
            </HStack>
          </Card>

          <Card size="md" variant="elevated" className="mb-3">
            <HStack space="md" className="justify-between">
              <VStack space="md">
                <Text className="text-md mb-2">Payment</Text>
                <Text className="text-sm">Payment from John Doe</Text>
              </VStack>
              <Text className="text-md">💲52040.60</Text>
            </HStack>
          </Card>

          <Card size="md" variant="elevated" className="mb-3">
            <HStack space="md" className="justify-between">
              <VStack space="md">
                <Text className="text-md mb-2">Payment</Text>
                <Text className="text-sm">Payment from John Doe</Text>
              </VStack>
              <Text className="text-md">💲52040.60</Text>
            </HStack>
          </Card>

          <Card size="md" variant="elevated" className="mb-3">
            <HStack space="md" className="justify-between">
              <VStack space="md">
                <Text className="text-md mb-2">Payment</Text>
                <Text className="text-sm">Payment from John Doe</Text>
              </VStack>
              <Text className="text-md">💲52040.60</Text>
            </HStack>
          </Card>

          <Card size="md" variant="elevated" className="mb-3">
            <HStack space="md" className="justify-between">
              <VStack space="md">
                <Text className="text-md mb-2">Payment</Text>
                <Text className="text-sm">Payment from John Doe</Text>
              </VStack>
              <Text className="text-md">💲52040.60</Text>
            </HStack>
          </Card>

          <Card size="md" variant="elevated" className="mb-3">
            <HStack space="md" className="justify-between">
              <VStack space="md">
                <Text className="text-md mb-2">Payment</Text>
                <Text className="text-sm">Payment from John Doe</Text>
              </VStack>
              <Text className="text-md">💲52040.60</Text>
            </HStack>
          </Card>
        </VStack>
      </Box>
    </ScrollView>
  );
}
