FROM node:lts
ENV NODE_ENV production
ENV PORT=4000

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV DISABLE_OPENCOLLECTIVE=true

COPY package.json yarn.lock /app/
RUN yarn install && rm /app/package.json /app/yarn.lock

CMD ["yarn", "start"]
