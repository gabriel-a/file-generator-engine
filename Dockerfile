FROM gabriel82/my-node-libre:v2

RUN mkdir /tmp/tmp-reports/
COPY . /carbone-api
WORKDIR /carbone-api

RUN yarn install
RUN yarn build

EXPOSE 3030
CMD [ "node", "dist/main.js" ]