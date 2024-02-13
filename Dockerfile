FROM python:3.12.2-bookworm

WORKDIR /app

COPY . .
COPY requirements.txt requirements.txt

RUN python3 -m pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD [ "python3", "django-gunicorn-nginx/manage.py", "runserver", "0.0.0.0:8080" ]