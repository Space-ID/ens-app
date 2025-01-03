# Use an official Nginx image as a parent image
FROM debian:bullseye-slim
#WORKDIR /app

RUN apt-get update && apt-get install -y wget curl git build-essential autoconf libtool libpcre3 libpcre3-dev libssl-dev zlib1g-dev gettext-base

# Install C library for reading MaxMind DB files
RUN apt-get install -y libmaxminddb0 libmaxminddb-dev mmdb-bin

# Install nginx
ENV nginx_version 1.21.1
RUN curl http://nginx.org/download/nginx-$nginx_version.tar.gz | tar xz
RUN git clone https://github.com/leev/ngx_http_geoip2_module.git
WORKDIR /nginx-$nginx_version

ARG LICENSE_KEY

# Download and set up the GeoIP database
RUN mkdir -p /etc/geoip
RUN wget -O city.tar.gz "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${LICENSE_KEY}&suffix=tar.gz"
RUN tar -xvzf city.tar.gz
RUN mv GeoLite2-City_*/GeoLite2-City.mmdb /etc/geoip/
RUN rm -rf GeoLite2-City*
RUN wget -O country.tar.gz "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${LICENSE_KEY}&suffix=tar.gz"
RUN tar -xvzf country.tar.gz
RUN mv GeoLite2-Country_*/GeoLite2-Country.mmdb /etc/geoip/
RUN rm -rf GeoLite2-Country*

# Compile nginx
RUN ./configure \
    --prefix=/etc/nginx \
    --sbin-path=/usr/sbin/nginx \
    --conf-path=/etc/nginx/nginx.conf \
    --error-log-path=/var/log/nginx/error.log \
    --http-log-path=/var/log/nginx/access.log \
    --pid-path=/var/run/nginx.pid \
    --lock-path=/var/run/nginx.lock \
    --http-client-body-temp-path=/var/cache/nginx/client_temp \
    --http-proxy-temp-path=/var/cache/nginx/proxy_temp \
    --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp \
    --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp \
    --http-scgi-temp-path=/var/cache/nginx/scgi_temp \
    --user=nginx \
    --group=nginx \
    --with-http_ssl_module \
    --with-http_realip_module \
    --with-http_secure_link_module \
    --with-threads \
    --with-http_v2_module \
    --with-http_gzip_static_module \
    --with-cc-opt='-g -O2 -fstack-protector-strong -Wformat -Werror=format-security -Wp,-D_FORTIFY_SOURCE=2' \
    --with-ld-opt='-Wl,-z,relro -Wl,--as-needed' \
    --add-dynamic-module=../ngx_http_geoip2_module
RUN make
RUN make install

RUN adduser --system --no-create-home --shell /bin/false --group nginx
RUN mkdir -p /var/cache/nginx/client_temp
RUN mkdir -p /var/cache/nginx/proxy_temp
RUN mkdir -p /var/cache/nginx/fastcgi_temp
RUN mkdir -p /var/cache/nginx/uwsgi_temp
RUN mkdir -p /var/cache/nginx/scgi_temp
RUN mkdir /app

COPY ./nginx.conf /etc/nginx/
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./build /app/

# Expose ports
EXPOSE 8080
ENV PORT 8080

# Start Nginx when the container launches
CMD nginx -g 'daemon off;'
