import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, ActionsheetItem, ActionsheetItemText } from "@/components/ui/actionsheet";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { ExpenseCategory } from "@/database/types";

interface SelectExpenseCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExpenseCategory: (expenseCategory: ExpenseCategory) => void;
}

export default function SelectExpenseCategory({
  isOpen,
  onClose,
  onSelectExpenseCategory
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
                onSelectExpenseCategory(category);
                handleClose();
              }}>
              <ActionsheetItemText>{category.name}</ActionsheetItemText>
            </ActionsheetItem>
          ))}
        </ActionsheetContent>
      </Actionsheet>
  );
}