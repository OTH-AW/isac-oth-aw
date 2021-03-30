//Klasse der Datentypen
var datatype = function(power, commands, notification) {
    this.notification = notification;
    this.commands = commands;
    this.power = power;
}

var sensors = [];
//Klassen der Sensoren
var sensor = function(sensorName, databaseName, displayName, color, datatype, coordinates, icon, layer, compareState) {
    this.sensorName = sensorName;
    this.databaseName = databaseName;
    this.displayName = displayName;
    this.color = color;
    this.datatype = datatype;
    this.coordinates = coordinates;
    this.icon = icon;
    this.layer = layer;
    this.compareState = compareState;
}

//Erstellen der Sensorenobjekte

//Gelb
sensors.push(new sensor('Bandbero_99_B01', 'Bandbero_99_B01_Meldungen', 'Bandbero_99_B01', 'yellow', new datatype(false, false, true), [190, 170], 'circle', 'touchSensor', false));
sensors.push(new sensor('Bandbero_99_B11', 'Bandbero_99_B11_Meldungen', 'Bandbero_99_B11', 'yellow', new datatype(false, false, true), [590, 381], 'circle', 'touchSensor', false));
sensors.push(new sensor('Bandbero_99_B13', 'Bandbero_99_B13_Meldungen', 'Bandbero_99_B13', 'yellow', new datatype(false, false, true), [590, 138], 'circle', 'touchSensor', false));

//Grün
sensors.push(new sensor('Pneumatikzylinder_1_K1', 'Pneumatikzylinder_1_K1_Befehle', 'Pneumatikzylinder_1_K1', 'green', new datatype(false, true, false), [231, 270], 'circle', 'pneumaticSensor', false));
sensors.push(new sensor('Pneumatikzylinder_1_K2', 'Pneumatikzylinder_1_K2_Befehle', 'Pneumatikzylinder_1_K2', 'green', new datatype(false, true, false), [231, 317], 'circle', 'pneumaticSensor', false));
sensors.push(new sensor('Pneumatikzylinder_2_K1', 'Pneumatikzylinder_2_K1_Befehle', 'Pneumatikzylinder_2_K1', 'green', new datatype(false, true, false), [231, 420], 'circle', 'pneumaticSensor', false));
sensors.push(new sensor('Pneumatikzylinder_2_K2', 'Pneumatikzylinder_2_K2_Befehle', 'Pneumatikzylinder_2_K2', 'green', new datatype(false, true, false), [231, 468], 'circle', 'pneumaticSensor', false));
sensors.push(new sensor('Pneumatikzylinder_3_K1', 'Pneumatikzylinder_3_K1_Befehle', 'Pneumatikzylinder_3_K1', 'green', new datatype(false, true, false), [231, 568], 'circle', 'pneumaticSensor', false));
sensors.push(new sensor('Pneumatikzylinder_3_K2', 'Pneumatikzylinder_3_K2_Befehle', 'Pneumatikzylinder_3_K2', 'green', new datatype(false, true, false), [231, 614], 'circle', 'pneumaticSensor', false));
sensors.push(new sensor('Pneumatikzylinder_4_K1', 'Pneumatikzylinder_4_K1_Befehle', 'Pneumatikzylinder_4_K1', 'green', new datatype(false, true, false), [231, 706], 'circle', 'pneumaticSensor', false));
sensors.push(new sensor('Pneumatikzylinder_4_K2', 'Pneumatikzylinder_4_K2_Befehle', 'Pneumatikzylinder_4_K2', 'green', new datatype(false, true, false), [231, 753], 'circle', 'pneumaticSensor', false));
sensors.push(new sensor('Pneumatikzylinder_99_K1', 'Pneumatikzylinder_99_K1_Befehle', 'Pneumatikzylinder_99_K1', 'green', new datatype(false, true, false), [208, 804], 'circle', 'pneumaticSensor', false));
sensors.push(new sensor('Pneumatikzylinder_99_K2', 'Pneumatikzylinder_99_K2_Befehle', 'Pneumatikzylinder_99_K2', 'green', new datatype(false, true, false), [474, 868], 'circle', 'pneumaticSensor', false));
sensors.push(new sensor('Pneumatikzylinder_99_K3', 'Pneumatikzylinder_99_K3_Befehle', 'Pneumatikzylinder_99_K3', 'green', new datatype(false, true, false), [549, 456], 'circle', 'pneumaticSensor', false));
sensors.push(new sensor('Pneumatikzylinder_99_K4', 'Pneumatikzylinder_99_K4_Befehle', 'Pneumatikzylinder_99_K4', 'green', new datatype(false, true, false), [549, 204], 'circle', 'pneumaticSensor', false));
sensors.push(new sensor('Pneumatikzylinder_5_K1', 'Pneumatikzylinder_5_K1_Befehle', 'Pneumatikzylinder_5_K1', 'green', new datatype(false, true, false), [407, 144], 'circle', 'pneumaticSensor', false));
sensors.push(new sensor('Pneumatikzylinder_5_K2', 'Pneumatikzylinder_5_K2_Befehle', 'Pneumatikzylinder_5_K2', 'green', new datatype(false, true, false), [304, 164], 'circle', 'pneumaticSensor', false));

