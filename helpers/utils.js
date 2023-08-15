import Papa from "papaparse";
import fs from 'fs';

const formatMoney = x => {
  if (!x) {
    return '$0';
  }
  const withDots = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${withDots}`;
};

const readCSVFile = async (filePath) => {
  const csvFile = fs.readFileSync(filePath)
  const csvData = csvFile.toString()  
  return new Promise(resolve => {
    Papa.parse(csvData, {
      header: false,
      complete: results => {
        console.log('Complete', results.data.length, 'records.'); 
        resolve(results.data);
      }
    });
  });
};

export { formatMoney, readCSVFile }