import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { DatabaseZapIcon, RocketIcon } from "lucide-react-native";
import { Image } from "@/components/ui/image";
//import { Image } from "react-native";

export default function Header() {
  const db = useSQLiteContext();
  const [version, setVersion] = useState<string | null>(null);
  useEffect(() => {
    async function fetchVersion() {
      try {
        const result = await db.getFirstAsync<{ "sqlite_version()": string }>(
          "SELECT sqlite_version()"
        );
        if (result) {
          setVersion(result["sqlite_version()"]);
        } else {
          setVersion("Unknown");
        }
      } catch (error) {
        console.error("Error fetching SQLite version:", error);
        setVersion("Unknown");
      }
    }
    fetchVersion();
  }, []);
  return (
    <Box className="flex flex-row justify-between py-4 mb-2">
      <Box>
        <Text size="lg">Hi Jhordie 👋</Text>
        <Heading size="2xl">Welcome back!</Heading>
        <Box className="flex flex-row gap-2">
          <Badge size="sm" variant="solid" action="success">
            <BadgeText>1.0.0</BadgeText>
            <BadgeIcon as={RocketIcon} className="ml-2" />
          </Badge>
          <Badge size="sm" variant="solid" action="info">
            <BadgeText>{version}</BadgeText>
            <BadgeIcon as={DatabaseZapIcon} className="ml-2" />
          </Badge>
        </Box>
      </Box>
      <Box className="gap-2 -rotate-12" style={{ marginRight: 20 }}>
        <Image
          size="md"
          source={require("@/assets/images/money_bag.png")}
          alt="Avatar"
        />
      </Box>
    </Box>
  );
}
