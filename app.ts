import { PixelSocket } from "./pixel_socket.ts";
const client = new PixelSocket({
    url: "wss://vite-based-comfyui-web-interface/ws/broadcast",
    saveDirectory: "./images",
    onImage: (imageData, metadata) => {
        console.log(`Received image: ${imageData.length} bytes`);
    },
    onConnect: () => {
        console.log("Connected to WebSocket server");
    },
});

await client.connect();
