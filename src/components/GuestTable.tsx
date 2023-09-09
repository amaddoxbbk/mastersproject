import { Box, Text, UnorderedList, ListItem, Card } from "@chakra-ui/react";

interface TableProps {
  title: string;
  names: string[];
}

const Table: React.FC<TableProps> = ({ title, names }) => {
  return (
    <Card 
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      textAlign="center"
      boxShadow="md"
      minW={{ base:"80%", md: "100%", lg: "100%", xl: "100%" }
    }
    >
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        {title}
      </Text>
      <UnorderedList textAlign="center" listStyleType='none' margin='0'>
        {names.map((name, index) => (
          <ListItem key={index} textAlign="center">
            {name}
          </ListItem>
        ))}
      </UnorderedList>
    </Card>
  );
};

export default Table;
