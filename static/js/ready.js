/**
 * Created by l14011190 on 09/03/16.
 */

$(function () {
    documentKeyDown();
    var keyboards = ["preset", "ergofip"];
    loadKeyboards(keyboards);
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

/*
 Charge les claviers du fichier selector + "s.json" et les ajoute à "#"+selector+"-list"
 */
function loadKeyboards(selectors) {
    var selector;
    for(var i in selectors) {
        selector = selectors[i];
        console.log(selector);
        console.log($("#" + selector + "-list"));
        $.ajax({
            url: "/static/json/" + selector + "s.json",
            dataType: "json",
            selector: selector
        }).done(function (response) {
            var presets = response['presets'];
            var preset;

            for (var j in presets) {
                preset = presets[j];
                $("#" + this.selector + "-list").append(
                    $("<li></li>").text(preset['name']).data(this.selector, new Preset(preset['name'], preset['data'])));
            }
            loadSelectionEvent(selectors, this.selector);
        });
    }
}

function loadSelectionEvent(selectors, selector) {
    $("#"+selector+"-list").find("li").click(function() {
        for(var i in selectors) {
            $("#" + selectors[i]).addClass("hide");
        }
        loadPreset(selector, $(this).data(selector));
    });
}

function loadPreset(selector, data) {
    var name = $("#"+selector+"-name");
    var container = $("#"+selector+"-container");
    $("#" + selector).removeClass("hide");
    console.log(data.name);
    console.log(selector);
    name.find("h1").find("span").text(data.name);
    name.find("small").text("Chargement...");
    data.draw(container);
    name.find("h1").find("small").text("");
}