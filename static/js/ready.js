/**
 * Created by l14011190 on 09/03/16.
 */

$(function () {
    documentKeyDown();
    loadPresets();
});

$.fn.textNotInTag = function(text) {
    this.html(this.html().replace(this.contents().filter(function() {
        return this.nodeType == Node.TEXT_NODE;
    }).text(), text));
    return this;
};

var KEYS = [];
function documentKeyDown() {
    $(document).on('keydown', function (e) {
        if ($.inArray(e.which, KEYS) == -1)
            KEYS.push(e.which);
    }).on('keyup', function (e) {
        KEYS.splice($.inArray(e.which, KEYS), 1);
    });
}

function loadPresets() {
    $.ajax({
        url: "/static/json/presets.json",
        dataType: "json"
    }).done(function (response) {
        var presets = response['presets'];
        var preset;
        for(var i in presets) {
            preset = presets[i];
            $('#preset-list').append(
                $("<li></li>").text(preset['name']).data('preset', new Preset(preset['name'], preset['data'])));
       }
       loadPresetSelectionEvent();
    });
}

function loadPresetSelectionEvent() {
    $("#preset-list").find("li").click(function() {
        loadPreset($(this).data('preset'));
    });
}

function loadPreset(preset) {
    $("#preset-name").find("h1").textNotInTag(preset.name + " ").find("small").text("Chargement...");
    preset.draw($("#preset"));
    $("#preset-name").find("h1").find("small").text("");
}