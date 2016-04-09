/**
 * Created by Alexandre on 09/04/2016.
 */
var Positions = function() {
};
Positions.FRONT = 0;
Positions.BOTTOM_LEFT = 1;
Positions.BOTTOM_CENTER = 2;
Positions.BOTTOM_RIGHT = 3;
Positions.MIDDLE_LEFT = 4;
Positions.MIDDLE_CENTER = 5;
Positions.MIDDLE_RIGHT = 6;
Positions.TOP_LEFT = 7;
Positions.TOP_CENTER = 8;
Positions.TOP_RIGHT = 9;

var convertPosition = {
    0: Positions.TOP_LEFT,
    1: Positions.BOTTOM_LEFT,
    2: Positions.TOP_RIGHT,
    3: Positions.BOTTOM_RIGHT,
    4: Positions.FRONT,
    5: Positions.FRONT,
    6: Positions.MIDDLE_LEFT,
    7: Positions.MIDDLE_RIGHT,
    8: Positions.TOP_CENTER,
    9: Positions.MIDDLE_CENTER,
    10: Positions.BOTTOM_CENTER,
    11: Positions.FRONT
};

var defaultSettings = {
    x: 0,            // Décalage horizontal
    y: 0,           // Décalage verticale
    w: 1,           // Largeur
    h: 1,           // Hauteur
    f: 3,           // Taille des labels
    r: 0,           // Angle de rotation
    rx: 0,          // Position du centre de rotation en x
    ry: 0,          // Position du centre de rotation en y
    a: 0,           // Type de positionnement des labels
    c: "#cccccc",   // Couleur de la touche
    t: "#000000"    // Couleur des labels
};

var Parser = function() {};
Parser.getTextSize = function(size) {
    return 6+2*i;
};

Parser.getLabels = function(element) {
    var labels = [];
    var sub = element.split("\n");
    var part;
    for(var i in sub)
        part = sub[i];
        if(typeof part == "string" && part != "")
            labels.push({position: convertPosition[i], data: part});
    return labels;
};

Parser.ignoreFrontLabels = function(labels) {
    var result = [];
    for(var i in labels) {
        if(labels[i].position != Positions.FRONT)
            result.push(labels[i])
    }
    return result;
};

var Preset = function(name, data) {
    this.name = name;
    this.data = data;

    this.draw = function(selector) {
        var keyboard = this.parse(this.data);
        selector.html(keyboard.draw());
    };

    this.parse = function(data) {
        var keyboard = new Keyboard();
        var currentSettings = defaultSettings;
        var position_x = defaultSettings.x;
        var position_y = defaultSettings.y;
        for(var i in data) {
            for(var j in data[i]) {
                var element = data[i][j];
                if (typeof element == "string") {
                    var labelsData = Parser.ignoreFrontLabels(Parser.getLabels(element));
                    var labels = [];
                    for(var k in labelsData) {
                        labels.push(new Label(labelsData[k].data, labelsData[k].position, currentSettings.f, currentSettings.t));
                    }
                    keyboard.keys.push(
                        new Key(labels,
                            position_x + currentSettings.x, position_y + currentSettings.y,
                            currentSettings.w, currentSettings.h, currentSettings.c,
                            currentSettings.r, currentSettings.rx, currentSettings.ry)
                    );
                    position_x += currentSettings.w;
                }
                else {
                    currentSettings = $.extend({}, currentSettings, element);
                }
            }
            position_y += defaultSettings.h;
            position_x = defaultSettings.x;
        }
        return keyboard;
    };
};

var Keyboard = function() {
    this.keys = [];
    this.element = $('<div></div>');
    this.draw = function() {
        console.log(this.keys);
        for(var i in this.keys) {
            this.element.append(this.keys[i].draw());
        }
        return this.element;
    };
};

var Key = function(labels, x, y, width, height, color, rotation_angle, rotation_x, rotation_y) {
    this.element = $('<div></div>');
    this.labels = labels;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.rotation_angle = rotation_angle;
    this.rotation_x = rotation_x;
    this.rotation_y = rotation_y;
    this.draw = function() {
        this.element.html("Position X - Y : " + this.x + " - " + this.y + " <br>");
        console.log(this.labels);

        for(var i in this.labels) {
            console.log(this.labels);
            this.element.append(this.labels[i].draw());
        }
        this.element.append("<br><hr>");
        return this.element;
    };
};

var Label = function(value, position, size, color) {
    this.element = $('<div></div>');
    this.value = value;
    this.position = position;
    this.color = color;
    this.size = size;
    this.draw = function() {
        return this.element.text(value);
    };
};