# Dev/build image for Open Coding Society Pages (Jekyll + Python converters)
FROM ruby:3.2-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential git curl \
    python3 python3-pip python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Gemfile Gemfile_Patch.rb ./
RUN bundle config set --local path '/usr/local/bundle' \
    && bundle install

COPY requirements.txt ./
RUN python3 -m venv /app/venv \
    && /app/venv/bin/pip install --no-cache-dir -r requirements.txt

COPY docker/entrypoint-dev.sh /entrypoint-dev.sh
RUN chmod +x /entrypoint-dev.sh

ENV PYTHON=/app/venv/bin/python3
ENV PATH="/app/venv/bin:${PATH}"
ENV HOST=0.0.0.0
ENV PORT=4500

EXPOSE 4500

ENTRYPOINT ["/entrypoint-dev.sh"]
