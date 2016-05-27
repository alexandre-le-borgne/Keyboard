/**
 * Created by l14011190 on 09/03/16.
 */
var classicalPreset;
var ergofipPresset;
var selectedErgofip;
var layers = [];
var currentTabLayersIndex = 1;

var loadClassicalPressets = $.ajax({
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

var loadErgofipPressets = $.ajax({
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

var loadSelectableKeys = function (ergofip) {
    for (var j in ergofip.keyboard.keys) {
        key = ergofip.keyboard.keys[j];
        key.element.find(".key-border").droppable({
            hoverClass: "drop-hover",
            tolerance: "pointer",
            drop: function (event, ui) {
                $(".key", this).data('key').copy(ui.draggable.find(".key").data("key"));
            },
            activate: function (event, ui) {
                $(this).addClass('drop-accept');
            },
            deactivate: function (event, ui) {
                $(this).removeClass('drop-accept');
            }
        });
    }
};

var dragDrop = function (classical, ergofip) {
    var key;
    for (var i in classical.keyboard.keys) {
        key = classical.keyboard.keys[i];
        key.element.draggable({
            // Permet de correctement positionner sous la souris la touche draggué lorsque celle-ci a une rotation
            drag: function( event, ui ) {
                ui.position.top = ui.position.top - $(this).position().top;
                ui.position.left = ui.position.left - $(this).position().left;
            },
            helper: "clone",
            opacity: 0.9,
            zIndex: 1000,
            cursor: 'move'
        });
    }
    loadSelectableKeys(ergofip);
};

var rapidLaunch = function () {
    var preset = $("#presets-classical").find("select option:eq(3)").data('preset');
    classicalPreset = preset.draw($("#layers-one").find("#preset-classical-container").show().find(".preset"));
    selectedErgofip = $("#presets-ergofip").find("select option:eq(2)").data('preset');
    ergofipPresset = selectedErgofip.draw($("#preset-ergofip").find("#preset-ergofip-container").show().find(".preset"));
    layers[currentTabLayersIndex] = ergofipPresset;
    dragDrop(classicalPreset, ergofipPresset);
    $("#layers-one").find("#preset-classical-empty").hide();
    $("#preset-ergofip").find("#preset-ergofip-empty").hide();
    $("#body").tabs("option", "active", 1);
};

var addSpecialKeys = function (char, target) {
    var labels = [];
    labels[0] = new Label(char, Positions.TOP_RIGHT, defaultSettings.f, defaultSettings.t);
    var key = new Key(labels, defaultSettings.x, defaultSettings.y, defaultSettings.w, defaultSettings.h,
        defaultSettings.c, defaultSettings.r, defaultSettings.rx, defaultSettings.ry).draw().element;
    key.draggable({
        helper: "clone",
        opacity: 0.9,
        zIndex: 1000,
        cursor: 'move'
    });
    return key
};

var generateSpecialKeys = function () {
    var gotoKeys = $('#layers-two').find('#goto-keys').find('.keys');
    var toggleKeys = $('#layers-two').find('#toggle-keys').find('.keys');
    gotoKeys.empty();
    toggleKeys.empty();
    for (var i = 0; i < Object.keys(layers).length; ++i) {
        gotoKeys.append(addSpecialKeys('⇶ ' + (i + 1)));
        toggleKeys.append(addSpecialKeys('⇫ ' + (i + 1)));
    }
};

$(function () {
    $("#layers-one").find("#preset-classical-container").hide();
    $("#preset-ergofip").find("#preset-ergofip-container").hide();
    $("#preset-ergofip").hide();

    $("#body").tabs({
        activate: function (event, ui) {
            if (ui.newPanel.attr('id') == 'presets') {
                $("#preset-ergofip").hide();
            }
            else {
                $("#preset-ergofip").show();
            }

            if (ui.newPanel.attr('id') == 'layers-two') {
                generateSpecialKeys();
            }

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

    $("#preset-ergofip").find("#preset-ergofip-container").tabs({
        activate: function (event, ui) {
            $('#preset-ergofip').find('#preset-ergofip-container .badge').text(ui.newTab.index() + 1);
            $(ui.oldTab).removeClass("active");
            $(ui.newTab).addClass("active");
        },
        show: 'fade',
        hide: 'fade'
    });

    $("#body").tabs("option", "active", 0);
    $("#presets").tabs("option", "active", 0);
    $('#preset-ergofip').find('#preset-ergofip-container').tabs('option', 'active', 0);

    $.when(
        loadClassicalPressets,
        loadErgofipPressets
    ).done(function() { rapidLaunch(); });

    // ------------------------------------------------------------------------------
    // EVENTS
    // ------------------------------------------------------------------------------

     $("#layers-one").find(".preset-classical-empty").click(function () {
        $("#body").tabs("option", "active", 0);
        $("#presets").tabs("option", "active", 0);
    });

    $("#preset-ergofip").find("#preset-ergofip-empty button").click(function () {
        $("#body").tabs("option", "active", 0);
        $("#presets").tabs("option", "active", 1);
    });

    $("#presets-classical").find("button").click(function () {
        var preset = $("#presets-classical").find("select option:selected").data('preset');
        if (preset) {
            classicalPreset = preset.draw($("#layers-one").find("#preset-classical-container").show().find(".preset"));
            if (ergofipPresset) {
                dragDrop(classicalPreset, ergofipPresset);
            }
            $("#layers-one").find("#preset-classical-empty").hide();
            $("#presets").tabs("option", "active", 1);
        }
    });

    $("#presets-ergofip").find("button").click(function () {
        selectedErgofip = $("#presets-ergofip").find("select option:selected").data('preset');
        if (selectedErgofip) {
            ergofipPresset = selectedErgofip.draw($("#preset-ergofip").find("#preset-ergofip-container").show().find(".preset"));
            layers = [];
            layers[currentTabLayersIndex] = ergofipPresset;
            if (classicalPreset) {
                dragDrop(classicalPreset, ergofipPresset);
            }
            $("#preset-ergofip").find("#preset-ergofip-empty").hide();
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

    $('#preset-ergofip').find('#add-layer').click(function () {
        var currentIndex = $('#preset-ergofip').find('#preset-ergofip-container').tabs("option", "active");
        if (selectedErgofip) {
            var visiblePreset = $('#preset-ergofip-container').find('.preset:visible');
            var index = visiblePreset.attr('data-index');

            ++currentTabLayersIndex;


            var preset = $('<div></div>').addClass('preset')
                .attr('id', 'layers-one-preset-ergofip-' + currentTabLayersIndex)
                .attr('data-index', currentTabLayersIndex);
            // console.log(preset);
            var ergofip = selectedErgofip.draw(preset);
            loadSelectableKeys(ergofip);
            // console.log(layers);
            // for(var i = layers.length - 1; i > index; --i) {
            //     layers[i + 1] = layers[i];
            // }
            layers[currentTabLayersIndex] = ergofip;
            console.log(layers);

            var link;
            console.log(currentIndex);
            if (currentIndex === false) {
                link = $('<li></li>').append(
                    $('<a></a>').attr('href', '#layers-one-preset-ergofip-' + currentTabLayersIndex).text('1 >>')
                );
                $('#preset-ergofip').find('.presets').append(preset);
                $("#preset-ergofip").find('ul').append(link);
                currentIndex = 1;
            }
            else {
                link = $('<li></li>').append(
                    $('<a></a>').attr('href', '#layers-one-preset-ergofip-' + currentTabLayersIndex).text((currentIndex + 2) + ' >>')
                );
                $('#preset-ergofip').find('.presets .preset:eq(' + currentIndex + ')').after(preset);
                $("#preset-ergofip").find('ul li:eq(' + currentIndex + ')').after(link);
            }
            link.nextAll().find('a').each(function () {
                console.log($(this));
                $(this).text(($(this).parent().index() + 1) + ' >>');
            });

            generateSpecialKeys();
            $('#preset-ergofip').find('#preset-ergofip-container').tabs("refresh");
            $('#preset-ergofip').find('#preset-ergofip-container').tabs('option', 'active', currentIndex + 1);

        }
    });

    $('#preset-ergofip').find('#reset-layer').click(function () {
        var preset = $('#preset-ergofip-container').find('.preset:visible');
        var ergofip = selectedErgofip.draw(preset);
        loadSelectableKeys(ergofip);
        layers[preset.attr('data-index')] = ergofip;
    });

    $('#preset-ergofip').find('#remove-layer').click(function () {
        var preset = $('#preset-ergofip-container').find('.preset:visible');
        if (preset.length == 1) {
            var label = preset.attr('aria-labelledby');
            var index = preset.attr('data-index');
            var link = $('#preset-ergofip').find('ul li a#' + label).parent();
            // var nb = index;
            // for(var i = index + 1; i < layers.length; ++i) {
            //     layers[i - 1] = layers[i];
            // }
            delete layers[index];
            link.nextAll().find('a').each(function () {
                $(this).text(($(this).parent().index()) + ' >>');
            });
            link.remove();
            preset.remove();
            generateSpecialKeys();
            // console.log(currentTabLayersIndex);
            $('#preset-ergofip').find('#preset-ergofip-container').tabs("refresh");
            $('#preset-ergofip').find('#preset-ergofip-container').tabs('option', 'active', Object.keys(layers).length);
        }
    });

    $("#preset-ergofip-container .presets").selectable({
        filter: ".key-border"
    });

});