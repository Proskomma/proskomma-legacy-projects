import { Proskomma } from "proskomma";

export const initializeProskomma = async (subDir) => {
  console.time("Init Proskomma");
  const pk = new Proskomma();
  const bookNumbers = [...Array(28).keys()].slice(1);

  for await (const bookNumber of bookNumbers) {
    const paddedBookNumber = bookNumber.toString().padStart(2, "0");
    const bookData = await import(`../data/${subDir}/${paddedBookNumber}.json`);
    await pk.loadSuccinctDocSet(bookData);
  }

  console.timeEnd("Init Proskomma");
  return pk;
};
