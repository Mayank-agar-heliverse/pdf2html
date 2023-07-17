# FROM public.ecr.aws/ubuntu/ubuntu:edge AS base
# RUN apt update

# FROM public.ecr.aws/lambda/nodejs:18.2023.07.13.16
# FROM sitespeedio/node:ubuntu-20.04-nodejs-12.14.1
FROM ubuntu
RUN apt update
RUN apt install curl -y
RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
RUN source ~/.bashrc
RUN nvm install node
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY ./ ./
CMD ["index.handler"]