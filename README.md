# Tainan-all-in-one-koa

node 6.9.2, koa 2.0.0, postgresql 9.5.x, postgis 2.2.x

## Setup

### Install Package

```
$: npm install
```

### Postgresql

```
$: createdb tainan_aio_db
$: psql tainan_aio_db
tainan_aio_db=# create extension postgis;
CREATE EXTENSION
```

## Start

### Setup environment variable

* DATABASE_URL
* VERIFY_TOKEN
* FB_TOKEN
* GOOGLE\_PLACE\_KEY

### Start Server

```
$: npm start
```