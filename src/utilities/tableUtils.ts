// Define the shape of the table data
interface TableData {
    title: string;
    names: string[];
  }
  
  export const createTableData = (guests: any[], sizeNormalTablesNumber: number) => {
    let tables: TableData[] = [];
    let currentTable: string[] = [];
    let currentTableIndex = 1;
  
    // Sort guests by the 'relationship' column
    const sortedGuests = [...guests].sort((a, b) => {
      if (a.relationship < b.relationship) return -1;
      if (a.relationship > b.relationship) return 1;
      return 0;
    });
  
    sortedGuests.forEach((guest, index) => {
      currentTable.push(guest.attendee_name); // Add the guest to the current table
      if (currentTable.length === sizeNormalTablesNumber) {
        tables.push({
          title: `Table ${currentTableIndex}`,
          names: [...currentTable],
        });
        currentTable = [];
        currentTableIndex++;
      }
    });
  
    if (currentTable.length > 0) {
      tables.push({
        title: `Table ${currentTableIndex}`,
        names: [...currentTable],
      });
    }
  
    return tables;
  };
  