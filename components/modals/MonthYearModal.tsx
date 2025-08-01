import React from 'react'
import Modal from '@/components/base/Modal';
import ScrollPicker from '@/components/base/ScrollPicker';
import { View, Text } from 'react-native';
import { Button } from '@/components/base/Button';
import { format } from 'date-fns';

interface MonthYearModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect?: (date: string) => void;
}

const months = [
  'Any', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 21 }, (_, i) => (new Date().getFullYear() + i - 10).toString());

export default function MonthYearModal({ onClose, isVisible, onSelect }: MonthYearModalProps) {
  const today = format(new Date(), "MMMM yyyy");

  const [selectedMonth, setSelectedMonth] = React.useState<string>(today.split(' ')[0]);
  const [selectedYear, setSelectedYear] = React.useState<string>(today.split(' ')[1]);

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View>
        <Text className='text-lg text-text-primary font-semibold text-center'>
          Select date
        </Text>
        <View className="flex-row justify-center items-center gap-6 mt-4">
          <ScrollPicker initialSelectedOption={selectedYear} options={years} onChange={(index) => { setSelectedYear(years[index]) }} />
          <ScrollPicker initialSelectedOption={selectedMonth} options={months} onChange={(index) => { setSelectedMonth(months[index]) }} />
        </View>
        <View className='flex-row justify-end items-center mt-6'>
          <Button onPress={() => { onSelect && onSelect(selectedYear + " " + selectedMonth) }} style={{ paddingVertical: 6, paddingHorizontal: 16 }} textStyle={{ fontSize: 14 }} variant='blue' title='Select' />
        </View>
      </View>
    </Modal>
  )
}