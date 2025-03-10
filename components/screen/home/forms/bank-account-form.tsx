import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { Icon, CloseIcon } from "@/components/ui/icon";
import { useState } from "react";
import { Divider } from "@/components/ui/divider";
import SelectBank from "@/components/custom/select/select-bank";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useBankAccounts } from "@/context/bank-accounts-context";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { PiggyBank } from "lucide-react-native";
import { BankAccount, Bank } from "@/database/types";

const bankAccountSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  accountNumber: z.string().min(5, "Account number must be at least 5 digits"),
  balance: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
      message: "Balance must be a number",
    })
    .refine((value) => parseFloat(value) > 0, {
      message: "Balance must be greater than 0",
    }),
});

type BankAccountSchemaType = z.infer<typeof bankAccountSchema>;

interface BankAccountFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BankAccountForm({
  isOpen,
  onClose,
}: BankAccountFormProps) {
  const [isSheetBankOpen, setIsSheetBankOpen] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<Bank>({
    id: 0,
    name: "Select a bank",
    abbreviation: "",
  });
  const { bankAccounts, addBankAccount, deleteBankAccount } = useBankAccounts();

  const handleSelectBank = (bank: Bank) => {
    setSelectedBank(bank);
    console.log("Selected Bank:", selectedBank);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BankAccountSchemaType>({
    resolver: zodResolver(bankAccountSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof bankAccountSchema>> = (data) => {
    try {
      addBankAccount({
        name: data.name,
        bank_id: selectedBank.id,
        account_number: data.accountNumber,
        balance: parseFloat(data.balance),
      });
    } catch (error) {
      console.error(error);
    } finally {
      reset();
      setSelectedBank({ id: 0, name: "Select a bank", abbreviation: "" });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        {/* {showModal && (
      <BlurView
        style={styles.blurContainer}
        intensity={5}
        blurReductionFactor={3}
        experimentalBlurMethod="dimezisBlurView"
        tint="dark"
      />
    )} */}
        <ModalBackdrop />
        <ModalContent className="border-0 rounded-xl">
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              Manage your bank accounts
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
            <Box className="mb-4">
              <Heading size="sm" className="mb-2">
                🏦 Add a new bank account
              </Heading>
              <VStack space="md">
                <Button
                  action="primary"
                  onPress={() => setIsSheetBankOpen(true)}
                >
                  <ButtonText>{selectedBank.name}</ButtonText>
                </Button>
                {selectedBank.id == 0 && (
                  <Text size="sm" className="text-red-400">
                    Please select a bank
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input variant="outline" size="md">
                      <InputField
                        placeholder="Name"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                      />
                    </Input>
                  )}
                  name="name"
                />
                {errors.name && (
                  <Text size="sm" className="text-red-400">
                    {errors.name.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input variant="outline" size="md">
                      <InputField
                        placeholder="Account Number"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                      />
                    </Input>
                  )}
                  name="accountNumber"
                />
                {errors.accountNumber && (
                  <Text size="sm" className="text-red-400">
                    {errors.accountNumber.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input variant="outline" size="md">
                      <InputField
                        placeholder="Balance"
                        keyboardType="numeric"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                      />
                    </Input>
                  )}
                  name="balance"
                />
                {errors.balance && (
                  <Text size="sm" className="text-red-400">
                    {errors.balance.message}
                  </Text>
                )}
                <Button onPress={handleSubmit(onSubmit)}>
                  <ButtonText>Save 💸</ButtonText>
                </Button>
              </VStack>
            </Box>
            <Divider className="my-0.5" />
            <Box>
              <Heading size="sm">List of bank accounts</Heading>
              <VStack space="md" className="mt-2">
                {bankAccounts.length > 0 ? (
                  bankAccounts.map((bankAccount: BankAccount) => (
                    <Card
                      key={bankAccount.id}
                      size="md"
                      variant="elevated"
                      className="p-4"
                    >
                      <Box className="flex flex-row items-center justify-between">
                        <Box className="flex flex-row items-center">
                          <Image
                            size="xs"
                            source={require("@/assets/images/bank.png")}
                            alt="money bag"
                            className="mr-3"
                          />
                          <Box>
                            <Text size="lg" className="mb-1 font-semibold">
                              {bankAccount.name}
                            </Text>
                            <Text size="sm" className="text-typography-950">
                              S/. {bankAccount.balance}
                            </Text>
                          </Box>
                        </Box>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-4"
                          onPress={() => deleteBankAccount(bankAccount.id)}
                        >
                          <ButtonText>Delete</ButtonText>
                        </Button>
                      </Box>
                    </Card>
                  ))
                ) : (
                  <Alert action="info" variant="solid">
                    <AlertIcon as={PiggyBank} />
                    <AlertText>No bank accounts found</AlertText>
                  </Alert>
                )}
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      <SelectBank
        isOpen={isSheetBankOpen}
        onClose={() => setIsSheetBankOpen(false)}
        onSelectBank={handleSelectBank}
      />
    </>
  );
}
