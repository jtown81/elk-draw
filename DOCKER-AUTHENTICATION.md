# Docker Registry Authentication Guide

## Quick Start

Run the build script and select option 12:

```bash
./build.sh
# Select: 12) Docker: Build + Tag + Push to ghcr.io
```

The script will:
1. Check if you're authenticated with ghcr.io
2. If not, offer an interactive login
3. Build the image
4. Push to GitHub Container Registry

## First Time Setup: Getting a GitHub PAT

If you're not yet authenticated:

### Step 1: Create a Personal Access Token (PAT)
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: `Docker Registry Access`
4. Select these scopes:
   - ✅ `write:packages` — push images
   - ✅ `read:packages` — pull images  
   - ✅ `delete:packages` — delete images
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### Step 2: Login to Docker
When you run `./build.sh` and select option 12:
- It will detect you're not logged in
- Offer to login interactively
- Enter your GitHub username
- Paste your PAT when prompted
- Script will authenticate and continue with the push

## Manual Login (If Needed)

If you prefer to login manually first:

```bash
docker login ghcr.io
# Enter username: YOUR_GITHUB_USERNAME
# Paste token when prompted: YOUR_GITHUB_PAT
```

Then run:
```bash
./build.sh
# Select: 12 or 13
```

## Troubleshooting

### "authentication required" error
**Solution**: Your credentials expired or token was revoked
1. Run: `docker logout ghcr.io`
2. Run `./build.sh` option 12 again
3. Enter new credentials

### "Layer already exists" messages (slow push)
**This is normal!** Docker is:
1. Checking which layers are already in the registry
2. Pushing only new/changed layers
3. This can take 10-30 seconds depending on network

### "Permission denied" error
**Solutions**:
1. Verify your PAT has correct scopes (write:packages required)
2. Check token hasn't expired (PATs expire after 1 year by default)
3. Verify your GitHub account has access to push to ghcr.io

### Complete re-authentication
```bash
docker logout ghcr.io
docker login ghcr.io
# Or use: ./build.sh → option 12 (interactive login)
```

## Current Status

Your system already has credentials configured for ghcr.io. When you run option 12, it will:
1. Verify credentials are valid
2. Build the image if needed
3. Push to: `ghcr.io/jtown81/elk-draw:latest` and `ghcr.io/jtown81/elk-draw:v0.1.0`

## Testing Your Login

Verify you can access the registry:

```bash
docker pull ghcr.io/jtown81/elk-draw:latest
```

If this succeeds, your authentication is working.

## Image Tags

Every push creates two tags:
- **`latest`** — Always points to the most recent build
- **`v0.1.0`** — Version-specific tag from package.json

Pull either one:
```bash
docker pull ghcr.io/jtown81/elk-draw:latest
docker pull ghcr.io/jtown81/elk-draw:v0.1.0
```

## More Info

- GitHub Packages Docs: https://docs.github.com/en/packages
- Container Registry Guide: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry
