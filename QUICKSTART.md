# Quick Start Guide

## Installation

Ensure you have [Deno](https://deno.land/) installed (v1.30.0 or higher).

## Usage

### Option 1: Connect to the Ultimate Battle WebSocket Server

```bash
# Basic example - connects to wss://vite-based-comfyui-web-interface/ws/broadcast
deno run --allow-net --allow-write examples/basic.ts

# Advanced example with detailed statistics
deno run --allow-net --allow-write examples/advanced.ts
```

### Option 2: Connect to a Custom WebSocket Server

```bash
# Pass a custom WebSocket URL as an argument
deno run --allow-net --allow-write examples/basic.ts ws://your-server.com/ws
```

### Option 3: Use in Your Own Code

```typescript
import { PixelSocket } from "https://raw.githubusercontent.com/0nyx-networks/pixel-socket/main/mod.ts";

const client = new PixelSocket({
  url: "wss://vite-based-comfyui-web-interface/ws/broadcast",
  saveDirectory: "./my_images",
  onImage: (imageData, metadata) => {
    console.log(`Image received: ${imageData.length} bytes`);
    
    // Access metadata
    if (metadata?.params) {
      console.log(`Workflow: ${metadata.params.workflowName}`);
      console.log(`Dimensions: ${metadata.width}x${metadata.height}`);
    }
  },
});

await client.connect();
```

## What Gets Saved?

Images are automatically saved to the `saveDirectory` with filenames based on timestamps:

```
./received_images/
  ├── 1768307710712.png
  ├── 1768307720834.png
  └── 1768307730956.png
```

## Message Format

The WebSocket server sends JSON messages with this structure:

```json
{
  "type": "image-generated",
  "data": {
    "base64Data": "...",
    "mimeType": "image/png",
    "imageInfo": {
      "filename": "ComfyUI_00548_.png"
    },
    "params": {
      "positivePrompt": "...",
      "seed": "7419854775631041493",
      "width": 1024,
      "height": 1536,
      "workflowName": "novaAnimeXL.json"
    },
    "timestamp": 1768307710712
  }
}
```

PixelSocket automatically:
- Decodes the base64 image data
- Extracts metadata and generation parameters
- Saves images with proper file extensions
- Provides all information in callbacks

## Common Use Cases

### Collecting AI-Generated Images

```typescript
const client = new PixelSocket({
  url: "wss://vite-based-comfyui-web-interface/ws/broadcast",
  saveDirectory: "./ai_images",
  onImage: (imageData, metadata) => {
    console.log(`New AI image: ${metadata?.filename}`);
    console.log(`Generated with: ${metadata?.params?.workflowName}`);
  },
});
```

### Filtering Images by Size

```typescript
const client = new PixelSocket({
  url: "wss://vite-based-comfyui-web-interface/ws/broadcast",
  onImage: (imageData, metadata) => {
    if (imageData.length > 100000) {
      console.log("Large high-quality image received!");
    }
  },
});
```

### Processing with Custom Logic

```typescript
const client = new PixelSocket({
  url: "wss://vite-based-comfyui-web-interface/ws/broadcast",
  saveDirectory: null, // Don't auto-save
  onImage: async (imageData, metadata) => {
    // Custom processing
    await processWithML(imageData);
    await uploadToCloud(imageData, metadata);
  },
});
```

## Troubleshooting

### Connection Issues

- Ensure you have network access to the WebSocket server
- Check that the URL uses `wss://` for secure connections
- Verify your firewall allows WebSocket connections

### Permission Errors

Make sure to grant the necessary permissions:
- `--allow-net` for network access
- `--allow-write` for saving images to disk

### No Images Received

- Check that the WebSocket server is actively broadcasting
- Enable error callbacks to see detailed error messages
- Verify the server is sending data in a compatible format

## Next Steps

- Read the [full documentation](README.md)
- Check out the [examples directory](examples/)
- Review the [TypeScript types](types.ts) for detailed API information
