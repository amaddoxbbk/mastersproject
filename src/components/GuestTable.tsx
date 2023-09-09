import { Box, Text, UnorderedList, ListItem } from "@chakra-ui/react";

interface TableProps {
  title: string;
  names: string[];
}

const Table: React.FC<TableProps> = ({ title, names }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      textAlign="center"
      boxShadow="md"
    >
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        {title}
      </Text>
      <UnorderedList textAlign="center">
        {names.map((name, index) => (
          <ListItem key={index} textAlign="center">
            {name}
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default Table;
