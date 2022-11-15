let _scannerIsRunning = false;

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

    Quagga.onDetected(function (result) {
        console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
        Quagga.stop();
        document.getElementById("scanned-code").parentElement.classList.add("is-dirty");
        document.getElementById("scanned-code").value = `${result.codeResult.code}`;
    });
}

document.getElementById("result").style.top = (window.innerHeight*2/3 + 80) + "px";
startScanner();

// document.getElementById("scanned-code").addEventListener(onclick({
//     Quagga.stop();
// }))

function addBarcode(){
    let code = new Barcode(document.getElementById("scanned-code").value, "ean_13");
    batchBacklog.batches[batchIndex].addBarcode(code);
    updateLSData(BATCH_KEY, batchBacklog);
}