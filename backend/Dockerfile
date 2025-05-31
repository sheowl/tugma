# image
FROM python:3.12-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container.
WORKDIR /app

# Copy only the requirements file first to leverage Docker cache.
COPY requirements.txt ./

# Upgrade pip and install project dependencies.
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the application code.
COPY . .

# Change to the directory where manage.py is located
WORKDIR /app/tugma_backend

# Expose port 8000 (default for Django development server)
EXPOSE 8000

# Command to run the Django development server on all interfaces.
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
