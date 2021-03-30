module.exports = {
    CREATED_AND_IN_PRODUCTION_QUEUE: {
        id: 0,
        message: "Angelegt, in Produktions-Warteschlange.",
        place: {
            id: 0,
            faculty: null,
            floor: null,
            room: null,
            subproject: null
        }
    },

    RUNNING_PRINT: {
        id: 1,
        message: "Wird gedruckt.",
        place: {
            id: 1,
            faculty: "MBUT",
            floor: "Erdgeschoss",
            room: "0123",
            subproject: "TP1"
        }
    },

    POST_PRODUCTION_TRANSFERING_TO_QC: {
        id: 2,
        message: "Auf dem Weg zur Prüfung, nach Produktion.",
        place: {
            id: 0,
            faculty: null,
            floor: null,
            room: null,
            subproject: null
        }
    },

    POST_PRODUCTION_RUNNING_QC: {
        id: 3,
        message: "Wird geprüft. Prüfung nach Produktion.",
        place: {
            id: 3,
            faculty: "EMI",
            floor: "Erdgeschoss",
            room: "0123",
            subproject: "TP3"
        }
    },

    POST_QC_TRANSFERING_TO_STORAGE: {
        id: 4,
        message: "Auf dem Weg zum Lager nach Prüfung.",
        place: {
            id: 0,
            faculty: null,
            floor: null,
            room: null,
            subproject: null
        }
    },

    IN_STORAGE: {
        id: 5,
        message: "Eingelagert.",
        place: {
            id: 2,
            faculty: "MBUT",
            floor: "Erdgeschoss",
            room: "04213",
            subproject: "TP2"
        }
    },

    POST_STORAGE_TRANSFERING_TO_QC: {
        id: 6,
        message: "Auf dem Weg zur Prüfung, nach Lager.",
        place: {
            id: 0,
            faculty: null,
            floor: null,
            room: null,
            subproject: null
        }
    },

    POST_STORAGE_RUNNING_QC: {
        id: 7,
        message: "Wird geprüft. Prüfung nach Lagerung.",
        place: {
            id: 3,
            faculty: "EMI",
            floor: "Erdgeschoss",
            room: "0123",
            subproject: "TP3"
        }
    },

    TRANSFERING_TO_PICKUP_STATION: {
        id: 8,
        message: "Auf dem Weg zur Abholstation.",
        place: {
            id: 0,
            faculty: null,
            floor: null,
            room: null,
            subproject: null
        }
    },

    AVAILABLE_FOR_PICKUP: {
        id: 9,
        message: "Liegt zur Abholung bereit.",
        place: {
            id: 4,
            faculty: "MBUT",
            floor: "Erdgeschoss",
            room: "Foyer",
            subproject: "TP4"
        }
    },
}