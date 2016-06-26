/**
 * Created by l14011190 on 09/03/16.
 */
var classicalPreset;
var ergofipPresset;
var selectedErgofip;
var layers = [];
var currentTabLayersIndex = 1;
var currentMacroIndex = 0;
var colorKey;
var classicalPressetsLoaded = [];

var getClassicalPresset = function (name) {
    var preset;
    if (typeof classicalPressetsLoaded[name] == 'undefined') {
        $.ajax({
            url: "/classical/" + name.replace(' ', '_'),
            dataType: "json"
        }).done(function (response) {
            preset = new Preset(name, response);
            classicalPressetsLoaded[name] = preset;
            preset.draw($("#presets-classical").find(".preset"));
        });
    }
    else {
        classicalPressetsLoaded[name].draw($("#presets-classical").find(".preset"));
    }

};

var loadClassicalPressets = $.ajax({
    url: "/classicals",
    dataType: "json"
}).done(function (response) {
    for (var j in response) {
        $("#presets-classical").find('select').append(
            $("<option></option>").text(response[j])
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
                var key = ui.draggable.find(".key");
                if (ui.draggable.hasClass('color')) {
                    $(".key", this).data('key').copyColor(key.data("key"));
                }
                else {
                    if (ui.draggable.hasClass('special')) {
                        $(this).parent().addClass('special');
                    }
                    else {
                        $(this).parent().removeClass('special');
                    }
                    $(".key", this).data('key').copy(key.data("key"));
                }
            },
            activate: function (event, ui) {
                $(this).addClass('drop-accept');
            },
            deactivate: function (event, ui) {
                $(this).removeClass('drop-accept');
            }
        }).draggable({
            connectToSortable: "#keys .macro .keys",
            helper: "clone",
            disabled: true,
            opacity: 0.9,
            zIndex: 1000,
            cursor: 'move',
            scope: "macro"
        });
    }
};

var loadDraggableClassical = function (classical) {
    var key;
    for (var i in classical.keyboard.keys) {
        key = classical.keyboard.keys[i];
        key.element.draggable({
            // Permet de correctement positionner sous la souris la touche draggué lorsque celle-ci a une rotation
            drag: function (event, ui) {
                ui.position.top = ui.position.top - $(this).position().top;
                ui.position.left = ui.position.left - $(this).position().left;
            },
            helper: "clone",
            opacity: 0.9,
            zIndex: 1000,
            cursor: 'move'
        });
    }
};

var addSpecialKeys = function (char, scope) {
    var labels = [];
    labels[0] = new Label(char, Positions.TOP_RIGHT, defaultSettings.f, defaultSettings.t);
    var key = new Key(labels, defaultSettings.x, defaultSettings.y, defaultSettings.w, defaultSettings.h,
        defaultSettings.c, defaultSettings.r, defaultSettings.rx, defaultSettings.ry).draw().element;
    var settings = {
        connectToSortable: "#keys .macro .keys",
        helper: 'clone',
        opacity: 0.9,
        zIndex: 1000,
        cursor: 'move'
    };
    if (typeof scope !== 'undefined')
        settings.scope = scope;
    key.draggable(settings).addClass('special');
    console.log(key.find('.key').data('key'));
    return key;
};

var generateSpecialKeys = function () {
    var gotoKeys = $('#layers-two').find('#goto-keys .keys');
    var toggleKeys = $('#layers-two').find('#toggle-keys .keys');
    gotoKeys.empty();
    toggleKeys.empty();
    for (var i = 0; i < Object.keys(layers).length; ++i) {
        gotoKeys.append(addSpecialKeys('⇶ ' + (i + 1)));
        toggleKeys.append(addSpecialKeys('⇫ ' + (i + 1)));
    }
};

