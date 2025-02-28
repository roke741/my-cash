import { Card } from "@/components/ui/card";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";  
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react-native";

interface TransactionCardProps {
  title: string;
  description: string;
  amount: number;
  isIncome: boolean;  
}

export default function TransactionCard({
  title,
  description,
  amount,
  isIncome
}: TransactionCardProps) {
  return (
    <Card size="lg" variant="elevated" className="mb-3 px-4 py-3">
      <HStack space="md" className="justify-between items-center">
        <VStack space="xs">
          <Text size="sm" className="font-semibold">
            {title}
          </Text>
          <Text size="xs">
            {description}
          </Text>
        </VStack>
        <HStack space="sm" className="items-center">
          <Text
            size="sm"
            className={`font-bold ${
              isIncome ? "text-green-500" : "text-red-500"
            }`}
          >
            {isIncome ? "+" : "-"} S/.{amount}
          </Text>
          {isIncome ? (
            <ArrowUpIcon size={16} color="#22c55e" />
          ) : (
            <ArrowDownIcon size={16} color="#ef4444" />
          )}
        </HStack>
      </HStack>
    </Card>
  );
}    