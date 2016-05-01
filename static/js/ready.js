/**
 * Created by l14011190 on 09/03/16.
 */
var classicalPreset;
var ergofipPresset;
var layers = [];

var loadClassicalPressets = function () {
    $.ajax({
        url: "/static/json/classicals.json",
        dataType: "json"
    }).done(function (response) {
        var presets = response['presets'];
        var preset;

        for (var j in presets) {
            preset = presets[j];
            $("#presets-classical").find('select').append(
                $("<option></option>").text(preset['name']).data(
                    'preset', new Preset(preset['name'], preset['data'])
                )
            );
        }
    });
};

var loadErgofipPressets = function () {
    $.ajax({
        url: "/static/json/ergofips.json",
        dataType: "json"
    }).done(function (response) {
        var presets = response['presets'];
        var preset;

        for (var j in presets) {
            preset = presets[j];
            $("#presets-ergofip").find("select").append(
                $("<option></option>").text(preset['name']).data(
                    'preset', new Preset(preset['name'], preset['data'])
                )
            );
        }
    });
};

var dragDrop = function (classical, ergofip) {
    console.log(classical.keyboard);
    var key;
    for (var i in classical.keyboard.keys) {
        key = classical.keyboard.keys[i];
        key.element.draggable({
            helper: "clone",
            opacity: 0.9,
            zIndex: 1000
        });
    }
    for (var j in ergofip.keyboard.keys) {
        key = ergofip.keyboard.keys[j];
        key.element.find(".key-border").droppable({
            hoverClass: "drop-hover",
            tolerance: "pointer",
            drop: function( event, ui ) {
                $(".key", this).data('key').copy(ui.draggable.find(".key").data("key"));
            }
        });
    }
};

$(function () {
    $("#layers-one").find(".preset-classical").hide();
    $("#layers-one").find(".preset-ergofip").hide();

    $("#body").tabs({
        activate: function (event, ui) {
            $(ui.oldTab).removeClass("active");
            $(ui.newTab).addClass("active");
        }
    });
    $("#presets").tabs({
        activate: function (event, ui) {
            $(ui.oldTab).removeClass("active");
            $(ui.newTab).addClass("active");
        }
    });
    $("#layers-one").find(".preset-ergofip").tabs({
        activate: function (event, ui) {
            $(ui.oldTab).removeClass("active");
            $(ui.newTab).addClass("active");
        }
    });

    $("#body").tabs("option", "active", 0);
    $("#presets").tabs("option", "active", 0);
    $("#layers-one").find(".preset-ergofip").tabs("option", "active", 0);

    loadClassicalPressets();
    loadErgofipPressets();

    $("#layers-one").find(".preset-classical-empty").click(function () {
        $("#body").tabs("option", "active", 0);
        $("#presets").tabs("option", "active", 0);
    });

    $("#layers-one").find(".preset-ergofip-empty").click(function () {
        $("#body").tabs("option", "active", 0);
        $("#presets").tabs("option", "active", 1);
    });

    $("#presets-classical").find("button").click(function () {
        var preset = $("#presets-classical").find("select option:selected").data('preset');
        if (preset) {
            classicalPreset = preset.draw($("#layers-one").find(".preset-classical").show().find(".preset"));
            if(ergofipPresset) {
                dragDrop(classicalPreset, ergofipPresset);
            }
            $("#layers-one").find(".preset-classical-empty").hide();
            $("#presets").tabs("option", "active", 1);
        }
    });

    $("#presets-ergofip").find("button").click(function () {
        var preset = $("#presets-ergofip").find("select option:selected").data('preset');
        if (preset) {
            ergofipPresset = preset.draw($("#layers-one").find(".preset-ergofip").show().find(".preset"));
            if(classicalPreset) {
                dragDrop(classicalPreset, ergofipPresset);
            }
            $("#layers-one").find(".preset-ergofip-empty").hide();
            $("#body").tabs("option", "active", 1);
        }
    });

    $("#presets-classical").find("select").change(function () {
        var preset = $("option:selected", this).data('preset');
        if (preset) {
            preset.draw($("#presets-classical").find(".preset"));
        }
    });

    $("#presets-ergofip").find("select").change(function () {
        var preset = $("option:selected", this).data('preset');
        if (preset) {
            preset.draw($("#presets-ergofip").find(".preset"));
        }
    });

    $( ".preset-ergofip" ).selectable({
      filter: ".key-border"
    });
});