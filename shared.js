"use strict";

/* Local Storage Keys */
const BATCH_KEY = "batchData";

class BatchBacklog{
    /**
     * Represents a list of batches
     */

    #_batches;
    constructor() {
        this.#_batches = [];
    }

    get batches(){ return this.#_batches; }

    addBatch(batch){
        this.#_batches.add(batch);
    }

    fromData(data){
        for (let i = 0; i < data.batches.length; i++) {
            let batch = new Batch();
            batch.fromData(data.batches[i]);
            this.addBatch(batch);
        }
    }
}

class Batch{
    /**
     * Represents a list of barcodes
     */
    #_barcodes;
    #_name;
    constructor(name) {
        this.#_barcodes = [];
        this.#_name = name;
    }

    /**
     * Adds a barcode to the batch
     * @param barcode {Barcode} the new barcode
     */
    addBarcode(barcode){
        this.#_barcodes.add(barcode);
    }

    get barcodes(){ return this.#_barcodes; }
    get name(){ return this.#_name; }
    set name(newName){ this.#_name = newName; }

    fromData(data){
        this.name = data.name;
        for (let i = 0; i < data.barcodes.length; i++) {
            let barcode = new Barcode();
            barcode.fromData(data.barcodes[i]);
            this.addBarcode(barcode);
        }
    }
}

class Barcode{
    #_data;
    #_format;
    /**
     * Represents a scanned barcode
     * @param data {Number} the data the barcode holds
     * @param format {String} the format of the barcode
     */
    constructor(data, format) {
        this.#_data = data;
        this.#_format = format;
    }

    get data(){ return this.#_data; }
    set data(newData){ this.#_data = newData; }

    get format(){ return this.#_format; }
    set format(newFormat){ this.#_format = newFormat; }

    fromData(data){
        this.data = data.data;
        this.format = data.format;
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
if (checkLSData(BATCH_KEY)) {
    let data = retrieveLSData(BATCH_KEY);
    // Restore data into vacationList
    batchBacklog.fromData(data);
}