/**
 * Created by Alexandre on 09/04/2016.
 */
var Positions = function () {
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

var Constantes = function () {
};
Constantes.BORDER_SIZE = 12;
Constantes.DISTANCE_TO_PX = 42;

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
    x: 0,           // Décalage horizontal
    y: 0,           // Décalage verticale
    w: 1,           // Largeur
    h: 1,           // Hauteur
    f: 3,           // Taille des labels
    r: 0,           // Angle de rotation
    rx: 0,          // Position du centre de rotation en x
    ry: 0,          // Position du centre de rotation en y
    a: 0,           // Type de positionnement des labels
    c: "#fff",      // Couleur de la touche
    t: "#000"       // Couleur des labels
};

var Parser = function () {
};

Parser.getTextSize = function (size) {
    return 6 + 2 * size * (Constantes.DISTANCE_TO_PX / 42);
};

Parser.getLabels = function (element) {
    var labels = [];
    if (element == "") {
        labels.push({position: convertPosition[0], data: ""});
        return labels;
    }
    var sub = element.split("\n");
    var part;
    for (var i in sub)
        part = sub[i];
    if (typeof part == "string" && part != "")
        labels.push({position: convertPosition[i], data: part});
    return labels;
};

Parser.ignoreFrontLabels = function (labels) {
    var result = [];
    for (var i in labels) {
        if (labels[i].position != Positions.FRONT)
            result.push(labels[i])
    }
    return result;
};

Parser.parse = function (data) {
    // data = JSON.parse(JSON.stringify(data)); // Deep copy
    data = jQuery.extend(true, {}, data);

    var keyboard = new Keyboard();
    var currentSettings = defaultSettings;
    var resetSettings = defaultSettings;
    var position_x = defaultSettings.x;
    var position_y = defaultSettings.y;
    delete resetSettings.r;
    delete resetSettings.rx;
    delete resetSettings.ry;
    for (var i in data) {
        for (var j in data[i]) {
            var element = data[i][j];

            if (typeof element == "string") {
                var labelsData = Parser.ignoreFrontLabels(Parser.getLabels(element));
                var labels = [];
                for (var k in labelsData) {
                    labels.push(new Label(labelsData[k].data, labelsData[k].position, currentSettings.f, currentSettings.t));
                }
                keyboard.keys.push(
                    new Key(labels,
                        position_x + currentSettings.x, position_y + currentSettings.y,
                        currentSettings.w, currentSettings.h, currentSettings.c,
                        currentSettings.r, currentSettings.rx, currentSettings.ry)
                );
                position_x += currentSettings.w;
                currentSettings = $.extend({}, currentSettings, resetSettings);
            }
            else {
                if (typeof element["rx"] !== "undefined") {
                    position_x = element["rx"];
                }

                if (typeof element["y"] !== "undefined") {
                    if (typeof element["ry"] !== "undefined") {
                        position_y = element["ry"];
                    }
                    else if (typeof currentSettings["ry"] !== "undefined") {
                        position_y = currentSettings["ry"];
                    }
                    position_y += element["y"];
                    delete element["y"]
                }

                if (typeof element["x"] !== "undefined") {
                    position_x += element["x"];
                    delete element["x"];
                }

                currentSettings = $.extend({}, currentSettings, element);
            }

        }
        position_y += currentSettings.h;
        position_x = ((typeof currentSettings.rx !== "undefined") ? currentSettings.rx : defaultSettings.x);
    }
    return keyboard;
};

var Preset = function (name, data) {
    this.name = name;
    this.data = data;
    this.parsedData = null;
    this.keyboard = null;
    this.draw = function (selector) {
        this.keyboard = Parser.parse(this.data);
        this.parsedData = this.keyboard.draw();
        selector.html(this.parsedData.element).css({
            "min-height": this.parsedData.height + "px",
            "min-width": this.parsedData.width + "px"
        });
        return this;
    };
};

var Keyboard = function () {
    this.keys = [];
    this.element = $('<div></div>').addClass("keyboard");
    this.draw = function () {
        var keyData;
        var height = 0;
        var width = 0;
        for (var i in this.keys) {
            keyData = this.keys[i].draw();
            if (keyData.height > height) height = keyData.height;
            if (keyData.width > width) width = keyData.width;
            this.element.append(keyData.element);
        }
        return {element: this.element, height: height, width: width};
    };
};

var Key = function (labels, x, y, width, height, color, rotation_angle, rotation_x, rotation_y) {
    this.element = $('<div></div>').addClass("key-container").append(
        $('<div></div>').addClass("key-border").append(
            $('<div></div>').addClass("key").data('key', this)));
    this.labels = labels;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.rotation_angle = rotation_angle;
    this.rotation_x = rotation_x || 0;
    this.rotation_y = rotation_y || 0;
    this.draw = function () {
        var left = (this.x * (Constantes.DISTANCE_TO_PX + Constantes.BORDER_SIZE));
        var top = (this.y * (Constantes.DISTANCE_TO_PX + Constantes.BORDER_SIZE));
        var height = (this.height * Constantes.DISTANCE_TO_PX) + ((this.height - 1) * Constantes.BORDER_SIZE);
        var width = (this.width * Constantes.DISTANCE_TO_PX) + ((this.width - 1) * Constantes.BORDER_SIZE);
        var rx = (Constantes.DISTANCE_TO_PX + Constantes.BORDER_SIZE) * this.rotation_x;
        var ry = (Constantes.DISTANCE_TO_PX + Constantes.BORDER_SIZE) * this.rotation_y;
        var child = this.element.css({
            "transform": "rotate(" + this.rotation_angle + "deg)",
            "transform-origin": rx + "px " + ry + "px"
        }).find(".key-border").css({
            "left": left + "px",
            "top": top + "px"
        }).find(".key").css({
            "height": height + "px",
            "width": width + "px",
            "background-color": this.color
        });
        for (var i in this.labels) {
            child.append(this.labels[i].draw());
        }
        if (typeof this.rotation_angle == "undefined") {
            height = top + height + Constantes.BORDER_SIZE;
            width = left + width + Constantes.BORDER_SIZE;
        }
        else {
            height = top + ry / 2 + Constantes.BORDER_SIZE;
            width = left + rx / 2 + Constantes.BORDER_SIZE;
        }
        return {
            element: this.element,
            height: height,
            width: width
        };
    };
    this.copy = function (key) {
        var label;
        var child = this.element.find('.key').empty();
        this.labels = [];
        for (var i in key.labels) {
            label = key.labels[i];
            this.labels.push(new Label(label.value, label.position, label.size, label.color));
            for (var i in this.labels) {
                child.append(this.labels[i].draw());
            }
        }
        this.color = key.color;
    }
};

var Label = function (value, position, size, color) {
    this.element = $('<div></div>');
    this.value = value;
    this.position = position;
    this.color = color;
    this.size = size;
    this.draw = function () {
        return this.element.html(value).css({
            "font-size": Parser.getTextSize(this.size) + 'px'
        });
    };
};