var addMacro = function () {
    var macro = addSpecialKeys('⚐ ' + (++currentMacroIndex));
    var macroContainer = $('<div></div>').append(
        $('<div></div>').append(macro).addClass('macro-key')
    ).append(
        $('<div></div>').addClass('keys').sortable({
            cursor: 'move',
            axis: "x",

            // See https://github.com/angular-ui/ui-sortable/issues/19
            start: function (e, ui) {
                $(e.target).data("ui-sortable").floating = true;
            },
            over: function (e, ui) {
                ui.sender.parent().addClass('sortable-hover');
            },
            out: function (e, ui) {
                ui.item.parent().parent().removeClass('sortable-hover');
            }
        })
    ).append(
        $('<div></div>').append(
            $('<button></button>').text('Delete').click(function () {
                macroContainer.remove()
            }).addClass('btn').addClass('btn-danger')
        ).addClass('macro-delete')
    ).addClass('macro');
    $('#keys').find('#macros').append(
        macroContainer
    );
};

var load = function () {
    $("#preset-ergofip").find("#preset-ergofip-container").tabs({
        beforeActivate: function (event, ui) {
            var index = ui.newTab.index();
            $('#layers-two').find('.keys .key-container').css('opacity', '1').draggable("enable");
            $('#layers-two').find('#goto-keys .keys .key-container:eq(' + index + ')').add(
                $('#layers-two').find('#toggle-keys .keys .key-container:eq(' + index + ')')
            ).css('opacity', '0.5').draggable("disable");
            $('#preset-ergofip').find('#preset-ergofip-container .badge').text(index + 1);
            $(ui.oldTab).removeClass("active");
            $(ui.newTab).addClass("active");
        },
        create: function (event, ui) {
            generateSpecialKeys();
            var index = ui.tab.index();
            $(ui.tab).addClass("active");
            $('#layers-two').find('#goto-keys .keys .key-container:eq(' + index + ')').add(
                $('#layers-two').find('#toggle-keys .keys .key-container:eq(' + index + ')')
            ).css('opacity', '0.5').draggable("disable");
        },
        show: {effect: "fade", duration: 300},
        hide: {effect: "fade", duration: 300}
    });
    $('#preset-ergofip').find('#preset-ergofip-container').tabs('option', 'active', 0);
};

var rapidLaunch = function () {
    $.ajax({
        url: "/classical/ANSI_104",
        dataType: "json"
    }).done(function (response) {
        var preset = new Preset('ANSI 104', response);
        classicalPressetsLoaded['ANSI 104'] = preset;
        preset.draw($("#presets-classical").find(".preset"));
        classicalPreset = preset.draw($("#layers-one").find("#preset-classical-container").show().find(".preset"));
        selectedErgofip = $("#presets-ergofip").find("select option:eq(2)").data('preset');
        ergofipPresset = selectedErgofip.draw($("#preset-ergofip").find("#preset-ergofip-container").show().find(".preset"));
        layers[currentTabLayersIndex] = ergofipPresset;
        loadDraggableClassical(classicalPreset);
        loadSelectableKeys(ergofipPresset);
        $("#layers-one").find("#preset-classical-empty").hide();
        $("#preset-ergofip").find("#preset-ergofip-empty").hide();
        $("#body").tabs("option", "active", 1);
    });
};

