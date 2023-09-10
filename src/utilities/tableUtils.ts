// Define the shape of the table data
interface TableData {
  title: string;
  names: string[];
}

export const createTableData = (guests: any[], sizeNormalTablesNumber: number) => {
  let tables: TableData[] = [];
  let currentTable: string[] = [];
  let topTable: string[] = [];
  let currentTableIndex = 1;

  // Find the bride and groom and place them at the top table
  const bride = guests.find(guest => guest.is_bride === true);
  const groom = guests.find(guest => guest.is_groom === true);

  if (bride) {
    topTable.push(bride.attendee_name);
  }
  if (groom) {
    topTable.push(groom.attendee_name);
  }

  // Add the top table to the tables array
  if (topTable.length > 0) {
    tables.push({
      title: "Top Table",
      names: [...topTable],
    });
  }

  // Populate the remaining normal tables
  for (let i = 0; i < guests.length; i++) {
    const guest = guests[i];
    if (!guest.is_bride && !guest.is_groom) {
      currentTable.push(guest.attendee_name);
      if (currentTable.length === sizeNormalTablesNumber) {
        tables.push({
          title: `Table ${currentTableIndex}`,
          names: [...currentTable],
        });
        currentTable = [];
        currentTableIndex++;
      }
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
