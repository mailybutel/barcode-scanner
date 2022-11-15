"use strict";

/* Local Storage Keys */
const BATCH_KEY = "batchData";
const BATCH_INDEX = "batchIndex";

class BatchBacklog{
    /**
     * Represents a list of batches
     */

    constructor() {
        this._batches = [];
    }

    get batches(){ return this._batches; }
    set batches(batchList){ this._batches = batchList; }

    addBatch(batch){ this._batches.push(batch); }
    delete(batchIndex){ this._batches.splice(batchIndex, 1); }

    fromData(data){
        for (let i = 0; i < data._batches.length; i++) {
            let batch = new Batch();
            batch.fromData(data._batches[i]);
            this.addBatch(batch);
        }
    }
}

class Batch{
    /**
     * Represents a list of barcodes
     */
    constructor(name) {
        this._barcodes = [];
        this._name = name;
    }

    /**
     * Adds a barcode to the batch
     * @param barcode {Barcode} the new barcode
     */
    addBarcode(barcode){
        this._barcodes.push(barcode);
    }

    get barcodes(){ return this._barcodes; }
    get name(){ return this._name; }
    set name(newName){ this._name = newName; }
    delete(codeIndex){ this._barcodes.splice(codeIndex, 1); }

    fromData(data){
        this.name = data._name;
        for (let i = 0; i < data._barcodes.length; i++) {
            let barcode = new Barcode();
            barcode.fromData(data._barcodes[i]);
            this.addBarcode(barcode);
        }
    }
}

class Barcode{
    /**
     * Represents a scanned barcode
     * @param data {Number} the data the barcode holds
     * @param format {String} the format of the barcode
     */
    constructor(data, format) {
        this._data = data;
        this._format = format;
    }

    get data(){ return this._data; }
    set data(newData){ this._data = newData; }

    get format(){ return this._format; }
    set format(newFormat){ this._format = newFormat; }

    fromData(data){
        this.data = data._data;
        this.format = data._format;
    }
}

/**
 * checkLSData function
 * Used to check if any data in LS exists at a specific key
 * @param {string} key LS Key to be used
 * @returns true or false representing if data exists at key in LS
 */
function checkLSData(key) {
    return localStorage.getItem(key) != null;
}
/**
 * retrieveLSData function
 * Used to retrieve data from LS at a specific key.
 * @param {string} key LS Key to be used
 * @returns data from LS in JS format
 */
function retrieveLSData(key) {
    let data = localStorage.getItem(key);
    try {
        data = JSON.parse(data);
    } catch (err) {
    }
    return data;
}

/**
 * updateLSData function
 * Used to store JS data in LS at a specific key
 * @param {String} key LS key to be used
 * @param {any} data data to be stored
 */
function updateLSData(key, data) {
    let json = JSON.stringify(data);
    localStorage.setItem(key, json);
}

let batchBacklog = new BatchBacklog();
let batchIndex = 0;

if (checkLSData(BATCH_KEY)) {
    let data = retrieveLSData(BATCH_KEY);
    // Restore data into vacationList
    batchBacklog.fromData(data);
}
if (checkLSData(BATCH_INDEX)) {
    // Restore data into vacationList
    batchIndex = retrieveLSData(BATCH_INDEX);
}