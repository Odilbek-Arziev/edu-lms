#!/bin/sh

set -e

python manage.py collectstatic --noinput

until python manage.py migrate 2>&1; do
  echo "DB not ready, retrying..."
  sleep 2
done

exec "$@"