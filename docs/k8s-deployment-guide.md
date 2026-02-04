# Kubernetes Deployment Guide for Todo Chatbot Application

## Overview
This document describes the deployment of the Todo Chatbot application to a local Kubernetes cluster using Helm charts.

## Architecture
The application consists of three main components:
- **Frontend**: React-based UI application (port 3000)
- **Backend**: Python/FastAPI server (port 7860)
- **Database**: PostgreSQL database (port 5432)

## Prerequisites
- Docker Desktop with Kubernetes enabled (or Minikube)
- Helm 3+
- kubectl

## Deployment Steps

### 1. Build Docker Images
```bash
# Build frontend image
cd frontend
docker build -t todo-frontend:latest .

# Build backend image
cd ../backend
docker build -t todo-backend:latest .
```

### 2. Deploy Using Helm
```bash
# Install the application
helm install todo-chatbot-release helm-chart/todo-app/

# Verify deployment
kubectl get pods
kubectl get services
```

### 3. Access the Application
The application services are exposed as ClusterIP services. To access them locally:

```bash
# Forward frontend port
kubectl port-forward service/todo-chatbot-release-todo-app-frontend 3000:3000

# Forward backend port (if needed for direct access)
kubectl port-forward service/todo-chatbot-release-todo-app-backend 7860:7860
```

Then access the application at `http://localhost:3000`

## Helm Chart Configuration

### Values Configuration
The Helm chart supports the following configurable parameters:

- `frontend.image.repository`: Frontend image repository
- `frontend.image.tag`: Frontend image tag
- `backend.image.repository`: Backend image repository
- `backend.image.tag`: Backend image tag
- `database.image.repository`: Database image repository
- `database.image.tag`: Database image tag
- `database.persistence.size`: Database storage size

### Environment Variables
The chart automatically configures the correct service endpoints for inter-service communication.

## Service Endpoints
- Frontend: `http://<release-name>-todo-app-frontend:3000`
- Backend: `http://<release-name>-todo-app-backend:7860`
- Database: `http://<release-name>-todo-app-db:5432`

## Troubleshooting

### Common Issues
1. **Pods stuck in ContainerCreating state**: Check if the Docker images are available
2. **Database connection errors**: Verify service names and network connectivity
3. **Health check failures**: Check application logs for detailed error messages

### Useful Commands
```bash
# Check pod status
kubectl get pods

# View pod logs
kubectl logs <pod-name>

# Check services
kubectl get services

# Check Helm releases
helm list

# Upgrade release
helm upgrade <release-name> <chart-path>

# Uninstall release
helm uninstall <release-name>
```

## Scaling
The application can be scaled using standard Kubernetes commands:
```bash
# Scale frontend
kubectl scale deployment todo-chatbot-release-todo-app-frontend --replicas=3

# Scale backend
kubectl scale deployment todo-chatbot-release-todo-app-backend --replicas=2
```

## Cleanup
To remove the deployment:
```bash
helm uninstall todo-chatbot-release
```