//Blau
sensors.push(new sensor('Bandbero_99_B02', 'Bandbero_99_B02_Meldungen', 'Bandbero_99_B02', 'blue', new datatype(false, false, true), [234, 192], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_1_B01', 'Bandbero_1_B01_Meldungen', 'Bandbero_1_B01', 'blue', new datatype(false, false, true), [206, 267], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_1_B02', 'Bandbero_1_B02_Meldungen', 'Bandbero_1_B02', 'blue', new datatype(false, false, true), [206, 315], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_1_B03', 'Bandbero_1_B03_Meldungen', 'Bandbero_1_B03', 'blue', new datatype(false, false, true), [206, 352], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_2_B01', 'Bandbero_2_B01_Meldungen', 'Bandbero_2_B01', 'blue', new datatype(false, false, true), [206, 416], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_2_B02', 'Bandbero_2_B02_Meldungen', 'Bandbero_2_B02', 'blue', new datatype(false, false, true), [206, 462], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_2_B03', 'Bandbero_2_B03_Meldungen', 'Bandbero_2_B03', 'blue', new datatype(false, false, true), [206, 515], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_3_B01', 'Bandbero_3_B01_Meldungen', 'Bandbero_3_B01', 'blue', new datatype(false, false, true), [206, 565], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_3_B02', 'Bandbero_3_B02_Meldungen', 'Bandbero_3_B02', 'blue', new datatype(false, false, true), [206, 612], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_3_B03', 'Bandbero_3_B03_Meldungen', 'Bandbero_3_B03', 'blue', new datatype(false, false, true), [235, 647], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_4_B01', 'Bandbero_4_B01_Meldungen', 'Bandbero_4_B01', 'blue', new datatype(false, false, true), [206, 700], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_4_B02', 'Bandbero_4_B02_Meldungen', 'Bandbero_4_B02', 'blue', new datatype(false, false, true), [206, 748], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_99_B06', 'Bandbero_99_B06_Meldungen', 'Bandbero_99_B06', 'blue', new datatype(false, false, true), [234, 802], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_99_B07', 'Bandbero_99_B07_Meldungen', 'Bandbero_99_B07', 'blue', new datatype(false, false, true), [339, 864], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_99_B08', 'Bandbero_99_B08_Meldungen', 'Bandbero_99_B08', 'blue', new datatype(false, false, true), [470, 890], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_99_B09', 'Bandbero_99_B09_Meldungen', 'Bandbero_99_B09', 'blue', new datatype(false, false, true), [545, 777], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_99_B10', 'Bandbero_99_B10_Meldungen', 'Bandbero_99_B10', 'blue', new datatype(false, false, true), [575, 460], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_99_B12', 'Bandbero_99_B12_Meldungen', 'Bandbero_99_B12', 'blue', new datatype(false, false, true), [575, 208], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_99_B14', 'Bandbero_99_B14_Meldungen', 'Bandbero_99_B14', 'blue', new datatype(false, false, true), [576, 65], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_5_B01', 'Bandbero_5_B01_Meldungen', 'Bandbero_5_B01', 'blue', new datatype(false, false, true), [409, 167], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_5_B02', 'Bandbero_5_B02_Meldungen', 'Bandbero_5_B02', 'blue', new datatype(false, false, true), [308, 140], 'circle', 'laserSensor', false));
sensors.push(new sensor('Bandbero_99_B15', 'Bandbero_99_B15_Meldungen', 'Bandbero_99_B15', 'blue', new datatype(false, false, true), [460, 167], 'circle', 'laserSensor', false));

