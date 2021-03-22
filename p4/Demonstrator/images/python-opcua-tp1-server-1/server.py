
#!/usr/bin/env python3

import sys
sys.path.insert(0, "..")
import time
from datetime import datetime
import os

import octorest_test

from opcua import ua, Server

if __name__ == "__main__":

    #setup
    server = Server()
    # url = "opc.tcp://" + os.environ['APP_HOST'] + ":" + os.environ['APP_PORT'] + "/opcua/server/"

    #setup namespace
    uri = "http://www.oth-aw.de"
    idx = server.register_namespace(uri)

    #get opbjects node
    objects = server.get_objects_node()


    #Node Octoprint RF2000
    RF2000 = objects.add_object(idx, "Octoprint")

    #database-id
    #add_variable(nodeid, browsename, value, varianttype=None, datatype=None)
    mongo_objectid = RF2000.add_variable(idx, "mongo_objectid", "054213a5436a4562")
    mongo_objectid.set_writable()
    #workpiece_id
    workpiece_id = RF2000.add_variable(idx, "workpiece_id", "keine Bestellung aufgegeben")


    #Node color
    color = RF2000.add_object(idx, "color")
    color_actual_value = color.add_variable(idx, "color_actual_value", "")
    color_actual_value.set_writable()
    color_to_value = color.add_variable(idx, "color_to_value", "")
    color_to_value.set_writable()


    #Node shape
    shape = RF2000.add_object(idx, "shape")
    shape_actual_value = shape.add_variable(idx, "shape_actual_value", "")
    shape_actual_value.set_writable()
    shape_to_value = shape.add_variable(idx, "shape_to_value", "")
    shape_to_value.set_writable()
    

    #Node Basisinformation
    #Druckername
    base_information = RF2000.add_object(idx, "base_information")
    printer = base_information.add_variable(idx, "printer", "Renkforce RF2000")

    base_information.add_variable(idx, "FIX_NODE_ID_1", "XYZ")
    base_information.add_variable(idx, "FIX_NODE_ID_2", "XYZ")

    #color_equipped
    color_equipped = base_information.add_variable(idx, "color_equipped", "Orange")
    #Druckerstatus
    state_online = base_information.add_variable(idx, "state_online", octorest_test.get_state())
    state_online.set_writable()
    state_message_printer = base_information.add_variable(idx, "state_message_printer", octorest_test.get_state_message())
    test_feedback_message = base_information.add_variable(idx, "test_feedback_message", "wartend")
    #state_message_printer.set_writable()
    #Dateiname
    file_name = base_information.add_variable(idx, "filename", "keine Datei")
    #Beginne Druck
    start_printing = base_information.add_variable(idx, "start_printing", False)
    start_printing.set_writable()
    

    #Node state
    #state
    state = RF2000.add_object(idx, "state")
    #state_message
    state_message_printing = state.add_variable(idx, "printing", False)
    #state_message = state.add_variable(idx, "Status-Meldung", "kein Druckauftrag aufgegeben")
    state_message_printing.set_writable()
    #time_estimate
    time_estimate = state.add_variable(idx, "time_estimate", 0)
    #time_current
    time_current = state.add_variable(idx, "time_current", 0)
    #time_left
    time_left = state.add_variable(idx, "time_left", 0)
    #completion
    completion = state.add_variable(idx, "completion", 0)
    completion.set_writable()
    #print_completion_time
    print_completion_time = state.add_variable(idx, "print_completion_time", "2020-01-01T00:00:00")
    #print_starting_time
    print_starting_time = state.add_variable(idx, "print_starting_time", "2020-01-01T00:00:00")


    #Node order
    #order
    order = RF2000.add_object(idx, "order")
    #order_id
    #order_id = order.add_variable(idx, "Bestell-ID", "keine Bestellung aufgegeben")
    #order_id.set_writable()
    #order_number
    order_number = order.add_variable(idx, "order_number", "keine Bestellung aufgegeben")
    order_number.set_writable()

    #Node Customer
    customer = order.add_object(idx, "customer")
    #customer_firstname
    order_customer_firstname = customer.add_variable(idx, "firstname", "keine Bestellung aufgegeben")
    order_customer_firstname.set_writable()
    #customer_name
    order_customer_name = customer.add_variable(idx, "name", "keine Bestellung aufgegeben")
    order_customer_name.set_writable()
    #customer_zip
    order_customer_zip = customer.add_variable(idx, "zip", "keine Bestellung aufgegeben")
    order_customer_zip.set_writable()
    #customer_email
    order_customer_email = customer.add_variable(idx, "mail", "keine Bestellung aufgegeben")
    order_customer_email.set_writable()
    #number (quantity)
    #order_quantity = order.add_variable(idx, "Anzahl", "keine Bestellung aufgegeben")
    #order_quantity.set_writable()
    #order_shape
    order_shape = order.add_variable(idx, "order_shape", "keine Bestellung aufgegeben")
    order_shape.set_writable()
    #order_color
    order_color = order.add_variable(idx, "order_color", "keine Bestellung aufgegeben")
    order_color.set_writable()

    #starting
    server.start()

    
    try:
        while True:
            time.sleep(1)
            state_online.set_value(octorest_test.get_state()) # Nur durch die Simulation dazugekommen

            # 0-100% 
            completion.set_value(ua.DataValue(ua.Variant(octorest_test.get_jobinfo_completion(), ua.VariantType.Byte)))
            # Geschätzte Gesamtdauer
            time_estimate.set_value(ua.DataValue(ua.Variant(octorest_test.get_jobinfo_estimated_time(), ua.VariantType.Byte)))
            # Vergangene Druckdauer
            time_current.set_value(ua.DataValue(ua.Variant(octorest_test.get_jobinfo_print_time_current(), ua.VariantType.Byte)))

            if shape_to_value.get_value() == "Dreieck":
                file_name.set_value("Dreieck.gcode")
            elif shape_to_value.get_value() == "Kreis":
                file_name.set_value("Kreis.gcode")
            elif shape_to_value.get_value() == "Viereck":
                file_name.set_value("Rechteck.gcode")
            else:
                file_name.set_value("falscher Dateiname")


            if state_online.get_value() == True and start_printing.get_value() == True:
                if file_name.get_value() == "falscher Dateiname":
                    start_printing.set_value(False)
                    test_feedback_message.set_value("falscher Dateiname, wartend")
                    #break
                else:
                    state_message_printing.set_value(True)
                    test_feedback_message.set_value("druckt gerade")
                    print_starting_time.set_value(datetime.now())
                    print_completion_time.set_value("2020-01-01T00:00:00")
                    start_printing.set_value(False)
                    octorest_test.set_is_printing(state_message_printing.get_value())

            if state_online.get_value()== False and state_message_printing.get_value()==True :
                print_completion_time.set_value(datetime.now())
                print_starting_time.set_value("2020-01-01T00:00:00")
                state_message_printing.set_value(False)
                test_feedback_message.set_value("wartend")
                color_to_value.set_value("")
                shape_to_value.set_value("")
                octorest_test.set_is_printing(state_message_printing.get_value())
            
            """if greetings.get_value() == "Hallo RF2000":
                greetings.set_value("Hallo RF1000")"""

    finally:
        #close connection
        server.stop()
