worker_processes 4;

events { worker_connections 1024; }

http {

    include    mime.types;

    access_log  /var/log/nginx/access.log;
    error_log  /var/log/nginx/error.log;

    map $http_origin $cors_origin {
        default "*";
    }

    map $http_origin $cors_credentials {
        default "false";
    }

    limit_req_zone $binary_remote_addr zone=api:10m rate=5r/s;
    limit_conn_zone $binary_remote_addr zone=api_conn:10m;

    client_max_body_size 70M;

    server {
        listen 80;
        server_name ${APP_URL}

        add_header Strict-Transport-Security "max-age=15768000; includeSubDomains" always;
        reset_timedout_connection on;

        gzip on;
        gzip_min_length 10240;
        gzip_proxied expired no-cache no-store private auth;
        gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml;
        gzip_disable "msie6";

        root  /usr/admin/nginx/html;

	location ~ \.css {
                add_header  Content-Type    text/css;
        }

        location ~ \.js {
            add_header  Content-Type    application/x-javascript;
        }

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
