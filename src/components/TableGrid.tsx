import { SimpleGrid, Text } from "@chakra-ui/react";
import Table from "./GuestTable"; // Import your Table component

interface TableData {
  title: string;
  names: string[];
}

interface Props {
  tables: TableData[];
}

const TableGrid: React.FC<Props> = ({ tables }) => {
  return (
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      padding="10px"
      spacing={6}
    >
      {tables.map((table, index) => (
        <Table key={index} title={table.title} names={table.names} />
      ))}
    </SimpleGrid>
  );
};

export default TableGrid;
