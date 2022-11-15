"use strict";

/**
 * Display the barcodes saved in this batch
 */
function displayBatch(){
    document.getElementById("batch-name").innerText = `Barcode Scanner - ${batchBacklog.batches[batchIndex].name}`;
    let output = "";
    // Iterate through saved tasks in the backlog
    for (let i = 0; i < batchBacklog.batches[batchIndex].barcodes.length; i++) {
        // Create html to display the task info
        output += `<li class="list-item mdl-list__item" onclick="">
                        <span class="mdl-list__item-primary-content" onclick="">
                            <span>${batchBacklog.batches[batchIndex].barcodes[i].data}</span>
                        </span>
                        <a class="mdl-list__item-secondary-action"><i class="material-icons" onclick="deleteBarcode(${i})">delete</i></a>
                    </li>`;
    }
    if(output === ""){
        output = `<span class="mdl-layout-title" style="color: black">You have no saved batches.<br>Use the 'NEW BATCH' button below to start adding.</span>`;
    }
    // Add to the UI list
    document.getElementById("barcodes-list").innerHTML = output;
}

/**
 * Open the page to scan a barcode
 */
function newBarcode(){
    window.location.href = "scanner.html";
}

/**
 * Deletes a barcode from the batch
 * @param index the index of the barcode in the batch
 */
function deleteBarcode(index){
    if(confirm(`Are you sure want to delete ${batchBacklog.batches[batchIndex].barcodes[index].code}?\nDeleted data cannot be recovered.`)){
        //using function to delete at index
        batchBacklog[batchIndex].delete(index);
        //updating local storage
        updateLSData(BATCH_KEY, batchBacklog);
        //running the display function with changed PB
        displayBatches();
    }
}

displayBatch();