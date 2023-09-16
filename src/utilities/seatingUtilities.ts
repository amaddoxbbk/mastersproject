// SeatingUtilities.ts

export interface TableData {
    title: string;
    names: string[];
  }
  
  // Generates a random arrangement of tables based on a list of guests and table sizes
  export const generateRandomTable = (
    guests: any[],
    sizeNormalTablesNumber: number
  ): TableData[] => {
    let tables: TableData[] = [];
    let currentTable: string[] = [];
    let currentTableIndex = 1;
  
    // Shuffle the guests to randomize the seating
    const shuffledGuests = [...guests].sort(() => Math.random() - 0.5);
  
    for (const guest of shuffledGuests) {
      currentTable.push(guest.attendee_name);
      if (currentTable.length === sizeNormalTablesNumber) {
        tables.push({
          title: `Table ${currentTableIndex}`,
          names: [...currentTable]
        });
        currentTable = [];
        currentTableIndex++;
      }
    }
  
    // Add any remaining guests to the last table
    if (currentTable.length > 0) {
      tables.push({
        title: `Table ${currentTableIndex}`,
        names: [...currentTable]
      });
    }
  
    return tables;
  }
  
  // Checks if a table arrangement is valid according to the given rules
  export const isValidArrangement = (
    tables: TableData[],
    sizeNormalTablesNumber: number
  ): boolean => {
    // Check if any table exceeds the maximum size
    for (const table of tables) {
      if (table.names.length > sizeNormalTablesNumber) {
        return false;
      }
    }
    return true;
  };
  
  // Add more utility functions as needed
  