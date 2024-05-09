// csvOperations.js

const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

// Function to read CSV file and return data as an array of objects
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Function to write data to a CSV file
async function writeCSV(filePath, data) {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
  });

  try {
    await csvWriter.writeRecords(data);
    console.log('CSV file successfully written.');
  } catch (error) {
    console.error('Error writing CSV:', error);
  }
}

// CRUD operations
async function createRecord(filePath, newData) {
  try {
    const existingData = await readCSV(filePath);
    existingData.push(newData);
    await writeCSV(filePath, existingData);
  } catch (error) {
    console.error('Error creating record:', error);
  }
}

async function updateRecord(filePath, keyToUpdate, valueToUpdate, updatedData) {
  try {
    let existingData = await readCSV(filePath);
    existingData = existingData.map((record) => {
      if (record[keyToUpdate] === valueToUpdate) {
        return { ...record, ...updatedData };
      } else {
        return record;
      }
    });
    await writeCSV(filePath, existingData);
  } catch (error) {
    console.error('Error updating record:', error);
    throw error; // Re-throw the error to be caught by the route handler
  }
}


async function deleteRecord(filePath, idToDelete) {
  try {
    let existingData = await readCSV(filePath);
    existingData = existingData.filter((record) => record.id !== idToDelete);
    await writeCSV(filePath, existingData);
  } catch (error) {
    console.error('Error deleting record:', error);
  }
}

module.exports = {
  readCSV,
  writeCSV,
  createRecord,
  updateRecord,
  deleteRecord,
};
