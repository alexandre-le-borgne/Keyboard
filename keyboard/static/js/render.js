/**
 * Created by Alexandre on 23/06/2016.
 */
var renderLayers = function () {
    var layers = [];
    $('#preset-ergofip-container').find('.presets .preset').each(function () {
        var keys = [];
        $('.key', this).each(function () {
            var key = $(this).data('key');
            var labels = [];
            for (var i in key.labels) {
                labels.push({
                    value: key.labels[i].value,
                    position: key.labels[i].position,
                    size: key.labels[i].size
                })
            }
            keys.push({
                labels: labels,
                x: Math.round(1000 * parseInt(key.element.find('.key-border').css('left'), 10) / (Constantes.BORDER_SIZE + Constantes.DISTANCE_TO_PX)) / 1000,
                y: Math.round(1000 * parseInt(key.element.find('.key-border').css('top'), 10) / (Constantes.BORDER_SIZE + Constantes.DISTANCE_TO_PX)) / 1000,
                width: key.width,
                height: key.height,
                color: key.color,
                labelcolor: key.labelcolor,
                rotation_angle: key.rotation_angle,
                rotation_x: key.rotation_x,
                rotation_y: key.rotation_y,
                scancode: key.scancode
            });
        });
        layers.push({
            keys: keys
        });

    });
    return {
        preset: selectedErgofip,
        scancode: ergofipToPrint,
        layers: layers
    };
};

$(function () {
    $('#generate-source').click(function () {
        $("#ergonomics div").text(JSON.stringify(renderLayers()));
    });
});