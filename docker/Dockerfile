# Build and run Open Coding Society Pages entirely inside Docker (server-side).
FROM ruby:3.2-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential git curl ca-certificates \
    python3 python3-pip python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Gemfile Gemfile_Patch.rb ./
RUN bundle config set --local path '/usr/local/bundle' \
    && bundle install

COPY requirements.txt ./
RUN python3 -m venv /app/venv \
    && /app/venv/bin/pip install --no-cache-dir -r requirements.txt

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV PYTHON=/app/venv/bin/python3
ENV PATH="/app/venv/bin:${PATH}"
ENV HOST=0.0.0.0
ENV PORT=4500
ENV MODE=make

EXPOSE 4500

ENTRYPOINT ["/entrypoint.sh"]
