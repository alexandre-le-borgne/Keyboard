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
    9: Positions.BOTTOM_RIGHT
};

var positionToInputs = function(position) {
  for(var i in inputToPositions) {
      if(inputToPositions[i] == convertPosition[position]) {
          return i;
      }

  }
};
var clone;
$(function () {
    $('#popup-delay .save').click(function() {
        $('#popup-delay').data('key').find('.key-label div').text('Delay ' + $('#popup-delay input').val() + 'ms');
        $('#popup-delay').modal('hide');
    });

    $('#popup-key input').change(function () {
        //var clone = $('#popup-key').data('clone');
        console.log('labels');
        console.log(clone);
        console.log(clone.labels);
        var i, j;
        for (i = 0; i < 9; ++i) {
            var value = $('#popup-key input:eq(' + (i * 2) + ')').val();
            var size = $('#popup-key input:eq(' + (i * 2 + 1) + ')').val();
            var labelindex;

            for(j in clone.labels) {
                if(clone.labels[j].position == inputToPositions[i]) {
                    labelindex = j;
                }
            }
            console.log(labelindex);
            if (typeof labelindex == 'undefined') {
                if (value.trim() !== '') {
                    clone.labels.push(new Label(value, inputToPositions[i], size));
                }
            }
            else {
                if (value.trim() == '') {
                    delete clone.labels[labelindex];
                }
                else {
                    clone.labels[labelindex].value = value;
                    clone.labels[labelindex].size = size;
                }

            }
        }
        clone.labelcolor = $('#popup-key input:eq(18)').val();
        clone.color = $('#popup-key input:eq(19)').val();
        clone.draw();
        $('#popup-key').find('.key-container').html( clone.draw().element.clone());
    });
});

function loadPopupDelay(key) {
    var delay = parseInt(key.find('.key-label div').text().substring(6), 10);
    var popupDelay = $('#popup-delay').data('key', key).modal('show').find('input').val(delay);
}

function loadPopupKey(key) {
    //var clone;

    var popupKey = $('#popup-key').data('key', key).modal('show');

    popupKey.find('input').val('');
    var labelsclone = [];
    for (i in key.labels) {
        for (j in inputToPositions) {
            if (inputToPositions[j] == key.labels[i].position) {
                labelsclone.push(new Label(key.labels[i].value, key.labels[i].position, key.labels[i].size));
                popupKey.find('input:eq(' + j * 2+ ')').val(key.labels[i].value);
                popupKey.find('input:eq(' + (j * 2 + 1) + ')').val(key.labels[i].size);
                break;
            }
        }
    }
    clone = new Key(labelsclone, key.x, key.y, key.width, key.height, key.color, key.labelcolor,
        key.rotation_angle, key.rotation_x, key.rotation_y);
    //popupKey.data('clone', clone);
    popupKey.find('.key-container').html( clone.draw().element.clone());
    $('#popup-key input:eq(18)').val(key.labelcolor);
    $('#popup-key input:eq(19)').val(key.color);
    //$('#popup-key input:eq(20)').val(key.width);
    //$('#popup-key input:eq(21)').val(key.height);
}