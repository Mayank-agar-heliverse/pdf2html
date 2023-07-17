FROM public.ecr.aws/lambda/nodejs:18.2023.07.13.16
COPY ./package.json ./
RUN npm install
COPY ./ ./
CMD ["index.handler"]