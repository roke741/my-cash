import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { DatabaseZap } from "lucide-react-native";


export default function Header() {
  const db = useSQLiteContext();
  const [version, setVersion] = useState('');
  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<{ 'sqlite_version()': string }>(
        'SELECT sqlite_version()'
      );
      setVersion(result['sqlite_version()']);
    }
    setup();
  }, []);
  return (
  <Box className="flex flex-row justify-between px-8 py-4 text-white">
    <Heading className="text-white text-xl font-bold">🤑 My Cash</Heading>
    <Badge size="sm" variant="solid" action="info">
      <BadgeText>Sqlite {version}</BadgeText>
      <BadgeIcon as={DatabaseZap} className="ml-2" />
    </Badge>
  </Box>
  );
}