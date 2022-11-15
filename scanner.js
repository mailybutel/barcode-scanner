"use strict";

function newBatch(){
    let dialog = document.querySelector("dialog");
    dialog.showModal();
    dialogPolyfill.registerDialog(dialog);
}

function closeDialog() {
    let dialog = document.querySelector("dialog");
    dialog.close();
    clearInput("batchName");
}

function clearInput(id){
    document.getElementById(id).value = '';
    document.getElementById(id).parentElement.classList.remove("is-dirty");
    document.getElementById(id).disabled = false;
    document.getElementById(id).parentElement.classList.remove("is-invalid");
}

function createBatch(){
    let name = document.getElementById("batchName").value;
    if (name === "") {
        document.getElementById("batchName").parentElement.classList.add("is-invalid");
    }else{
        let batch = new Batch(name);
        batchBacklog.addBatch(batch);
        updateLSData(BATCH_KEY, batchBacklog);
        let dialog = document.querySelector("dialog");
        dialog.close();
        clearInput("batchName");
        displayBatches();
        // Go to the new batch's page
    }
}

function deleteBatch(index){
    if(confirm(`Are you sure want to delete ${batchBacklog.batches[index].name}?\nDeleted data cannot be recovered.`)){
        //using function to delete at index
        batchBacklog.delete(index);
        //updating local storage
        updateLSData(BATCH_KEY, batchBacklog);
        //running the display function with changed PB
        displayBatches();
    }
}

function displayBatches(){
    let output = "";
    // Iterate through saved tasks in the backlog
    for (let i = 0; i < batchBacklog.batches.length; i++) {
        // Create html to display the task info
        output += `<li class="list-item mdl-list__item" onclick="">
                        <span class="mdl-list__item-primary-content">
                            <span>${batchBacklog.batches[i].name}</span>
                        </span>
                        <a class="mdl-list__item-secondary-action"><i class="material-icons" onclick="deleteBatch(${i})">delete</i></a>
                    </li>`;
    }
    if(output === ""){
        output = `<span class="mdl-layout-title" style="color: black">You have no saved batches.<br>Use the 'NEW BATCH' button below to start adding.</span>`;
    }
    // Add to the UI list
    document.getElementById("batches-list").innerHTML = output;
}

displayBatches();