// Define the shape of the table data
interface TableData {
    title: string;
    names: string[];
  }
  
  export const createTableData = (guests: any[], sizeNormalTablesNumber: number, sizeTopTableNumber:number) => {
    let tables: TableData[] = [];
    let currentTable: string[] = [];
    let topTable: string[] = [];
    let currentTableIndex = 1;
  
    // Sort guests by the 'relationship' column
    const sortedGuests = [...guests].sort((a, b) => {
      if (a.relationship < b.relationship) return -1;
      if (a.relationship > b.relationship) return 1;
      return 0;
    });

      // Populate the top table first
  for (let i = 0; i < sizeTopTableNumber; i++) {
    if (sortedGuests[i]) {
      topTable.push(sortedGuests[i].attendee_name);
    }
  }

  // Add the top table to the tables array
  if (topTable.length > 0) {
    tables.push({
      title: "Top Table",
      names: [...topTable],
    });
  }
  
 // Populate the remaining normal tables
 for (let i = sizeTopTableNumber; i < sortedGuests.length; i++) {
    currentTable.push(sortedGuests[i].attendee_name);
    if (currentTable.length === sizeNormalTablesNumber) {
      tables.push({
        title: `Table ${currentTableIndex}`,
        names: [...currentTable],
      });
      currentTable = [];
      currentTableIndex++;
    }
  }

  // Add any remaining guests to the last table
  if (currentTable.length > 0) {
    tables.push({
      title: `Table ${currentTableIndex}`,
      names: [...currentTable],
    });
  }

  
    return tables;
  };
  