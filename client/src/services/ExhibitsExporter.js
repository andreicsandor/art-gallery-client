const stringifyEntry = (exhibit) => {
  return `
    Exhibit Name: ${exhibit.item.name}
    Artist: ${exhibit.item.artist}
    Type: ${exhibit.item.type}
    Year: ${exhibit.item.year}
    Gallery: ${exhibit.gallery}
  `;
};

const downloadExhibitsTXT = (exhibits) => {
  const data = exhibits.map(stringifyEntry).join("\n");
  const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = "exhibits.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadExhibitsCSV = (exhibits) => {
  const header = "Exhibit Name,Artist,Type,Year,Gallery";
  const data = exhibits
    .map((exhibit) =>
      [
        exhibit.item.name,
        exhibit.item.artist,
        exhibit.item.type,
        exhibit.item.year,
        exhibit.gallery,
      ].join(",")
    )
    .join("\n");
  const csvData = [header, data].join("\n");
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = "exhibits.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadExhibitsJSON = (exhibits) => {
  const formattedExhibits = exhibits.map((exhibit) => ({
    "Exhibit Name": exhibit.item.name,
    Artist: exhibit.item.artist,
    Type: exhibit.item.type,
    Year: exhibit.item.year,
    Gallery: exhibit.gallery,
  }));

  const data = JSON.stringify(formattedExhibits, null, 2);
  const blob = new Blob([data], { type: "application/json;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = "exhibits.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export {
  downloadExhibitsTXT,
  downloadExhibitsCSV,
  downloadExhibitsJSON,
  stringifyEntry,
};
