# FROM node:14
# RUN cat /etc/os-release
# COPY . .
# RUN dpkg -i libpng12-0_1.2.50-2+deb8u3_i386.deb
# RUN dpkg -i prince_12.5-1_debian8.10_amd64.deb

# ENTRYPOINT ["node", "-v"]

# ENTRYPOINT ["prince", "--version"]

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install
# COPY . .

# EXPOSE 8080
# CMD [ "node", "server.js" ]




FROM node:14-alpine3.12
RUN mkdir /prince

WORKDIR /prince

COPY . /tmp

RUN apk add --no-cache curl


RUN curl https://www.princexml.com/download/prince-12.5.1-alpine3.10-x86_64.tar.gz -o prince.tar.gz
RUN tar -zxvf prince.tar.gz
RUN rm prince.tar.gz

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




ENTRYPOINT [ "./prince-12.5.1-alpine3.10-x86_64/lib/prince/bin/prince" ]
