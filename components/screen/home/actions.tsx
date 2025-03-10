import { Box } from "@/components/ui/box";
import { AddIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { useState } from "react";
import ExpenseForm from "./forms/expense-form";
import IncomeForm from "./forms/income-form";

export default function Actions() {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  return (
    <>
      <Box className="mb-4">
        <ButtonGroup flexDirection="row" space="md">
          <Button
            size="lg"
            className="py-4 px-2 h-16 flex-1 rounded-xl"
            variant="solid"
            onPress={() => setShowIncomeForm(true)}
          >
            <VStack space="md">
              <ButtonIcon as={AddIcon} className="text-green-500 mx-auto" />
              <ButtonText className="text-xs font-bold">Income</ButtonText>
            </VStack>
          </Button>
          <Button
            size="lg"
            className="py-4 px-2 h-16 flex-1 rounded-xl"
            variant="solid"
            onPress={() => setShowExpenseForm(true)}
          >
            <VStack space="md">
              <ButtonIcon as={AddIcon} className="text-green-500 mx-auto" />
              <ButtonText className="text-xs font-bold">Expense</ButtonText>
            </VStack>
          </Button>
        </ButtonGroup>
      </Box>
      <ExpenseForm
        isOpen={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
      />
      <IncomeForm
        isOpen={showIncomeForm}
        onClose={() => setShowIncomeForm(false)}
      />
    </>
  );
}
