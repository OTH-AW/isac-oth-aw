FROM balenalib/raspberrypi4-64-node:13.11-buster

RUN mkdir -p /home/app

WORKDIR /home/app

COPY package.json .

RUN npm update
RUN npm install

COPY . .

CMD ["npm", "start"]
