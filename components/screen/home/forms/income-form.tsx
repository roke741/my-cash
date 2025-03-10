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
import SelectBankAccounts from "@/components/custom/select/select-bank-accounts";
import { BankAccount } from "@/database/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from 'sonner-native';

const incomeFormSchema = z.object({
  amount: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
      message: "Amount must be a number",
    })
    .refine((value) => parseFloat(value) > 0, {
      message: "Amount must be greater than 0",
    }),
  description: z.string().min(5, "Description must be at least 5 characters"),

});

type IncomeFormSchemaType = z.infer<typeof incomeFormSchema>;

interface IncomeFormProps {
  isOpen: boolean;
  onClose: () => void;  
}

export default function IncomeForm({ isOpen, onClose }: IncomeFormProps) {

  const [isSheetBankAccountOpen, setIsSheetBankAccountOpen] = useState<boolean>(false);
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
  } = useForm<IncomeFormSchemaType>({
    resolver: zodResolver(incomeFormSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof incomeFormSchema>> = (data) => {
    try {
      console.log("Form data:", data);
      toast.success("Income added successfully");
    } catch (error) {
      console.error("Error al agregar la cuenta bancaria:", error);
    } finally {
      reset();
    }
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
      >
        <ModalBackdrop />
        <ModalContent className="border-0 rounded-xl">
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              🤑 Add Income
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
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input variant="outline" size="md">
                    <InputField
                      placeholder="Description"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                    />
                  </Input>
                )}
                name="description"
              />
              {errors.description && (
                <Text size="sm" className="text-red-400">
                  {errors.description.message}
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

      <SelectBankAccounts
        isOpen={isSheetBankAccountOpen}
        onClose={() => setIsSheetBankAccountOpen(false)}
        onSelectBankAccount={handleSelectBankAccount}
      />
    </>
  );
}