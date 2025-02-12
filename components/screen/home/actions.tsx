import { Box } from "@/components/ui/box";
import { AddIcon, Icon, CloseIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { ScrollView, Text } from "react-native";
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
import SelectBank from "@/components/custom/select/select-bank";

export default function Actions() {
  const [showModalExpense, setShowModalExpense] = useState(false);
  const [showModalIncome, setShowModalIncome] = useState(false);
  const [showModalBankAccount, setShowModalBankAccount] = useState(false);

  const [isSheetExpenseOpen, setIsSheetExpenseOpen] = useState(false);
  const [isSheetBankAccountOpen, setIsSheetBankAccountOpen] = useState(false);
  const [isSheetBankOpen, setIsSheetBankOpen] = useState(false);  

  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  const [selectedBank, setSelectedBank] = useState("Select Bank");
  const [selectedBankAccount, setSelectedBankAccount] = useState(
    "Select Bank Account"
  );


  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    console.log("Selected Category:", category);
  };

  const handleSelectBank = (bank: string) => {
    setSelectedBank(bank);
    console.log("Selected Bank:", bank);
  };

  const handleSelectBankAccount = (bankAccount: string) => {
    setSelectedBankAccount(bankAccount);
    console.log("Selected Bank Account:", bankAccount);
  };

  const saveExpense = () => {
    console.log("Save Expense");
  }

  return (
    <>
      <Box className="py-6 px-2">
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <ButtonGroup flexDirection="row" space="md">
            <Button
              size="lg"
              variant="solid"
              action="secondary"
              className="h-20 w-28 bg-zinc-100"
              onPress={() => setShowModalExpense(true)}
            >
              <VStack space="md">
                <ButtonIcon as={AddIcon} className="text-green-500 mx-auto" />
                <ButtonText className="text-xs font-bold">Expense</ButtonText>
              </VStack>
            </Button>
            <Button
              size="lg"
              variant="solid"
              action="secondary"
              className="h-20 w-28 bg-zinc-100"
            >
              <VStack space="md">
                <ButtonIcon as={AddIcon} className="text-green-500 mx-auto" />
                <ButtonText className="text-xs font-bold">Income</ButtonText>
              </VStack>
            </Button>
            <Button
              size="lg"
              variant="solid"
              action="secondary"
              className="h-20 w-28 bg-zinc-100"
              onPress={() => setShowModalBankAccount(true)}
            >
              <VStack space="md">
                <ButtonIcon as={AddIcon} className="text-green-500 mx-auto" />
                <ButtonText className="text-xs font-bold text-center">Bank Account</ButtonText>
              </VStack>
            </Button>
            <Button
              size="lg"
              variant="solid"
              action="secondary"
              className="h-20 w-28 bg-zinc-100"
            >
              <VStack space="md">
                <ButtonIcon as={AddIcon} className="text-green-500 mx-auto" />
                <ButtonText className="text-xs font-bold">Add</ButtonText>
              </VStack>
            </Button>
          </ButtonGroup>
        </ScrollView>
      </Box>
      {/* Expense Modal */}
      <Modal
        isOpen={showModalExpense}
        onClose={() => {
          setShowModalExpense(false);
        }}
        size="xs"
      >
        <ModalBackdrop />
        <ModalContent>
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
                <ButtonText>Select bank account</ButtonText>
              </Button>

              <Button onPress={() => setIsSheetExpenseOpen(true)}>
                <ButtonText>{selectedCategory}</ButtonText>
              </Button>
              <Input variant="outline" size="md">
                <InputField placeholder="Amount" keyboardType="numeric" />
              </Input>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModalExpense(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setShowModalExpense(false);
              }}
            >
              <ButtonText>Save 💸</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Bank Account Modal */}
      <Modal
        isOpen={showModalBankAccount}
        onClose={() => {
          setShowModalBankAccount(false);
        }}
        size="xs"
      > 
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              👛 Add Bank Account
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
              <Button onPress={() => setIsSheetBankOpen(true)}>  
                <ButtonText>{selectedBank}</ButtonText>   
              </Button> 
              <Input variant="outline" size="md">
                <InputField placeholder="Name"/>
              </Input>
              <Input variant="outline" size="md">
                <InputField placeholder="Account Number" keyboardType="numeric"/>
              </Input>
              <Input variant="outline" size="md">
                <InputField placeholder="Balance" keyboardType="numeric"/>
              </Input>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModalExpense(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setShowModalExpense(false);
              }}
            >
              <ButtonText>Save 💸</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <SelectExpenseCategory
        isOpen={isSheetExpenseOpen}
        onClose={() => setIsSheetExpenseOpen(false)}
        onSelectCategory={handleSelectCategory}
      />
      <SelectBankAccounts
        isOpen={isSheetBankAccountOpen}
        onClose={() => setIsSheetBankAccountOpen(false)}
        onSelectBank={handleSelectBankAccount}
      />
      <SelectBank
        isOpen={isSheetBankOpen}
        onClose={() => setIsSheetBankOpen(false)}
        onSelectBank={handleSelectBank}
      />
    </>
  );
}
