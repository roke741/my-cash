import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";

interface BalanceCardProps {
  amount: number;
  title: string;
  icon: any;
  color: string;
}

export default function BalanceCard({
  amount,
  title,
  icon,
  color,
}: BalanceCardProps) {
  return (
    <Card size="lg" variant="elevated" className="flex-1 px-4 py-2">
      <Box className="flex flex-row gap-2 items-center">
        <Image size="xs" source={icon} alt="chart" />
        <Box>
          <Text size="sm" className="font-semibold">
            {title}
          </Text>
          <Heading size="md" className={`font-bold ${color}`}>
            S/. {amount}
          </Heading>
        </Box>
      </Box>
    </Card>
  );
}
