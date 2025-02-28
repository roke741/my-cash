import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
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
import { CirclePlus } from "lucide-react-native";
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
import { BankAccount } from "@/database/types";

// import { BlurView } from "expo-blur";
// import { Dimensions, StyleSheet } from "react-native";

const bankAccountSchema = z.object({
  //bank: z.number(),
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

export default function BalanceMain() {
  const [totalBalance, setTotalBalance] = useState(0.0);
  const [showModal, setShowModal] = useState(false);
  const [isSheetBankOpen, setIsSheetBankOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState({ id: 0, name: "Select a bank" });
  const {balance, bankAccounts, addBankAccount, deleteBankAccount } = useBankAccounts();

  const handleSelectBank = (bankID: number, bankName: string) => {
    setSelectedBank({ id: bankID, name: bankName });
    console.log("Selected Bank:", selectedBank);
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BankAccountSchemaType>({
    resolver: zodResolver(bankAccountSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof bankAccountSchema>> = (data) => {
    //addBankAccount(data.name, 1, data.accountNumber, parseFloat(data.balance));
    console.log(data);
    console.log("Selected Bank:", selectedBank);
    try {
      addBankAccount({
        name: data.name,
        bank_id: selectedBank.id,
        account_number: data.accountNumber,
        balance: parseFloat(data.balance),
      });
    } catch (error) {
      console.error(error);
    }
    setShowModal(false);
  };

  return (
    <>
      <Card size="lg" variant="elevated" className="mb-3 px-4 py-2">
        <Box className="flex flex-row gap-2 items-center">
          <Image
            size="md"
            source={require("@/assets/images/bank.png")}
            alt="money bag"
          />
          <Box>
            <Text size="lg" className="mb-2 font-semibold">
              Total Balance
            </Text>
            <Heading size="2xl">S/. {balance}</Heading>
          </Box>
          <Button
            size="lg"
            className="rounded-full p-3 ml-auto"
            onPress={() => setShowModal(true)}
          >
            <ButtonIcon as={CirclePlus} className="stroke-background-400" />
          </Button>
        </Box>
      </Card>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="lg"
      >
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
                  action="secondary"
                  onPress={() => setIsSheetBankOpen(true)}
                >
                  <ButtonText>{selectedBank.name}</ButtonText>
                </Button>
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
                  <Text size="sm" className="text-red-500">
                    {errors.name.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input variant="outline" size="md">
                      <InputField
                        placeholder="Account Number"
                        keyboardType="numeric"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                      />
                    </Input>
                  )}
                  name="accountNumber"
                />
                {errors.accountNumber && (
                  <Text size="sm" className="text-red-500">
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
                  <Text size="sm" className="text-red-500">
                    {errors.balance.message}
                  </Text>
                )}
                {/* 
                <Input variant="outline" size="md">
                  <InputField placeholder="Name" />
                </Input>
                <Input variant="outline" size="md">
                  <InputField
                    placeholder="Account Number"
                    keyboardType="numeric"
                  />
                </Input>
                <Input variant="outline" size="md">
                  <InputField placeholder="Balance" keyboardType="numeric" />
                </Input> */}
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
                    <Card key={bankAccount.id} size="md" variant="elevated" className="p-4">
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

// const styles = StyleSheet.create({
//   blurContainer: {
//     overflow: "hidden",
//     position: "absolute",
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//   },
// });
