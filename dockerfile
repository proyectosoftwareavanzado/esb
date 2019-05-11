FROM node

WORKDIR /opt/esb
add . /opt/esb
RUN npm install --quiet
RUN npm install nodemon -g --quiet


EXPOSE 80

CMD npm start