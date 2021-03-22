from opcua import Server
from random import randint, uniform
import datetime
import time

server = Server()

url = "opc.tcp://localhost:8080"
server.set_endpoint(url)

name = "OPCUA_TEMPERATUR_SERVER"
addspace = server.register_namespace(name)

node = server.get_objects_node()

Param = node.add_object(addspace, "Parameter")

Temperatur = 20.00

Temp = Param.add_variable(addspace, "Temperatur", Temperatur)
Time = Param.add_variable(addspace, "Time", 0)

Temp.set_writable()
Time.set_writable()

try:
    server.start()
    print("Server started at {}".format(url))


    while True:
        is_online = True
        valueChange = uniform(0.01, 0.15)
        randDelta = randint(0, 1)

        TIME = datetime.datetime.now()

        if Temperatur > 10 and randDelta == 0:
            Temperatur = Temperatur - valueChange

        elif Temperatur < 30 and randDelta == 1:
            Temperatur = Temperatur + valueChange

    

        Temp.set_value(Temperatur)
        Time.set_value(TIME)

        print("Server still running {}".format(url))
        print("%.2f"%Temp.get_value(), Time.get_value())

        time.sleep(0.3)

except:
    is_online = False
    print("Unexpected error:", sys.exc_info()[0])
    client.disconnect()
    logger.exception ("something went wrong, reconnecting in 5s")
    time.sleep(5)