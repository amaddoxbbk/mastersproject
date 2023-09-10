import React, { useRef, useEffect } from "react";
import { SimpleGrid, Box, useMediaQuery } from "@chakra-ui/react";
import Table from "./GuestTable";

interface TableData {
  title: string;
  names: string[];
}

interface Props {
  tables: TableData[];
}

const TableGrid: React.FC<Props> = ({ tables }) => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const tableRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let maxHeight = 0;

    // Find the maximum height among all tables
    tableRefs.current.forEach((table) => {
      if (table) {
        const height = table.getBoundingClientRect().height;
        if (height > maxHeight) {
          maxHeight = height;
        }
      }
    });

    // Set all tables to the maximum height
    tableRefs.current.forEach((table) => {
      if (table) {
        table.style.minHeight = `${maxHeight}px`;
      }
    });
  }, [tables]);


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
          ref={(el) => (tableRefs.current[index] = el)}
        >
          <Table title={table.title} names={table.names} />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default TableGrid;
