FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY srfsc ./srfsc
COPY main.py .
ENV SRFSC_DATABASE_URI=sqlite:////app/instance/srfsc.db
EXPOSE 8599
CMD ["gunicorn", "--bind", "0.0.0.0:8599", "--workers", "2", "main:app"]
