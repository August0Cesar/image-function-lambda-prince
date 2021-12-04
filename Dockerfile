ARG FUNCTION_DIR="/function"

FROM node:14-alpine3.12

ARG FUNCTION_DIR
RUN mkdir -p ${FUNCTION_DIR}

WORKDIR ${FUNCTION_DIR}


RUN apk add --no-cache curl

COPY prince-12.5.1-alpine3.10-x86_64.tar.gz /tmp/prince.tar.gz
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
  libgomp \
  g++ \
  make \
  cmake \
  unzip \
  libressl-dev \
  autoconf \
  automake \
  libtool \
  libcurl \
  libexecinfo-dev \
  python3

# Install fonts da myicrosoft
RUN apk --no-cache add msttcorefonts-installer fontconfig && \
    update-ms-fonts && \
    fc-cache -f



# Comando do prince para fazer a conversao do html para pdf
# ENTRYPOINT [ "/tmp/prince-12.5.1-alpine3.10-x86_64/lib/prince/bin/prince" ]


COPY ./app/app.js ${FUNCTION_DIR}
COPY ./app/package.json ${FUNCTION_DIR}

RUN npm install bluebird

# Install lib amazon para events para lambda
RUN npm install aws-lambda-ric

RUN npm install

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
CMD [ "app.handler" ] 




