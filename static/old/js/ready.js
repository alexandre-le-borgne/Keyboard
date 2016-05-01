/**
 * Created by l14011190 on 09/03/16.
 */

$(function () {
    var preset = null;
    var ergofip = null;
    var keyboards = ["preset", "ergofip"];
    documentKeyDown();
    loadKeyboards(keyboards);

    $("#comfirm-keyboard").click(function () {
        for (var i in keyboards) {
            if (!$("#" + keyboards[i]).hasClass("hide")) {
                var caret = $("#" + keyboards[i] + "-list").parent().find("a").find(".caret");
                $("#" + keyboards[i] + "-list").parent().find("a").text(
                    $("#" + keyboards[i] + "-name").find("span").text()
                ).append(caret);
                if(keyboards[i] == "preset") {
                    preset = $(this).data("keyboard");
                }
                else {
                    ergofip = $(this).data("keyboard");
                }
                if(preset && ergofip) {
                    $("#next-step").hide().removeClass("hide").slideDown();
                }
            }
        }
    });

    $("#next-step").click(function() {
        var total = $("#menu").find("li").length;
        var current = $("#menu").find("li.active");
        if(current.index() < total - 1) {
            current.removeClass("active").parent().find("li:eq(" + (current.index() + 1) + ")").addClass("active");
        }
    });
});

$.fn.textNotInTag = function (text) {
    this.html(this.html().replace(this.contents().filter(function () {
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
 Charge les claviers du fichier keyboard + "s.json" et les ajoute à "#"+keyboard+"-list"
 */
function loadKeyboards(keyboards) {
    var keyboard;
    for (var i in keyboards) {
        keyboard = keyboards[i];
        $.ajax({
            url: "/static/json/" + keyboard + "s.json",
            dataType: "json",
            keyboard: keyboard
        }).done(function (response) {
            var presets = response['presets'];
            var preset;

            for (var j in presets) {
                preset = presets[j];
                $("#" + this.keyboard + "-list").append(
                    $("<li></li>").text(preset['name']).data(
                        this.keyboard, new Preset(preset['name'], preset['data'])));
            }
            loadSelectionEvent(keyboards, this.keyboard);
        });
    }
}

function loadSelectionEvent(keyboards, keyboard) {
    $("#" + keyboard + "-list").find("li").click(function () {
        for (var i in keyboards) {
            $("#" + keyboards[i]).addClass("hide");
        }
        loadPreset(keyboard, $(this).data(keyboard));
    });
}

function loadPreset(keyboard, data) {
    var name = $("#" + keyboard + "-name");
    var container = $("#" + keyboard + "-container");
    var comfirm = $("#comfirm-keyboard");

    $("#" + keyboard).removeClass("hide");
    name.find("h1").find("span").text(data.name);
    name.find("small").text("Chargement...");
    comfirm.data("keyboard", data.draw(container));
    name.find("h1").find("small").text("");
    comfirm.hide().removeClass("hide").slideDown();
}