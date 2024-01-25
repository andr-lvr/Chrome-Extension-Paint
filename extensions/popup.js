document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var isDrawing = false;
    var undoStack = [];
    var redoStack = [];

    var colorPicker = document.getElementById('colorPicker');
    var brushSize = document.getElementById('brushSize');
    var opacity = document.getElementById('opacity');
    var clearButton = document.getElementById('clearButton');
    var undoButton = document.getElementById('undoButton');
    var redoButton = document.getElementById('redoButton');
    var savePNGButton = document.getElementById('savePNGButton');
    var saveJPEGButton = document.getElementById('saveJPEGButton');
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);

    function startDrawing(event) {
        isDrawing = true;
        draw(event);
    }

    function draw(event) {
        if (!isDrawing) return;

        var x = event.clientX - canvas.getBoundingClientRect().left;
        var y = event.clientY - canvas.getBoundingClientRect().top;

        context.lineWidth = brushSize.value;
        context.lineCap = 'round';
        context.strokeStyle = colorPicker.value;
        context.globalAlpha = opacity.value;

        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);

        undoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
        redoStack.length = 0;
    }

    function stopDrawing() {
        isDrawing = false;
        context.beginPath();
    }

    clearButton.addEventListener('click', function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        undoStack.length = 0;
        redoStack.length = 0;
    });

    undoButton.addEventListener('click', function() {
        if (undoStack.length > 1) {
            redoStack.push(undoStack.pop());
            context.putImageData(undoStack[undoStack.length - 1], 0, 0);
        } else if (undoStack.length === 1) {
            redoStack.push(undoStack.pop());
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

    redoButton.addEventListener('click', function() {
        if (redoStack.length > 0) {
            undoStack.push(redoStack.pop());
            context.putImageData(undoStack[undoStack.length - 1], 0, 0);
        }
    });

    savePNGButton.addEventListener('click', function() {
        var dataUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        var a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'drawing.png';
        a.click();
    });

    saveJPEGButton.addEventListener('click', function() {
        var dataUrl = canvas.toDataURL('image/jpeg', 1.0);
        var a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'drawing.jpg';
        a.click();
    });
});
