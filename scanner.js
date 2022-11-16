let _scannerIsRunning = false;
let format = "";

function startScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-container'),
            constraints: {
                width: window.innerWidth-15,
                height: window.innerHeight*2/3,
                facingMode: "environment"
            },
        },
        decoder: {
            readers: ['upc_reader', 'ean_reader'],
        },

    }, function (err) {
        if (err) {
            console.log(err);
            return
        }

        Quagga.start();

        // Set flag to is running
        _scannerIsRunning = true;
    });

    Quagga.onProcessed(function (result) {
        let drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
            }
        }
    });

    // When a barcode is detected, pause the video stream and stop the barcode scanning. Save the results
    Quagga.onDetected(function (result) {
        console.log("Barcode detected and processed : [" + result.codeResult.format + "]", result);
        let cameraFeed = document.getElementById("scanner-container");
        cameraFeed.getElementsByTagName("video")[0].pause();
        Quagga.stop();
        document.getElementById("scanned-code").parentElement.classList.add("is-dirty");
        document.getElementById("scanned-code").value = `${result.codeResult.code}`;
        format = result.codeResult.format;
    });
}

document.getElementById("result").style.top = (window.innerHeight*2/3 + 60) + "px";
startScanner();

/**
 * Add the code to local storage and show a confirmation popup
 */
function addBarcode(){
    let code = new Barcode(document.getElementById("scanned-code").value, format);
    batchBacklog.batches[batchIndex].addBarcode(code);
    updateLSData(BATCH_KEY, batchBacklog);
    let toast = document.getElementById("confirmed-toast");
    toast.innerText = `Barcode ${document.getElementById("scanned-code").value} added.`
    toast.classList.add("show");
    setTimeout(function (){ toast.classList.remove("show"); }, 3000);
}

/**
 * Go back to Batch page
 */
function back(){ window.location.href = "batch.html"; }