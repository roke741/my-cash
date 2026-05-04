import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";

interface BalanceCardProps {
  amount: number;
  title: string;
  icon: any;
  color?: string;
}

export default function BalanceCard({ amount, title, icon, color }: BalanceCardProps) {
  const amountClass = color ?? 'text-primary-600';

  return (
    <Card
      size="lg"
      variant="elevated"
      className="flex-1 p-4 rounded-2xl border border-outline-200/15 bg-background-0"
    >
      <Box className="flex flex-row gap-3 items-center">
        <Image size="xs" source={icon} alt="chart" />
        <Box className="flex-1">
          <Text size="xs" className="font-semibold text-typography-500">
            {title}
          </Text>
          <Text size="lg" className={`font-bold ${amountClass}`}>
            S/ {amount.toFixed(2)}
          </Text>
        </Box>
      </Box>
    </Card>
  );
}
