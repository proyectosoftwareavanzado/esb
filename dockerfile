FROM node

WORKDIR /opt/esb
add . /opt/esb
RUN npm install --quiet
RUN npm install nodemon -g --quiet


EXPOSE 8081

CMD npm start