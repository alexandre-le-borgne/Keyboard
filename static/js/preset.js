/**
 * Created by Alexandre on 09/04/2016.
 */

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
    this.element = $('<div></div>').addClass('key-label').append(
        $('<div></div>')
    );
    this.value = value;
    this.position = position;
    this.color = color;
    this.size = size;
    this.draw = function () {
        this.element.find('div').html(this.value).css({
            'font-size': Parser.getTextSize(this.size) + 'px',
            'vertical-align': Parser.getVerticalAlign(this.position),
            'text-align': Parser.getTextAlign(this.position)
        });
        return this.element;
    };
};