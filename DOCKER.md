# Docker Deployment Guide

South Dakota Elk Draw Analyzer - Production Docker Container

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The app will be available at: **http://localhost:3456**

### Using Docker CLI

```bash
# Build the image
docker build -t elk-analyzer:latest .

# Run the container
docker run -d \
  --name elk-analyzer \
  -p 3456:3456 \
  --restart unless-stopped \
  elk-analyzer:latest

# View logs
docker logs -f elk-analyzer

# Stop the container
docker stop elk-analyzer
docker rm elk-analyzer
```

## Port Configuration

The app runs on **port 3456** by default.

To use a different port with Docker Compose, edit `docker-compose.yml`:

```yaml
ports:
  - "8080:3456"  # Maps port 8080 on host to 3456 in container
```

Or with Docker CLI:

```bash
docker run -p 8080:3456 elk-analyzer:latest
```

Then access at: **http://localhost:8080**

## Environment Variables

Currently, the app doesn't require environment variables. All configuration is:
- Stored in browser localStorage
- Managed through the UI
- No backend API calls

## Health Check

The container includes a health check that verifies the app is running:

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' elk-analyzer
```

## Networking

The Docker Compose setup creates an isolated network (`hunting-network`) for the service.

To expose to other containers or services:
```yaml
networks:
  - hunting-network
```

## Build Performance

The Dockerfile uses a two-stage build to minimize image size:

1. **Builder stage**: Node 20 Alpine, builds the app with pnpm
2. **Runtime stage**: Node 20 Alpine, serves static files

Final image size: ~100-150 MB

## Production Considerations

### HTTPS/TLS

For production, place behind a reverse proxy (nginx, Caddy, Traefik):

```nginx
# Example nginx configuration
upstream elk-analyzer {
  server localhost:3456;
}

server {
  listen 443 ssl http2;
  server_name elk-analyzer.example.com;

  ssl_certificate /etc/ssl/certs/cert.pem;
  ssl_certificate_key /etc/ssl/private/key.pem;

  location / {
    proxy_pass http://elk-analyzer;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### Resource Limits

Set resource limits in `docker-compose.yml`:

```yaml
services:
  elk-analyzer:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 128M
```

### Logging

View all container logs:

```bash
# Recent logs
docker-compose logs elk-analyzer

# Stream logs
docker-compose logs -f elk-analyzer

# Last 100 lines
docker-compose logs --tail 100 elk-analyzer
```

## Troubleshooting

### Port Already in Use

```bash
# Find and stop the process using port 3456
lsof -i :3456
kill -9 <PID>

# Or change the port in docker-compose.yml
```

### Container Won't Start

```bash
# Check build logs
docker-compose build --no-cache

# Check runtime logs
docker-compose logs elk-analyzer

# Rebuild and start fresh
docker-compose down
docker-compose up --build
```

### Performance Issues

```bash
# Monitor container stats
docker stats elk-analyzer

# Check available disk space
docker system df

# Prune unused images
docker system prune -a
```

## Deployment Examples

### Kubernetes

Create a simple deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: elk-analyzer
spec:
  replicas: 2
  selector:
    matchLabels:
      app: elk-analyzer
  template:
    metadata:
      labels:
        app: elk-analyzer
    spec:
      containers:
      - name: elk-analyzer
        image: elk-analyzer:latest
        ports:
        - containerPort: 3456
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
```

### Docker Swarm

```bash
# Deploy service
docker service create \
  --name elk-analyzer \
  --publish 3456:3456 \
  --replicas 3 \
  elk-analyzer:latest
```

## Data Persistence

**Note**: This is a stateless application. All user data is stored in browser localStorage.

- No database required
- No persistent volumes needed
- Multiple containers can run independently
- Users' data is browser-specific (not shared across containers)

To back up user data, users export JSON from the UI.

## Security Notes

- ✅ No external API calls
- ✅ No sensitive data transmission
- ✅ All data stored locally (browser)
- ✅ No authentication required
- ✅ No database credentials
- ✅ Static site (no execution of untrusted code)

For sensitive deployments, add:
- TLS/HTTPS (reverse proxy)
- WAF (Web Application Firewall)
- Rate limiting
- Access controls

## Updating

To update to a new version:

```bash
# Pull latest code
git pull origin main

# Rebuild image
docker-compose build --no-cache

# Restart service
docker-compose up -d
```

## Support

For issues or questions:
- Check Docker logs: `docker-compose logs`
- Review this guide
- Check browser console for errors (F12)
- Verify port 3456 is accessible
