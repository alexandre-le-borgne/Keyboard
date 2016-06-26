/**
 * Created by Alexandre on 06/05/2016.
 */
var Positions = function () {
};
Positions.FRONT = 0;
Positions.BOTTOM_LEFT = 1;
Positions.BOTTOM_CENTER = 2;
Positions.BOTTOM_RIGHT = 3;
Positions.MIDDLE_LEFT = 4;
Positions.MIDDLE_CENTER = 5;
Positions.MIDDLE_RIGHT = 6;
Positions.TOP_LEFT = 7;
Positions.TOP_CENTER = 8;
Positions.TOP_RIGHT = 9;

var Constantes = function () {
};
Constantes.BORDER_SIZE = 12;
Constantes.DISTANCE_TO_PX = 42;

var labelMap = [
    //0  1  2  3  4  5  6  7  8  9 10 11   // align flags
    [ 0, 6, 2, 8, 9,11, 3, 5, 1, 4, 7,10], // 0 = no centering
    [ 1, 7,-1,-1, 9,11, 4,-1,-1,-1,-1,10], // 1 = center x
    [ 3,-1, 5,-1, 9,11,-1,-1, 4,-1,-1,10], // 2 = center y
    [ 4,-1,-1,-1, 9,11,-1,-1,-1,-1,-1,10], // 3 = center x & y
    [ 0, 6, 2, 8,10,-1, 3, 5, 1, 4, 7,-1], // 4 = center front (default)
    [ 1, 7,-1,-1,10,-1, 4,-1,-1,-1,-1,-1], // 5 = center front & x
    [ 3,-1, 5,-1,10,-1,-1,-1, 4,-1,-1,-1], // 6 = center front & y
    [ 4,-1,-1,-1,10,-1,-1,-1,-1,-1,-1,-1] // 7 = center front & x & y
];

var convertPosition = {
    0: Positions.TOP_LEFT,
    1: Positions.TOP_CENTER,
    2: Positions.TOP_RIGHT,
    3: Positions.MIDDLE_LEFT,
    4: Positions.FRONT,
    5: Positions.MIDDLE_RIGHT,
    6: Positions.BOTTOM_LEFT,
    7: Positions.BOTTOM_CENTER,
    8: Positions.BOTTOM_RIGHT,
    9: Positions.MIDDLE_CENTER,
    10: Positions.FRONT,
    11: Positions.FRONT
};

var defaultSettings = {
    x: 0,           // Décalage horizontal
    y: 0,           // Décalage verticale
    w: 1,           // Largeur
    h: 1,           // Hauteur
    f: 3,           // Taille des labels
    r: 0,           // Angle de rotation
    rx: 0,          // Position du centre de rotation en x
    ry: 0,          // Position du centre de rotation en y
    a: 4,           // Type de positionnement des labels
    c: "#FFFFFF",      // Couleur de la touche
    t: "#FFFFFF"       // Couleur des labels
};
