import fs from 'fs';

const createFile = async (filename) => {
    try {
        await fs.promises.writeFile(filename, 'Hello World!');
        console.log(`File '${filename}' created succesfully`);
    } catch (err) {
        console.error(`Error creating file '${filename}': `, err);
    }
};

const readFile = async (filename) => {
    try {
        const data = await fs.promises.readFile(filename, 'utf-8');
        console.log(`Contents of file '${filename}' :`, data);

    } catch (err) {
        console.error(`Error reading file '${filename}': `, err);
    }
};

const appendToFile = async (filename) => {
    try {
        await fs.promises.appendFile(filename, 'This is additional content.');
        console.log(`Content appended to file '${filename}`);
    } catch (err) {
        console.error(`Error appending to file '${filename}':`, err);
    }
};

const deleteFile = async (filename) => {
    try {
        await fs.promises.unlink(filename);
        console.log(`File '${filename}' deleted successfully`);
    } catch (err) {
        console.error(`Error deleting file '${filename}': `, err);
    }
};

export { createFile, readFile, appendToFile, deleteFile };