ARG FUNCTION_DIR="/function"

FROM node:14-alpine3.12

ARG FUNCTION_DIR
RUN mkdir -p ${FUNCTION_DIR}

WORKDIR ${FUNCTION_DIR}


RUN apk add --no-cache curl

COPY prince-12.5.1-alpine3.10-x86_64.tar.gz /tmp/prince.tar.gz
# RUN curl https://www.princexml.com/download/prince-12.5.1-alpine3.10-x86_64.tar.gz -o /tmp/prince.tar.gz
RUN tar -zxvf /tmp/prince.tar.gz
RUN rm /tmp/prince.tar.gz

RUN apk add --no-cache \
  libxml2 \
  pixman \
  tiff \
  giflib \
  libpng \
  lcms2 \
  libjpeg-turbo \
  fontconfig \
  freetype \
  libgomp

# Install fonts
RUN apk --no-cache add msttcorefonts-installer fontconfig && \
    update-ms-fonts && \
    fc-cache -f

# Comando do prince para fazer a conversao do html para pdf
# ENTRYPOINT [ "/tmp/prince-12.5.1-alpine3.10-x86_64/lib/prince/bin/prince" ]

COPY ./app/app.js ${FUNCTION_DIR}
COPY ./app/package.json ${FUNCTION_DIR}

# RUN ls ${FUNCTION_DIR}

# ENV LANG=en_US.UTF-8
# ENV TZ=:/etc/localtime
# ENV PATH=/var/lang/bin:/usr/local/bin:/usr/bin/:/bin:/opt/bin
# ENV LD_LIBRARY_PATH=/var/lang/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib:/opt/lib
# ENV LAMBDA_TASK_ROOT=/var/task
# ENV LAMBDA_RUNTIME_DIR=/var/runtime


# Install NPM dependencies for function
RUN npm install

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
# CMD [ "ls" ]
CMD [ "app.handler" ] 




