#!/usr/bin/env sh
set -e

echo "*** $(date +"%F %T (%Z)") [Entrypoint] start create config"; 
j2 /etc/nginx/conf.d/nginx.conf.j2 | tee /etc/nginx/conf.d/app.conf
ec=$?;
if [ "$ec" -ne 0 ]; then
    echo "*** $(date +"%F %T (%Z)") [Entrypoint] Config create failed (exit code != 0)"; 
    exit 1;
fi

echo "*** $(date +"%F %T (%Z)") [Entrypoint] starting $*"; 
exec "$@"
