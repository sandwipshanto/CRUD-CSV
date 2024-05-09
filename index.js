const express = require('express');
const app = express();
const { readCSV, writeCSV, createRecord, updateRecord, deleteRecord } = require('./csvOperations');

app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

 app.get('/', (req, res) => {
    res.send("Hello from Node API Updated");
});

app.get('/read', async (req, res) => {
    try {
        const data = await readCSV('data.csv');
        res.json(data);
    } catch (error) {
        console.error('Error reading CSV:', error);
        res.status(500).json({ error: 'Error reading CSV' });
    }
});

app.post('/create', async (req, res) => {
    const newData = req.body; 
    try {
        await createRecord('data.csv', newData);
        res.status(201).json({ message: 'Record created successfully' });
    } catch (error) {
        console.error('Error creating record:', error);
        res.status(500).json({ error: 'Error creating record' });
    }
});

app.put('/update/:id', async (req, res) => {
    const idToUpdate = req.params.id;
    const updatedData = req.body; 
    try {
        await updateRecord('data.csv', idToUpdate, updatedData);
        res.json({ message: 'Record updated successfully' });
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ error: 'Error updating record' });
    }
});

app.delete('/delete/:id', async (req, res) => {
    const idToDelete = req.params.id;
    try {
        await deleteRecord('data.csv', idToDelete);
        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ error: 'Error deleting record' });
    }
});


