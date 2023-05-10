const stringifyEntry = (item) => {
  return `
      Name: ${item.name}
      Artist: ${item.artist}
      Type: ${item.type}
      Year: ${item.year}
      ID: ${item.id}
      Price: ${item.price}
      Buyer: ${item.buyer}
      Sale Date: ${item.saleDate}
      Delivery Date: ${item.deliveryDate}
    `;
};

const downloadItemsTXT = (items) => {
  const data = items.map(stringifyEntry).join("\n");
  const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = "sales.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadItemsCSV = (items) => {
  const header = "Name,Artist,Type,Year,ID,Price,Buyer,Sale Date,Delivery Date";
  const data = items
    .map((item) =>
      [
        item.name,
        item.artist,
        item.type,
        item.year,
        item.id,
        item.price,
        item.buyer,
        item.saleDate,
        item.deliveryDate,
      ].join(",")
    )
    .join("\n");
  const csvData = [header, data].join("\n");
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = "sales.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadItemsJSON = (items) => {
  const formattedItems = items.map((item) => ({
    Name: item.name,
    Artist: item.artist,
    Type: item.type,
    Year: item.year,
    ID: item.id,
    Price: item.price,
    Buyer: item.buyer,
    "Sale Date": item.saleDate,
    "Delivery Date": item.deliveryDate,
  }));

  const data = JSON.stringify(formattedItems, null, 2);
  const blob = new Blob([data], { type: "application/json;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = "sales.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export {
  downloadItemsTXT,
  downloadItemsCSV,
  downloadItemsJSON,
  stringifyEntry,
};
