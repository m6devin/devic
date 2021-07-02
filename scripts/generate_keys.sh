#! /bin/bash

rm ./oauth-keys/oauth-private.key
rm ./oauth-keys/public.key

openssl genrsa -out ./oauth-keys/oauth-private.key 4096
openssl rsa -in ./oauth-keys/oauth-private.key -pubout -out ./oauth-keys/oauth-public.key