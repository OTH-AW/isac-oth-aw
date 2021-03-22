FROM balenalib/raspberrypi4-64-python:3.7.6-buster

RUN install_packages python3-opcua

WORKDIR /home

COPY . .

CMD [ "python", "OPCUAServer.py" ]