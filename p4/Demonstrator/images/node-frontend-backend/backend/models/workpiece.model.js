const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ControlProcesses = new Schema({
    _id: false,
    controlStartingTime: Date, // QC-Beginn
    controlCompletionTime: Date, // QC-Ende
    function: Boolean, // Zustand ok
    color: Boolean, // Entspricht Farbe dem erwarteten Wert
    shape: Boolean, // Entspricht Form dem erwarteten Wert
  });

const StorageProcesses = new Schema({
    _id: false,
    storageStartingTime: Date, // Einlagerungszeit-Beginn
    storageCompletionTime: Date, // Einlagerungszeit-Ende
    outsourceStartingTime: Date, // Auslagerungszeit-Beginn 
    outsourceCompletionTime: Date, // Auslagerungszeit-Ende
  });

const workpieceSchema = new Schema({
    workpieceId: { type: String }, // Werkstück-ID
    color: {
        actualValue: { type: String }, // Farbe Ist-Wert
        toValue: { type: String } // Farbe Soll-Wert
    },
    shape: {
        actualValue: { type: String }, // Geometrie Ist-Wert
        toValue: { type: String } // Geometrie Soll-Wert
    },
    state: {
        id: { type: Number }, // Status-ID
        message: { type: String }, // Status-Meldung
        timeEstimate: { type: Number }, // Kalkulierte Druckdauer
        timeCurrent: { type: Number }, // Bisherige Druckdauer
        timeLeft: { type: Number }, // Verbleibende Druckdauer
        completion: { type: Number }, // Fertigstellung in Prozent,
        printStartingTime: { type: Date }, // Druckzeit-Beginn,
        printCompletionTime: { type: Date }, // Druckzeit-Ende,
        controlProcesses: [ ControlProcesses ],
        storageProcesses: [ StorageProcesses ],
        place: {
            id: { type: Number }, // Standort-ID
            faculty: { type: String }, // Fakultät
            floor: { type: String }, // Stockwerk
            room: { type: String }, // Raum
            subproject: { type: String } // Teilprojekt
        }
    },
    order: {
        number: { type: String }, // Bestellnummer
        customer: {
            firstname: { type: String }, // Vorname
            name: { type: String }, // Nachname
            zip: { type: Number }, // Polstleitzahl
            email: { type: String }, // E-Mail
            address: { type: String }, // Adresse
            address2: { type: String }, // Adresse 2
            ort: { type: String }, // Ort
        },
        shape: {
            toValue: { type: String } // Geometrie Soll-Wert
        },
        color: {
            toValue: { type: String } // Farbe Soll-Wert
        },
        createdAt: { type: Date },
        updatedAt: { type: Date },
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
}, {
    timestamps: true,
});

const Workpiece = mongoose.model('Workpiece', workpieceSchema);

module.exports = Workpiece;