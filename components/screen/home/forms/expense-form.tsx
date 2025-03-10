import { Icon, CloseIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import SelectExpenseCategory from "@/components/custom/select/select-expense-category";
import SelectBankAccounts from "@/components/custom/select/select-bank-accounts";
import { BankAccount, ExpenseCategory } from "@/database/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "sonner-native";

const expenseFormSchema = z.object({
  amount: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
      message: "Amount must be a number",
    })
    .refine((value) => parseFloat(value) > 0, {
      message: "Amount must be greater than 0",
    }),
});

type ExpenseFormSchemaType = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;  
}

export default function ExpenseForm({ isOpen, onClose }: ExpenseFormProps) {

  const [isSheetExpenseOpen, setIsSheetExpenseOpen] = useState<boolean>(false);
  const [isSheetBankAccountOpen, setIsSheetBankAccountOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>({
    id: 0,
    name: "Select a category",
  });
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount>({
    id: 0,
    bank_id: 0,
    name: "Select a bank account",
    account_number: "",
    balance: 0,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormSchemaType>({
    resolver: zodResolver(expenseFormSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof expenseFormSchema>> = (data) => {
    if (selectedBankAccount.id === 0) {
      return toast.error("Please select a bank account");
    }
    
    if (selectedCategory.id === 0) {
      return toast.error("Please select a category");
    }

    if (errors.amount) {
      return toast.error(errors.amount.message ?? "Please enter a valid amount");
    }

    try {



    } catch (error) {
      console.error("Error al agregar la cuenta bancaria:", error);
    } finally {
      reset();
    }
  };

  const handleSelectCategory = (expenseCategory: ExpenseCategory) => {
    setSelectedCategory(expenseCategory);
    console.log("Selected Category:", expenseCategory);
  };

  const handleSelectBankAccount = (bankAccount: BankAccount) => {
    setSelectedBankAccount(bankAccount);
    console.log("Selected Bank Account:", bankAccount);
  };
  

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xs"
        style={{ pointerEvents: 'none', zIndex: 1000 }}
      >
        <ModalBackdrop />
        <ModalContent className="border-0 rounded-xl">
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              🔥 Add Expense
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Button onPress={() => setIsSheetBankAccountOpen(true)}>
                <ButtonText>{selectedBankAccount.name}</ButtonText>
              </Button>
              {selectedBankAccount.id === 0 && (
                <Text size="sm" className="text-red-400">
                  Please select a category
                </Text>    
              )}

              <Button onPress={() => setIsSheetExpenseOpen(true)}>
                <ButtonText>{selectedCategory.name}</ButtonText>
              </Button>
              {selectedCategory.id === 0 && (
                <Text size="sm" className="text-red-400">
                  Please select a category
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (

                  <Input variant="outline" size="md">
                    <InputField 
                      placeholder="Amount" 
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      />
                  </Input>
                )}
                name="amount"
              />
              {errors.amount && (
                <Text size="sm" className="text-red-400">
                  {errors.amount.message}
                </Text>
              )}
              
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={onClose}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={handleSubmit(onSubmit)}
            >
              <ButtonText>Save 💸</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SelectExpenseCategory
        isOpen={isSheetExpenseOpen}
        onClose={() => setIsSheetExpenseOpen(false)}
        onSelectExpenseCategory={handleSelectCategory}
      />
      <SelectBankAccounts
        isOpen={isSheetBankAccountOpen}
        onClose={() => setIsSheetBankAccountOpen(false)}
        onSelectBankAccount={handleSelectBankAccount}
      />
    </>
  );
}