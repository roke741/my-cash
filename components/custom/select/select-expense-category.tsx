import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, ActionsheetItem, ActionsheetItemText } from "@/components/ui/actionsheet";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { ExpenseCategory } from "@/database/models/types";

interface SelectExpenseCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
}

export default function SelectExpenseCategory({
  isOpen,
  onClose,
  onSelectCategory
}: SelectExpenseCategoryProps) {

  const db = useSQLiteContext();  

  const [categories, setCategories] = useState<ExpenseCategory[]>([]);    

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    async function fetchCategories() {
      const categories = await db.getAllAsync<ExpenseCategory>('SELECT * FROM categories');
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
                onSelectCategory(category.name);
                handleClose();
              }}>
              <ActionsheetItemText>{category.name}</ActionsheetItemText>
            </ActionsheetItem>
          ))}
        </ActionsheetContent>
      </Actionsheet>
  );
}