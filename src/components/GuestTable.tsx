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
      maxW={{ base: "300px", lg: "300px" }}
      minW={{ base: "200px", lg: "200px" }
    }
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
    </Card>
  );
};

export default Table;
