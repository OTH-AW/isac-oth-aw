import sys
import time
from datetime import datetime
from opcua import Server, ua
import os

# Server starten
server = Server()
url = "opc.tcp://" + os.environ['APP_HOST'] + ":" + os.environ['APP_PORT'] + "/opcua/server/"
server.set_endpoint(url)

uri = "http://www.oth-aw.de"
idx = server.register_namespace(uri)
objects = server.get_objects_node()

storage_n = objects.add_object(idx, "storage")
storage_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Lager")))

st_ready_n = storage_n.add_variable(idx, "storage_ready", True)
st_ready_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Lager bereit")))
store_n = storage_n.add_object(idx, "store")
store_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Einlagern")))
outsource_n = storage_n.add_object(idx, "outsource")
outsource_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Auslagern")))
stock_n = storage_n.add_object(idx, "stock")
stock_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Lagerbestand")))

#Einlagern
wp_s_n = store_n.add_object(idx, "workpiece")
wp_s_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Werkstück")))
dbid_s_n = wp_s_n.add_variable(idx, "mongo_objectid", "")
dbid_s_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Datenbank-ID")))
shape_s_n = wp_s_n.add_variable(idx, "shape_to_value", "")
shape_s_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Geometrie Soll-Wert")))
color_s_n = wp_s_n.add_variable(idx, "color_to_value", "")
color_s_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Farbe Soll-Wert")))
shape_number_n = wp_s_n.add_variable(idx, "shape_to_value_number", 0)
shape_s_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Geometrie Soll-Wert Nummer")))
color_number_n = wp_s_n.add_variable(idx, "color_to_value_number", 0)
color_s_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Farbe Soll-Wert Nummer")))
pos_s_n = wp_s_n.add_variable(idx, "stock_position", 0)
pos_s_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Lagerposition")))

start_s_n = store_n.add_variable(idx, "start_store", False)
start_s_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Einlagern starten")))
ready_s_n = store_n.add_variable(idx, "complete", True)
ready_s_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Einlagern fertig")))
start_time_s_n = store_n.add_variable(idx, "starting_time", datetime(1, 1, 1))
start_time_s_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Einlagerungszeit-Beginn")))
complete_time_s_n = store_n.add_variable(idx, "completion_time", datetime(1, 1, 1))
complete_time_s_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Einlagerungszeit-Ende")))

#Auslagern
wp_o_n = outsource_n.add_object(idx, "workpiece")
wp_o_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Werkstück")))
dbid_o_n = wp_o_n.add_variable(idx, "mongo_objectid", "")
dbid_o_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Datenbank-ID")))
shape_o_n = wp_o_n.add_variable(idx, "shape_to_value", "")
shape_o_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Geometrie Soll-Wert")))
color_o_n = wp_o_n.add_variable(idx, "color_to_value", "")
color_o_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Farbe Soll-Wert")))
pos_o_n = wp_o_n.add_variable(idx, "stock_position", 0)
pos_o_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Lagerposition")))

start_o_n = outsource_n.add_variable(idx, "start_outsource", False)
start_o_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Auslagern starten")))
ready_o_n = outsource_n.add_variable(idx, "complete", True)
ready_o_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Auslagern fertig")))
start_time_o_n = outsource_n.add_variable(idx, "starting_time", datetime(1, 1, 1))
start_time_o_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Auslagerungszeit-Beginn")))
complete_time_o_n = outsource_n.add_variable(idx, "completion_time", datetime(1, 1, 1))
complete_time_o_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Auslagerungszeit-Ende")))

#Lager
circles_n = stock_n.add_object(idx, "circles")
circles_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Kreise")))
squaes_n = stock_n.add_object(idx, "squares")
squaes_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Quadrate")))
triangles_n = stock_n.add_object(idx, "triangles")
triangles_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Dreiecke")))

orange_c_n = circles_n.add_variable(idx, "orange", 1)
orange_c_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Orange")))
blue_c_n = circles_n.add_variable(idx, "blue", 1)
blue_c_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Blau")))
orange_s_n = squaes_n.add_variable(idx, "orange", 1)
orange_s_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Orange")))
blue_s_n = squaes_n.add_variable(idx, "blue", 1)
blue_s_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Blau")))
orange_t_n = triangles_n.add_variable(idx, "orange", 0)
orange_t_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Orange")))
blue_t_n = triangles_n.add_variable(idx, "blue", 1)
blue_t_n.set_attribute(ua.AttributeIds.DisplayName, ua.DataValue(ua.LocalizedText("Blau")))

#Schreiberlaubnis erteilen
dbid_s_n.set_writable()
shape_s_n.set_writable()
color_s_n.set_writable()
start_s_n.set_writable()
ready_s_n.set_writable()

shape_o_n.set_writable()
color_o_n.set_writable()
start_o_n.set_writable()
ready_o_n.set_writable()

st_ready_n.set_writable()

server.start()


