import { Box, Text, UnorderedList, ListItem } from "@chakra-ui/react";

interface TableProps {
  title: string;
  names: string[];
}

const Table: React.FC<TableProps> = ({ title, names }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} className="table">
      <Text fontSize="xl" fontWeight="bold">
        {title}
      </Text>
      <UnorderedList>
        {names.map((name, index) => (
          <ListItem key={index}>{name}</ListItem>
        ))}
      </UnorderedList>
      {/* Other table details */}
    </Box>
  );
};

export default Table;
