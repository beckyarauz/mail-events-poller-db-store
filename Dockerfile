FROM public.ecr.aws/lambda/nodejs:12

# Copy function code and package.json
COPY app.ts package.json /var/task/

# Install NPM dependencies for function
RUN npm install
RUN npm run compile

# Set the CMD to your handler
CMD [ "app.handler" ]
