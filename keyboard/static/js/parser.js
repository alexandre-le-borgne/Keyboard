/**
 * Created by Alexandre on 06/05/2016.
 */
var Parser = function () {
};

Parser.getTextSize = function (size) {
    return 6 + 2 * size * (Constantes.DISTANCE_TO_PX / 42);
};

Parser.getTextAlign = function (position) {
    var align = 'left';
    if(position == Positions.TOP_CENTER || position == Positions.BOTTOM_CENTER || position == Positions.MIDDLE_CENTER)
        align = 'center';
    if(position == Positions.TOP_RIGHT || position == Positions.BOTTOM_RIGHT || position == Positions.MIDDLE_RIGHT)
        align = 'right';
    return align;
};

Parser.getVerticalAlign = function (position) {
    var align = 'top';
    if(position == Positions.MIDDLE_LEFT || position == Positions.MIDDLE_CENTER || position == Positions.MIDDLE_RIGHT)
        align = 'middle';
    if(position == Positions.BOTTOM_LEFT || position == Positions.BOTTOM_CENTER || position == Positions.BOTTOM_RIGHT)
        align = 'bottom';
    return align;
};

Parser.getLabels = function (labelPositionType, element) {
    var labels = [];
    if (element == "") {
        labels.push({position: convertPosition[0], data: ""});
        return labels;
    }
    var sub = element.split("\n");
    var part;
    for (var i in sub) {
        part = sub[i];

        if (typeof part == "string" && part != "")
            labels.push({position: labelMap[labelPositionType][i], data: part});
    }
    return labels;
};

Parser.ignoreFrontLabels = function (labels) {
    var result = [];

    for (var i in labels) {
        if (convertPosition[labels[i].position] != Positions.FRONT)
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
                var labelsData = Parser.ignoreFrontLabels(Parser.getLabels(currentSettings.a, element));
                var labels = [];
                for (var k in labelsData) {
                    labels.push(new Label(labelsData[k].data, convertPosition[labelsData[k].position], currentSettings.f));
                }
                keyboard.keys.push(
                    new Key(labels,
                        position_x + currentSettings.x, position_y + currentSettings.y,
                        currentSettings.w, currentSettings.h, currentSettings.c, currentSettings.t,
                        currentSettings.r, currentSettings.rx, currentSettings.ry, labels[labels.length-1].value)
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