#Schleife
try:
    # Lager
    lagerIDs = ["0_k_o", "1_d_b", "", "2_q_o", "3_k_b", "", "4_q_b", "", "", "", "", "", "", "", "", "", "", ""]
    lagerFormen = ["Kreis", "Dreieck", "", "Quadrat", "Kreis", "", "Quadrat", "", "", "", "", "", "", "", "", "", "", ""]
    lagerFarben = ["Orange", "Blau", "", "Orange", "Blau", "", "Blau", "", "", "", "", "", "", "", "", "", "", ""]

    #Anfangswerte
    startEinlagern_alt = False
    einlagernFertig_alt = False
    startAuslagern_alt = False
    auslagernFertig_alt = False
    pos_s_n.set_value(100)
    pos_o_n.set_value(100)
    i = 0

    #Funktion einlagern
    def LagerErhoehen(form, farbe):
        if form == "Kreis" and farbe == "Orange":
            orange_c_n.set_value(orange_c_n.get_value() + 1)
        if form == "Kreis" and farbe == "Blau":
            blue_c_n.set_value(blue_c_n.get_value() + 1)
        if form == "Quadrat" and farbe == "Orange":
            orange_s_n.set_value(orange_s_n.get_value() + 1)
        if form == "Quadrat" and farbe == "Blau":
            blue_s_n.set_value(blue_s_n.get_value() + 1)
        if form == "Dreieck" and farbe == "Orange":
            orange_t_n.set_value(orange_t_n.get_value() + 1)
        if form == "Dreieck" and farbe == "Blau":
            blue_t_n.set_value(blue_t_n.get_value() + 1)

    #Funktion auslagern
    def LagerVerringern(form, farbe):
        if form == "Kreis" and farbe == "Orange":
            orange_c_n.set_value(orange_c_n.get_value() - 1)
        if form == "Kreis" and farbe == "Blau":
            blue_c_n.set_value(blue_c_n.get_value() - 1)
        if form == "Quadrat" and farbe == "Orange":
            orange_s_n.set_value(orange_s_n.get_value() - 1)
        if form == "Quadrat" and farbe == "Blau":
            blue_s_n.set_value(blue_s_n.get_value() - 1)
        if form == "Dreieck" and farbe == "Orange":
            orange_t_n.set_value(orange_t_n.get_value() - 1)
        if form == "Dreieck" and farbe == "Blau":
            blue_t_n.set_value(blue_t_n.get_value() - 1)

    while True:
        #Farbe und Form in Nummer
        if shape_s_n.get_value() == "Kreis":
            shape_number_n.set_value(0)
        if shape_s_n.get_value() == "Quadrat":
            shape_number_n.set_value(1)
        if shape_s_n.get_value() == "Dreieck":
            shape_number_n.set_value(2)

        if color_s_n.get_value() == "Orange":
            color_number_n.set_value(0)
        if color_s_n.get_value() == "Blau":
            color_number_n.set_value(1)

        #Einlagern starten
        startEinlagern = start_s_n.get_value()
        if startEinlagern and not startEinlagern_alt:
            startEinlagern_alt = startEinlagern
            # st_ready_n.set_value(False)
            for i in range(18):
                if lagerIDs[i] == "":
                    lagerIDs[i] = dbid_s_n.get_value()
                    lagerFormen[i] = shape_s_n.get_value()
                    lagerFarben[i] = color_s_n.get_value()
                    pos_s_n.set_value(i)
                    break
            start_time_s_n.set_value(datetime.utcnow())

        #Einlagern fertig
        einlagernFertig = ready_s_n.get_value()
        if einlagernFertig and not einlagernFertig_alt and startEinlagern:
            einlagernFertig_alt = einlagernFertig
            LagerErhoehen(lagerFormen[i], lagerFarben[i])
            complete_time_s_n.set_value(datetime.utcnow())
            pos_s_n.set_value(100)

        #Handshake Ende: Zurücksetzen
        if not startEinlagern and startEinlagern_alt:
            startEinlagern_alt = startEinlagern
            einlagernFertig_alt = 0
            start_time_s_n.set_value(datetime(1, 1, 1))
            complete_time_s_n.set_value(datetime(1, 1, 1))
            st_ready_n.set_value(True)

        #Auslagern starten
        startAuslagern = start_o_n.get_value()
        if startAuslagern and not startAuslagern_alt:
            startAuslagern_alt = startAuslagern
            # st_ready_n.set_value(False)
            for i in range(18):
                if lagerFormen[i] == shape_o_n.get_value() and lagerFarben[i] == color_o_n.get_value():
                    LagerVerringern(lagerFormen[i], lagerFarben[i])
                    dbid_o_n.set_value(lagerIDs[i])
                    lagerIDs[i] = ""
                    lagerFormen[i] = ""
                    lagerFarben[i] = ""
                    pos_o_n.set_value(i)
                    break

            start_time_o_n.set_value(datetime.utcnow())

        #Auslagern fertig
        auslagernFertig = ready_o_n.get_value()
        if auslagernFertig and not auslagernFertig_alt and startAuslagern:
            auslagernFertig_alt = auslagernFertig
            complete_time_o_n.set_value(datetime.utcnow())
            pos_o_n.set_value(100)

        #Handshake Ende: Zurücksetzen
        if not startAuslagern and startAuslagern_alt:
            startAuslagern_alt = startAuslagern
            auslagernFertig_alt = 0
            dbid_o_n.set_value("")
            start_time_o_n.set_value(datetime(1, 1, 1))
            complete_time_o_n.set_value(datetime(1, 1, 1))
            st_ready_n.set_value(True)

        #time.sleep(1)

finally:
    server.stop()

