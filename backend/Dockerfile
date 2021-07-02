FROM ubuntu:20.04
ENV TZ=Asia/Tehran
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /var/www

RUN apt-get update
RUN apt-get -y upgrade

RUN apt-get install -y php7.4
RUN apt-get update
RUN apt-get install -y php-pgsql php7.4-mysql php-xml php7.4-gd php7.4-fpm php-mbstring php-zip php-curl php-redis

RUN apt-get install -y \
    build-essential \
    git \
    curl \
    git \
    zip \
    unzip \
    vim \
    supervisor

COPY docker-configs/php-fpm-www-pool.conf /etc/php/7.4/fpm/pool.d/www.conf
COPY docker-configs/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN apt-get install -y nginx
# Configure nginx
RUN rm /etc/nginx/sites-enabled/default
COPY docker-configs/nginx-default-site.conf /etc/nginx/sites-enabled/default.conf

RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
