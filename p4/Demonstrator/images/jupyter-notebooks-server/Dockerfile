FROM balenalib/raspberrypi4-64-python:3.7.6-buster

RUN install_packages tini libblas-dev liblapack-dev libatlas-base-dev gfortran pkg-config python3-pandas python3-numpy python3-pymongo python3-ipykernel jupyter jupyter-notebook

RUN pip install --no-cache-dir jupyter_kernel_gateway

COPY . /home/isac/

# Configure container startup, letting the user pass command line args through
# easily without disrupting the use of tini or the kernelgateway entry point by adding
# those commands with CMD for example by docker-compose.yml
ENTRYPOINT ["tini", "--"]
