/**
 * Created by Alexandre on 09/04/2016.
 */
var createPresetFromParser = function (name, data) {
    return new Preset(name, Parser.parse(data));
};

var parseKeysFromSave = function (keys) {
    var keysParsed = [];
    var i, j, key, labels, label;
    for (i in keys) {
        key = keys[i];
        labels = [];
        for (j in key.labels) {
            label = key.labels[j];
            labels.push(new Label(label.value, label.position, label.size));
        }
        keysParsed.push(new Key(labels, key.x, key.y, key.width, key.height, key.color, key.labelcolor, key.rotation_angle, key.rotation_x, key.rotation_y))
    }
    return keysParsed;
};

var createLayersFromSave = function (data) {
    var layers = [];
    var name = data.preset.name;
    var i, layer, keyboard;
    for (i in data.layers) {
        layer = data.layers[i];
        keyboard = new Keyboard();
        keyboard.keys = parseKeysFromSave(layer.keys);
        layers.push(new Preset(name, keyboard));
    }

    keyboard = new Keyboard();
    keyboard.keys = parseKeysFromSave(data.preset.keyboard.keys);
    var preset = new Preset(name, keyboard);

    return {
        layers: layers,
        preset: preset
    };
};

var Preset = function (name, keyboard) {
    this.name = name;
    this.parsedData = null;
    this.keyboard = keyboard;
    this.clone = function() {
        return new Preset(this.name, this.keyboard.clone());
    };
    this.draw = function (selector) {
        var keyboard = this.keyboard.draw();
        selector.html(keyboard.element).css({
            "min-height": keyboard.height + "px",
            "min-width": keyboard.width + "px"
        });
        return this;
    };
};

var Keyboard = function () {
    this.keys = [];
    this.element = $('<div></div>').addClass("keyboard");
    this.clone = function() {
        var keyboard = new Keyboard();
        var i;
        for(i in this.keys) {
            keyboard.keys.push(this.keys[i].clone());
        }
        return keyboard;
    };
    this.draw = function () {
        var keyData, i;
        var height = 0;
        var width = 0;
        this.element.html('');
        for (i in this.keys) {
            keyData = this.keys[i].draw();
            if (keyData.height > height) height = keyData.height;
            if (keyData.width > width) width = keyData.width;
            this.element.append(keyData.element);
        }
        return {element: this.element, height: height, width: width};
    };
};

var Key = function (labels, x, y, width, height, color, labelcolor, rotation_angle, rotation_x, rotation_y) {
    this.element = $('<div></div>').addClass("key-container").append(
        $('<div></div>').addClass("key-border").append(
            $('<div></div>').addClass("key").data('key', this)));
    this.labels = labels;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.labelcolor = labelcolor;
    this.rotation_angle = rotation_angle || 0;
    this.rotation_x = rotation_x || 0;
    this.rotation_y = rotation_y || 0;
    this.clone = function() {
        var labels = [];
        var i;
        for(i in this.labels) {
            labels.push(this.labels[i].clone());
        }
        return new Key(labels, this.x, this.y, this.width, this.height, this.color, this.labelcolor,
            this.rotation_angle, this.rotation_x, this.rotation_y);
    };
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
            "background-color": this.color,
            "color": this.labelcolor
        }).empty();
        for (var i in this.labels) {
            child.append(this.labels[i].draw());
        }
        if (this.rotation_angle) {
            height = top + ry / 2 + Constantes.BORDER_SIZE;
            width = left + rx / 2 + Constantes.BORDER_SIZE;
        }
        else {
            height = top + height + Constantes.BORDER_SIZE;
            width = left + width + Constantes.BORDER_SIZE;
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
            this.labels.push(new Label(label.value, label.position, label.size));
            for (var i in this.labels) {
                child.append(this.labels[i].draw());
            }
        }
        this.color = key.color;
        this.labelcolor = key.labelcolor;
        this.element.css('background-color', this.color);
    };
    this.copyColor = function (key) {
        this.color = key.color;
        this.element.find('.key').css('background-color', this.color);
    }
};

var Label = function (value, position, size) {
    this.element = $('<div></div>').addClass('key-label').append(
        $('<div></div>')
    );
    this.value = value;
    this.position = position;
    this.size = size;
    this.clone = function() {
        return new Label(this.value, this.position, this.size);
    };
    this.draw = function () {
        this.element.find('div').html(this.value).css({
            'font-size': Parser.getTextSize(this.size) + 'px',
            'vertical-align': Parser.getVerticalAlign(this.position),
            'text-align': Parser.getTextAlign(this.position)
        });
        return this.element;
    };
};