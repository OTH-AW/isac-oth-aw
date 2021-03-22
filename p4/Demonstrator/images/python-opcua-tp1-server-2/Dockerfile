FROM balenalib/raspberrypi4-64-python:3.7.6-buster

RUN install_packages python3-opcua

RUN pip install octorest

WORKDIR /home

COPY . .

CMD [ "python", "./server.py" ]