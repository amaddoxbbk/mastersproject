import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  onSelect: (value: string) => void;
  selectedValue: string;
  options: Option[];
  title: string;
}

const GenericDropdown = ({ onSelect, selectedValue, options, title }: DropdownProps) => {
  const currentOption = options.find(option => option.value === selectedValue);

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        {title}: {currentOption?.label || "Select"}
      </MenuButton>
      <MenuList>
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            onClick={() => onSelect(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default GenericDropdown;