$(function () {
    $("#layers-one").find("#preset-classical-container").hide();
    $("#preset-ergofip").hide().find("#preset-ergofip-container").hide();

    $("#body").tabs({
        activate: function (event, ui) {
            if (ui.newPanel.attr('id') == 'presets' || ui.newPanel.attr('id') == 'brands' || ui.newPanel.attr('id') == 'ergonomics') {
                $("#preset-ergofip").hide();
            }
            else {
                $("#preset-ergofip").show();
            }

            if (ui.newPanel.attr('id') == 'layers-one') {
                $("#preset-ergofip-container .presets .key").off('click').click(function () {
                    loadPopupKey($(this).data('key'));
                })
            }
            else {
                $("#preset-ergofip-container .presets .key").off('click');
            }

            if (ui.newPanel.attr('id') == 'colors') {
                $("#preset-ergofip-container .presets").selectable('option', 'disabled', false);
            }
            else {
                $("#preset-ergofip-container .presets").selectable('option', 'disabled', true).find('.key-border').removeClass('ui-selected');
            }

            if (ui.newPanel.attr('id') == 'keys') {
                $('#preset-ergofip').find(".key-border").draggable('option', 'disabled', false);
            }

            if (ui.oldPanel.attr('id') == 'keys') {
                $('#preset-ergofip').find(".key-border").draggable('option', 'disabled', true);
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

    $("#body").tabs("option", "active", 0);
    $("#presets").tabs("option", "active", 0);

    colorKey = addSpecialKeys('').addClass('color');
    colorKey.find('.key');
    $('#colors #key').append(colorKey);

    $('#keys #specials').append(addSpecialKeys('Delay 10ms', 'macro').addClass('delay'));

    addMacro();

    $.when(
        loadClassicalPressets,
        loadErgofipPressets
    ).done(function () {
        rapidLaunch();
        load();
    });

    // ------------------------------------------------------------------------------
    // EVENTS
    // ------------------------------------------------------------------------------

    $("#keys #macros .keys").on('click', ' .delay .key', function () {
        loadPopupDelay($(this));
    });

    $("#layers-one").find("#preset-classical-empty button").click(function () {
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
            loadDraggableClassical(classicalPreset);
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
            loadSelectableKeys(ergofipPresset);
            $("#preset-ergofip").find("#preset-ergofip-empty").hide();
            $("#body").tabs("option", "active", 1);
        }
    });

    $("#presets-classical").find("select").change(function () {
        getClassicalPresset($("option:selected", this).text());
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
            var ergofip = selectedErgofip.draw(preset);

            loadSelectableKeys(ergofip);

            layers[currentTabLayersIndex] = ergofip;
            var link;
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
                $(this).text(($(this).parent().index() + 1) + ' >>');
            });
            generateSpecialKeys();
            //if ($('nav li.active a').attr('href') == '#keys') {
            //    preset.find(".key-border").draggable('option', 'disabled', false);
            //}
            $('#preset-ergofip').find('#preset-ergofip-container').tabs("refresh");
            $('#preset-ergofip').find('#preset-ergofip-container').tabs('option', 'active', currentIndex + 1);

            // Réactualiser les tabs en haut pour rendre les touche du clavier dropable pour la page Keys
            var bodyIndex = $("#body").tabs("option", "active");
            $("#body").tabs("option", "active", 0);
            $("#body").tabs("option", "active", bodyIndex);

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
            delete layers[index];
            link.nextAll().find('a').each(function () {
                $(this).text(($(this).parent().index()) + ' >>');
            });
            link.remove();
            preset.remove();
            generateSpecialKeys();
            $('#preset-ergofip').find('#preset-ergofip-container').tabs("refresh");
            $('#preset-ergofip').find('#preset-ergofip-container').tabs('option', 'active', Object.keys(layers).length);
        }
    });

    $("#preset-ergofip-container .presets").selectable({
        filter: ".key-border"
    });

    $('#colors #colors-selected').click(function () {
        $('#preset-ergofip-container').find('.preset:visible .key-container .ui-selected').each(function () {
            $(this).find('.key').data('key').copyColor(colorKey.find('.key').data('key'));
        });
    });

    $('#colors #colors-all').click(function () {
        $('#preset-ergofip-container').find('.preset:visible .key-container').each(function () {
            $(this).find('.key').data('key').copyColor(colorKey.find('.key').data('key'));
        });
    });

    $('#keys #keys-add-macro').click(function () {
        addMacro();
    });

    $("#brands .media").click(function () {
        $("#brands .media").removeClass('active');
        $(this).addClass('active');
    });

});