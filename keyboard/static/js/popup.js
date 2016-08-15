/**
 * Created by Alexandre on 20/06/2016.
 */

var inputToPositions = {
    0: Positions.TOP_LEFT,
    1: Positions.TOP_CENTER,
    2: Positions.TOP_RIGHT,
    3: Positions.MIDDLE_LEFT,
    4: Positions.MIDDLE_CENTER,
    5: Positions.MIDDLE_RIGHT,
    6: Positions.BOTTOM_LEFT,
    7: Positions.BOTTOM_CENTER,
    8: Positions.BOTTOM_RIGHT
};

$(function () {
    $('#popup-delay .save').click(function() {
        $('#popup-delay').data('key').find('.key-label div').text(gettext('Delay') + ' ' + $('#popup-delay input').val() + 'ms');
        $('#popup-delay').modal('hide');
    });

    $('#popup-key input').change(function () {
        var clone = $('#popup-key').data('clone');
        clone.labels = [];

        var i;
        for (i = 0; i < 9; ++i) {
            var value = $('#popup-key input:eq(' + (i * 2) + ')').val();
            var size = $('#popup-key input:eq(' + (i * 2 + 1) + ')').val() || defaultSettings.f;
            if (value.trim() != '') {
                clone.labels.push(new Label(value, inputToPositions[i], size));
            }
        }

        clone.labelcolor = $('#popup-key input:eq(18)').val();
        clone.color = $('#popup-key input:eq(19)').val();

        $('#popup-key').find('.key-block').empty().html( clone.draw().element );
    });

    $('#popup-key .save').click(function() {
        var key = $('#popup-key').data('key');
        var clone = $('#popup-key').data('clone');

        key.labels = clone.labels;
        key.color = clone.color;
        key.labelcolor = clone.labelcolor;
        key.draw();

        $('#popup-key').modal('hide');
    });
});

function loadPopupDelay(key) {
    var delay = parseInt(key.find('.key-label div').text().substring(6), 10);
    $('#popup-delay').data('key', key).modal('show').find('input').val(delay);
}

function loadPopupKey(key) {
    var clone = key.clone();
    var popupKey = $('#popup-key').data('key', key).data('clone', clone).modal('show');

    popupKey.find('input').val('');

    for (i in key.labels) {
        for (j in inputToPositions) {
            if (inputToPositions[j] == key.labels[i].position) {
                popupKey.find('input:eq(' + j * 2+ ')').val(key.labels[i].value);
                popupKey.find('input:eq(' + (j * 2 + 1) + ')').val(key.labels[i].size);
                break;
            }
        }
    }

    popupKey.find('.key-block').html( clone.draw().element);

    $('#popup-key input:eq(18)').val(key.labelcolor);
    $('#popup-key input:eq(19)').val(key.color);
}