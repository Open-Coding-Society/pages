FROM ruby:3.1-bookworm

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    build-essential git curl ca-certificates python3 python3-venv python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /site

COPY deploy/ec2-staging/scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV PORT=4500
ENV STAGING_SKIP_NOTEBOOK_CONVERT=1

EXPOSE 4500

ENTRYPOINT ["/entrypoint.sh"]
