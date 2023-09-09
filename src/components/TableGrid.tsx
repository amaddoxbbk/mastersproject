import { SimpleGrid, Box } from "@chakra-ui/react";
import Table from "./GuestTable";
import { useMediaQuery } from "@chakra-ui/react";

interface TableData {
  title: string;
  names: string[];
}

interface Props {
  tables: TableData[];
}

const TableGrid: React.FC<Props> = ({ tables }) => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  return (
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 3, xl: 5 }}
      padding="15px"
      spacing="15px"
    >
      {tables.map((table, index) => (
        <Box
          key={index}
          w="100%"
          display="flex"
          justifyContent={isLargerThan768 ? "flex-start" : "center"}
        >
          <Table title={table.title} names={table.names} />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default TableGrid;
