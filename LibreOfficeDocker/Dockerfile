FROM node:18.8-alpine

ARG APP_ROOT=/opt/app-root/src
ENV NO_UPDATE_NOTIFIER=true \
  PATH="/usr/lib/libreoffice/program:${PATH}" \
  PYTHONUNBUFFERED=1
WORKDIR ${APP_ROOT}

# Install LibreOffice & Common Fonts
RUN apk --no-cache add bash libreoffice util-linux \
  ttf-droid-nonlatin ttf-droid ttf-dejavu ttf-freefont ttf-liberation && \
  rm -rf /var/cache/apk/*

RUN apk --no-cache add font-arabic-misc font-noto-arabic

# Install Microsoft Core Fonts
RUN apk --no-cache add msttcorefonts-installer fontconfig && \
  update-ms-fonts && \
  fc-cache -f && \
  rm -rf /var/cache/apk/*

# Fix Python/LibreOffice Integration
COPY support ${APP_ROOT}/support
RUN chmod a+rx ${APP_ROOT}/support/bindPython.sh \
  && ${APP_ROOT}/support/bindPython.sh