import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, ActionsheetItem, ActionsheetItemText } from "@/components/ui/actionsheet";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { Bank } from "@/database/models/types";

interface SelectBankProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBank: (bank: string) => void;
}

export default function SelectBank({
  isOpen,
  onClose,
  onSelectBank
}: SelectBankProps) {

  const db = useSQLiteContext();  

  const [categories, setCategories] = useState<Bank[]>([]);    

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    async function fetchCategories() {
      const categories = await db.getAllAsync<Bank>('SELECT * FROM banks');
      setCategories(categories);
    };  
    fetchCategories();

  }, []);

  return (
    <Actionsheet 
    isOpen={isOpen}
    onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {categories.map((category) => (
            <ActionsheetItem 
              key={category.id} 
              onPress={() => {
                onSelectBank(category.name);
                handleClose();
              }}>
              <ActionsheetItemText>{category.name}</ActionsheetItemText>
            </ActionsheetItem>
          ))}
        </ActionsheetContent>
      </Actionsheet>
  );
}