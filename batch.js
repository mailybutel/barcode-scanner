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
                        <span class="mdl-list__item-primary-content" onclick="displayBarcode(${i})">
                            <span>${batchBacklog.batches[batchIndex].barcodes[i].data}</span>
                        </span>
                        <a class="mdl-list__item-secondary-action"><i class="material-icons" onclick="deleteBarcode(${i})">delete</i></a>
                    </li>`;
    }
    if(output === ""){
        output = `<span class="mdl-layout-title" style="color: black">You have no saved barcodes.<br>Use the 'ADD BARCODE' button below to start adding.</span>`;
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
        batchBacklog.batches[batchIndex].delete(index);
        //updating local storage
        updateLSData(BATCH_KEY, batchBacklog);
        //running the display function with changed PB
        displayBatch();
    }
}

/**
 * Shows a popup image of the selected barcode
 * @param index the index of the barcode in its batch
 */
function displayBarcode(index){
    // Show barcode
    document.getElementById("bg-overlay").classList.add("show-barcode");
    document.getElementById("inner-body").classList.add("show-barcode");
    document.getElementById("barcode").classList.add("show-barcode");
    document.getElementById("popup-images").style.visibility = 'visible';
    JsBarcode("#barcode", batchBacklog.batches[batchIndex].barcodes[index].data, {
        format: `${batchBacklog.batches[batchIndex].barcodes[index].format}`
    });

    // Check if the arrows should be able to do anything
    if(index === 0){
        document.getElementById("img-back").setAttribute("disabled", "disabled");
    } else {
        document.getElementById("img-back").removeAttribute("disabled");
    }
    if(index >= batchBacklog.batches[batchIndex].barcodes.length-1){
        document.getElementById("img-next").setAttribute("disabled", "disabled");
    } else {
        document.getElementById("img-next").removeAttribute("disabled");
    }

    // Set onClick events for the arrows
    document.getElementById("img-back").setAttribute("onClick", `displayBarcode(${index-1})`)
    document.getElementById("img-next").setAttribute("onClick", `displayBarcode(${index+1})`)
}

/**
 * Removes the barcode image from view
 */
function hideBarcode(){
    document.getElementById("bg-overlay").classList.remove("show-barcode");
    document.getElementById("inner-body").classList.remove("show-barcode");
    document.getElementById("barcode").classList.remove("show-barcode");
    document.getElementById("popup-images").style.visibility = 'hidden';
    document.getElementById("img-back").setAttribute("disabled", "");
    document.getElementById("img-next").setAttribute("disabled", "");
}

function back(){ window.location.href = "index.html"; }

displayBatch();