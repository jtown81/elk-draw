# Docker Image Registry Setup

## GitHub Container Registry (ghcr.io)

The Docker image has been tagged for GitHub Container Registry:

```
ghcr.io/jtown81/elk-draw:latest    (latest version)
ghcr.io/jtown81/elk-draw:v1.0.0    (stable release)
```

### Push to GitHub Container Registry

#### Step 1: Authenticate with GitHub

```bash
# Create a Personal Access Token (PAT) at:
# https://github.com/settings/tokens
#
# Required scopes:
# - write:packages
# - read:packages
# - delete:packages

# Login to ghcr.io
echo YOUR_GITHUB_PAT | docker login ghcr.io -u USERNAME --password-stdin
```

#### Step 2: Push Images

```bash
# Push latest tag
docker push ghcr.io/jtown81/elk-draw:latest

# Push version tag
docker push ghcr.io/jtown81/elk-draw:v1.0.0

# Verify
docker images | grep ghcr.io
```

### Using Image from GitHub Container Registry

```bash
# Pull the image
docker pull ghcr.io/jtown81/elk-draw:latest

# Run the container
docker run -d -p 3456:3456 ghcr.io/jtown81/elk-draw:latest

# Or with docker-compose.yml:
# Change image line to:
# image: ghcr.io/jtown81/elk-draw:latest
```

## Docker Hub (Alternative)

To push to Docker Hub instead:

```bash
# Tag for Docker Hub
docker tag elk-analyzer:latest jtown81/elk-draw:latest
docker tag elk-analyzer:latest jtown81/elk-draw:v1.0.0

# Login to Docker Hub
docker login

# Push
docker push jtown81/elk-draw:latest
docker push jtown81/elk-draw:v1.0.0
```

## Current Status

- ✅ Code pushed to GitHub: https://github.com/jtown81/elk-draw
- ✅ Docker image tagged for ghcr.io
- ⏳ Docker image push: Waiting for authentication

## Automated Builds (GitHub Actions)

To set up automated Docker builds on push:

```yaml
# .github/workflows/docker-build.yml
name: Docker Build and Push

on:
  push:
    branches:
      - master
    tags:
      - 'v*'

jobs:
  docker:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v3

      - uses: docker/setup-buildx-action@v2

      - uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.ref_name }}
```

## Makefile (Optional)

```makefile
.PHONY: docker-build docker-push docker-login

docker-build:
	docker build -t elk-analyzer:latest .
	docker tag elk-analyzer:latest ghcr.io/jtown81/elk-draw:latest
	docker tag elk-analyzer:latest ghcr.io/jtown81/elk-draw:v1.0.0

docker-login:
	@echo "Log in to GitHub Container Registry"
	docker login ghcr.io

docker-push: docker-login
	docker push ghcr.io/jtown81/elk-draw:latest
	docker push ghcr.io/jtown81/elk-draw:v1.0.0

docker-run:
	docker compose up -d

docker-stop:
	docker compose down
```

## Image Information

- **Repository**: https://github.com/jtown81/elk-draw
- **Image**: `ghcr.io/jtown81/elk-draw`
- **Tags**: `latest`, `v1.0.0`
- **Size**: ~100-150 MB
- **Base**: node:20-alpine
- **Port**: 3456
- **Health Check**: Included

## Links

- **GitHub Repository**: https://github.com/jtown81/elk-draw
- **GitHub Container Registry**: https://github.com/jtown81/elk-draw/pkgs/container/elk-draw
- **Docker Hub** (if used): https://hub.docker.com/r/jtown81/elk-draw