//Powermeters
sensors.push(new sensor('PÜberwachung_ZS_B104', 'PÜberwachung_ZS_B104_Leistungen', 'PÜberwachung_ZS_B104', 'grey', new datatype(true, false, false), [460, 515], 'rightLeftArrow', 'powerMeters', false));  // Icon Mitte Werkzeug für Links und Rechts
sensors.push(new sensor('PÜberwachung_ZS_B103', 'PÜberwachung_ZS_B103_Leistungen', 'PÜberwachung_ZS_B103', 'grey', new datatype(true, false, false), [390, 923], 'bolt', 'powerMeters', false));  // Icon Band nach oben bzw drehen, Vorsicht messgenauigkeit ~ 7%
sensors.push(new sensor('Simocode_Q11M1', 'Simocode_Q11M1_Leistungen', 'Simocode_Q11M1', 'grey', new datatype(true, true, true), [390, 953], 'upDownArrow', 'powerMeters', false));   // Icon Rechtes Drehung für Leistung
sensors.push(new sensor('EnergyMeter_ZS_K31', 'EnergyMeter_ZS_K31_Leistungen', 'EnergyMeter_ZS_K31', 'grey', new datatype(true, false, false), [625, 490], 'bolt', 'powerMeters', false));    // Icon für Eingans Netzteil V24
sensors.push(new sensor('PAC3200_ZS_P0', 'PAC3200_ZS_P0_Leistungen', 'PAC3200_ZS_P0', 'grey', new datatype(true, false, false), [625, 540], 'bolt', 'powerMeters', false));   // Icon gesmaten Verbrauch ganzes Modul
sensors.push(new sensor('Sinamicsachse_US3_M1', 'Sinamicsachse_US3_M1_Leistungen', 'Sinamicsachse_US3_M1', 'grey', new datatype(true, true, true), [400, 748], 'upDownArrow', 'powerMeters', false)); // Icon Rechtes Werkzeug für Achse 1 Vorne/Hinten, Hoch und Runter über Kinematic
sensors.push(new sensor('Sinamicsachse_US3_M2', 'Sinamicsachse_US3_M2_Leistungen', 'Sinamicsachse_US3_M2', 'grey', new datatype(true, true, true), [430, 748], 'upDownArrow', 'powerMeters', false)); // Icon Rechtes Werkzeu für Achse 2 Vorne/Hinten, Hoch und Runter über Kinematic
sensors.push(new sensor('Sinamicsachse_US3_M3', 'Sinamicsachse_US3_M3_Leistungen', 'Sinamicsachse_US3_M3', 'grey', new datatype(true, true, true), [400, 515], 'upDownArrow', 'powerMeters', false)); // Icon Mitte Werkzeug für Vorne/Hinten
sensors.push(new sensor('Sinamicsachse_US3_M4', 'Sinamicsachse_US3_M4_Leistungen', 'Sinamicsachse_US3_M4', 'grey', new datatype(true, true, true), [430, 515], 'upDownArrow', 'powerMeters', false)); // Icon Mitte Werkzeug für Hoch und Runter

export default sensors;
