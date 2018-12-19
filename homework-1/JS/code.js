var background = document.getElementById("background");
var context = background.getContext('2d');
var backgroundWidth = 450;
var padding = 10;
var column = 3;
var imageWidth = (backgroundWidth - (padding * (column + 1))) / column;
var imageIndexForPosition = [0, 1, 2, 3, 4, 5, 6, 7, 8]; 
var isFinish = false;

var lastIndex = function() {
    return column * column - 1;
}

var rectForPosition = function(position) {
    if (position < 0 || position > lastIndex()) {
        return [0, 0, 0, 0];
    }
    var x = (position % column) * (padding + imageWidth) + padding;
    var y = parseInt(position / column) * (padding + imageWidth) + padding;
    return [x, y, imageWidth, imageWidth];
}

var drawImageItem = function(index, position) {
    var img = new Image();
    img.src = './images/1283568_094054_7954_0' + String(index+1) + '.jpg';
    img.onload = () => {
        var rect = rectForPosition(position);
        context.drawImage(img, rect[0], rect[1], rect[2], rect[3]);
    }
}

var drawAllImage = function() {
    for (var position = 0; position < column * column; position++) {
        var index = imageIndexForPosition[position];
        if (index == lastIndex()) {
            continue;
        }
        drawImageItem(index, position);
    }
}

var refreshImagePositions = function(origin, target) {
    var originRect = rectForPosition(origin);

    context.clearRect(originRect[0], originRect[1], originRect[2], originRect[3]);
    drawImageItem(imageIndexForPosition[target], target);
}

var leftOfPosition = function(position) {
    return (position % column) == 0 ? -1 : position - 1;
}

var rightOfPosition = function(position) {
    return (position % column) == (column - 1) ? -1 : position + 1;
}

var topOfPosition = function(position) {
    return position - column;
}

var bottomOfPosition = function(position) {
    return position + column;
}

var isPositionEmpty = function(position) {
    if (position < 0 || position > lastIndex()) {
        return false;
    } 
    if (imageIndexForPosition[position] == lastIndex()) {
        return true;
    } else {
        return false;
    }
}

var moveImageIfCanAtPosition = function(position) {
    var top = topOfPosition(position);
    var left = leftOfPosition(position);
    var bottom = bottomOfPosition(position);
    var right = rightOfPosition(position);

    var targetPositioin = -1; 
    if (isPositionEmpty(top)) {
        targetPositioin = top;
    } else if (isPositionEmpty(left)) {
        targetPositioin = left;
    } else if (isPositionEmpty(bottom)) {
        targetPositioin = bottom;
    } else if (isPositionEmpty(right)) {
        targetPositioin = right;
    }

    if (targetPositioin >= 0) {
        imageIndexForPosition[targetPositioin] = imageIndexForPosition[position];
        imageIndexForPosition[position] = lastIndex();
        background.emptyPosition = position;
        return targetPositioin;
    }
    return -1;
}

var setupRandomPosition = function() {
    var list1 = [4, 3, 2, 8, 0, 7, 5, 6, 1];
    var list2 = [2, 0, 5, 6, 8, 7, 3, 1, 4];
    var list3 = [3, 7, 2, 4, 1, 6, 8, 0, 5];
    var list4 = [3, 2, 4, 1, 7, 6, 5, 0, 8];
    var lists = [list1, list2, list3, list4];
    imageIndexForPosition = lists[parseInt(Math.random() * 4)];
    var emptyPosition = 0;
    for (var i = imageIndexForPosition.length - 1; i >= 0; i--) {
        if (imageIndexForPosition[i] == lastIndex()) {
            emptyPosition = i;
            break;
        }
    }
    background.emptyPosition = emptyPosition;
    var times = 10;
    while (times--) {
        var direction = parseInt(Math.random() * 4);

        var target = -1;
        if (direction == 0) {
            target = topOfPosition(emptyPosition);
        } else if (direction == 1) {
            target = leftOfPosition(emptyPosition); 
        } else if (direction == 2) {
            target = rightOfPosition(emptyPosition);
        } else if (direction == 3) {
            target = bottomOfPosition(emptyPosition);
        }
        if (target < 0 || target > lastIndex()) {
            continue;
        }
        var result = moveImageIfCanAtPosition(target);
        if (result >= 0) {
            emptyPosition = target;
        }
    }
}

var checkIfFinish = function() {
    for (var index = 0; index < imageIndexForPosition.length; index++) {
        if (index != imageIndexForPosition[index]) {
            return false;
        }
    }
    return true;
}

window.onload = function() {
    setupRandomPosition();
    drawAllImage();
}

background.onclick = function(e) {
    if (isFinish) {
        return;
    }

    var x = parseInt(e.offsetX / (padding + imageWidth));
    var y = parseInt(e.offsetY / (padding + imageWidth));

    var position = y * column + x;
    var target = moveImageIfCanAtPosition(position);
    if (target >= 0) {
        refreshImagePositions(position, target);
    }
    if (checkIfFinish()) {
        drawImageItem(imageIndexForPosition[lastIndex()], lastIndex());
        isFinish = true;
    }
}

var rightOfPosition = function(position) {
    return (position % column) == (column - 1) ? -1 : position + 1;
}

var leftOfPosition = function(position) {
    return (position % column) == 0 ? -1 : position - 1;
}

var topOfPosition = function(position) {
    return position - column;
}

var bottomOfPosition = function(position) {
    return position + column;
}

document.onkeyup = function(event) {
    if (isFinish) {
        return;
    }

    var position = -1;
    if (event.keyCode == '37') {
        position = rightOfPosition(background.emptyPosition);
    } else if (event.keyCode == '38') {
        position = bottomOfPosition(background.emptyPosition);
    } else if (event.keyCode == '39') {
        position = leftOfPosition(background.emptyPosition);
    } else if (event.keyCode == '40') {
        position = topOfPosition(background.emptyPosition);
    } else if (event.keyCode == '65') {
        position = rightOfPosition(background.emptyPosition);
    } else if (event.keyCode == '87') {
        position = bottomOfPosition(background.emptyPosition);
    } else if (event.keyCode == '68') {
        position = leftOfPosition(background.emptyPosition);
    } else if (event.keyCode == '83') {
        position = topOfPosition(background.emptyPosition);
    }
    if (position < 0 || position > lastIndex()) {
        return;
    } 
    var target = moveImageIfCanAtPosition(position);
    if (target >= 0) {
        refreshImagePositions(position, target);
    }
    if (checkIfFinish()) {
        drawImageItem(imageIndexForPosition[lastIndex()], lastIndex());
        isFinish = true;
    }
}
