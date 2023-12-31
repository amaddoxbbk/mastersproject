import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  onSelect: (value: string) => void;
  selectedValue: string | string[];
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
      <MenuList maxHeight="200px" overflowY="auto">
        {options.map((option, index) => (
          <MenuItem 
            key={option.value || index}
            onClick={(event) => {
              console.log("Event object: ", event);
              console.log("Clicked index: ", index);
              console.log("Clicked option value: ", option.value);
              console.log("Clicked option label: ", option.label);
              onSelect(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default GenericDropdown;
