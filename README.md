# PixelSocket

A Deno TypeScript WebSocket client for collecting image streams from WebSocket servers.

## Features

- 🚀 **Easy to use** - Simple API for connecting to WebSocket servers
- 📸 **Image stream handling** - Automatically receives and processes image data
- 💾 **Auto-save** - Optionally save received images to disk
- 🔄 **Auto-reconnect** - Automatic reconnection with configurable retry logic
- 📊 **Statistics tracking** - Monitor connection stats and image metrics
- 🎯 **Format detection** - Automatic detection of image formats (PNG, JPEG, WebP, GIF)
- 🔧 **Customizable** - Extensive configuration options and callbacks
- 🛡️ **Type-safe** - Full TypeScript support with detailed types

## Requirements

- [Deno](https://deno.land/) v1.30.0 or higher

## Quick Start

### Basic Usage

```typescript
import { PixelSocket } from "./pixel_socket.ts";
const client = new PixelSocket({
    url: "wss://vite-based-comfyui-web-interface/ws/streaming",
    saveDirectory: "./images",
    onImage: (imageData, metadata) => {
        console.log(`Received image: ${imageData.length} bytes`);
    },
    onConnect: () => {
        console.log("Connected to WebSocket server");
    },
});

await client.connect();
```

## API Documentation

### Constructor Options

```typescript
interface PixelSocketOptions {
  // Required
  url: string;                           // WebSocket server URL

  // Optional
  saveDirectory?: string;                // Directory to save images (default: "./images")
  autoReconnect?: boolean;               // Auto-reconnect on disconnect (default: true)
  reconnectDelay?: number;               // Delay between reconnects in ms (default: 5000)
  maxReconnectAttempts?: number;         // Max reconnection attempts (default: 10)
  
  // Callbacks
  onImage?: (data: Uint8Array, metadata?: ImageMetadata) => void;
  onConnect?: () => void;
  onDisconnect?: (code: number, reason: string) => void;
  onError?: (error: Error) => void;
}
```

### Methods

#### `connect(): Promise<void>`
Connect to the WebSocket server.

```typescript
await client.connect();
```

#### `disconnect(): void`
Disconnect from the WebSocket server and stop auto-reconnection.

```typescript
client.disconnect();
```

#### `send(data: string | ArrayBuffer | Uint8Array): void`
Send data to the WebSocket server.

```typescript
client.send("Hello, server!");
client.send(new Uint8Array([1, 2, 3]));
```

#### `getStats(): ConnectionStats`
Get current connection statistics.

```typescript
const stats = client.getStats();
console.log(`Images received: ${stats.imagesReceived}`);
console.log(`Bytes received: ${stats.bytesReceived}`);
```

#### `isConnected(): boolean`
Check if currently connected to the server.

```typescript
if (client.isConnected()) {
  console.log("Connected!");
}
```

### Types

#### `ImageMetadata`
```typescript
interface ImageMetadata {
  timestamp: Date;              // When the image was received
  format?: string;              // Image format (png, jpg, webp, gif)
  width?: number;               // Image width
  height?: number;              // Image height
  mimeType?: string;            // MIME type (e.g., "image/png")
  filename?: string;            // Original filename if provided
  params?: {                    // Generation parameters (for AI-generated images)
    positivePrompt?: string;
    negativePrompt?: string;
    seed?: string;
    width?: number;
    height?: number;
    workflowName?: string;
  };
  [key: string]: unknown;       // Custom metadata
}
```

#### `ConnectionStats`
```typescript
interface ConnectionStats {
  imagesReceived: number;      // Total images received
  bytesReceived: number;       // Total bytes received
  connectedAt?: Date;          // Connection start time
  isConnected: boolean;        // Current connection status
  reconnectAttempts: number;   // Number of reconnection attempts
}
```

## Advanced Usage

### Understanding Message Formats

PixelSocket supports multiple message formats:

1. **Binary data** - Raw image bytes (PNG, JPEG, etc.)
2. **JSON with base64** - Image data encoded in JSON
3. **Image-generated events** - Structured JSON messages from image generation services

#### Image-Generated Event Format

The WebSocket server at `wss://vite-based-comfyui-web-interface/ws/streaming` sends messages in this format:

```json
{
  "type": "image-generated",
  "data": {
    "mode": "push",
    "promptId": "1bb04031-05b4-4b80-9855-94de56e0cc72",
    "base64Data": "{BASE64 IMAGE DATA}",
    "mimeType": "image/png",
    "imageInfo": {
      "filename": "ComfyUI_00548_.png",
      "subfolder": "",
      "type": "output"
    },
    "params": {
      "positivePrompt": "...",
      "negativePrompt": "...",
      "seed": "7419854775631041493",
      "width": 1024,
      "height": 1536,
      "workflowName": "novaAnimeXL.json"
    },
    "imageIdx": 0,
    "imageLength": 1,
    "timestamp": 1768307710712
  }
}
```

PixelSocket automatically handles this format and provides all metadata in the `onImage` callback.

### Custom Image Processing

```typescript
const client = new PixelSocket({
  url: "wss://vite-based-comfyui-web-interface/ws/streaming",
  saveDirectory: "./images",
  onImage: (imageData, metadata) => {
    // Custom processing
    if (imageData.length > 10000) {
      console.log("Large image received!");
      // Process large images differently
    }
    
    // Access metadata
    console.log(`Format: ${metadata?.format}`);
    console.log(`Timestamp: ${metadata?.timestamp}`);
    
    // Access generation parameters (if available)
    if (metadata?.params) {
      console.log(`Workflow: ${metadata.params.workflowName}`);
      console.log(`Seed: ${metadata.params.seed}`);
      console.log(`Prompt: ${metadata.params.positivePrompt}`);
    }
  },
});
```

### Handling Disconnections

```typescript
const client = new PixelSocket({
  url: "wss://vite-based-comfyui-web-interface/ws/streaming",
  autoReconnect: true,
  reconnectDelay: 3000,
  maxReconnectAttempts: 5,
  onDisconnect: (code, reason) => {
    console.log(`Disconnected: ${code} - ${reason}`);
  },
});
```

### Sending Data to Server

```typescript
const client = new PixelSocket({
  url: "wss://vite-based-comfyui-web-interface/ws/streaming",
  onConnect: () => {
    // Send a message when connected
    client.send(JSON.stringify({ action: "start_stream" }));
  },
});
```

## Image Format Support

PixelSocket automatically detects the following image formats:
- **PNG** - Portable Network Graphics
- **JPEG/JPG** - Joint Photographic Experts Group
- **WebP** - Web Picture format
- **GIF** - Graphics Interchange Format

Images are saved with the appropriate file extension based on their detected format.

## Error Handling

```typescript
const client = new PixelSocket({
  url: "wss://vite-based-comfyui-web-interface/ws/streaming",
  onError: (error) => {
    console.error(`Error occurred: ${error.message}`);
    // Handle error appropriately
  },
});

try {
  await client.connect();
} catch (error) {
  console.error("Failed to connect:", error);
}
```

## Use Cases

- **Video streaming** - Collect frames from video streams
- **Surveillance systems** - Receive images from security cameras
- **Real-time image processing** - Process images as they arrive
- **Image archival** - Save images from remote sources
- **Machine learning** - Collect training data
- **Remote sensing** - Receive images from IoT devices

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/0nyx-networks/pixel-socket/issues) on GitHub.
