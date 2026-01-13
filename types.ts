/**
 * Configuration options for the PixelSocket client
 */
export interface PixelSocketOptions {
    /**
     * WebSocket server URL to connect to
     */
    url: string;

    /**
     * Directory to save received images (optional)
     * @default "./received_images"
     */
    saveDirectory?: string;

    /**
     * Whether to automatically reconnect on connection loss
     * @default true
     */
    autoReconnect?: boolean;

    /**
     * Reconnection delay in milliseconds
     * @default 5000
     */
    reconnectDelay?: number;

    /**
     * Maximum number of reconnection attempts
     * @default 10
     */
    maxReconnectAttempts?: number;

    /**
     * Callback function when an image is received
     */
    onImage?: (imageData: Uint8Array, metadata?: ImageMetadata) => void;

    /**
     * Callback function when connection is established
     */
    onConnect?: () => void;

    /**
     * Callback function when connection is closed
     */
    onDisconnect?: (code: number, reason: string) => void;

    /**
     * Callback function when an error occurs
     */
    onError?: (error: Error) => void;
}

/**
 * Metadata associated with received images
 */
export interface ImageMetadata {
    /**
     * Timestamp when the image was received
     */
    timestamp: Date;

    /**
     * Image format/type (e.g., 'jpeg', 'png', 'webp')
     */
    format?: string;

    /**
     * Image dimensions
     */
    width?: number;
    height?: number;

    /**
     * MIME type of the image
     */
    mimeType?: string;

    /**
     * Original filename if provided
     */
    filename?: string;

    /**
     * Generation parameters (for AI-generated images)
     */
    params?: {
        positivePrompt?: string;
        negativePrompt?: string;
        seed?: string;
        width?: number;
        height?: number;
        workflowName?: string;
        [key: string]: unknown;
    };

    /**
     * Additional custom metadata
     */
    [key: string]: unknown;
}

/**
 * WebSocket message structure for image-generated events
 */
export interface ImageGeneratedMessage {
    type: "image-generated";
    data: {
        mode: string;
        promptId: string;
        base64Data: string;
        mimeType: string;
        imageInfo: {
            filename: string;
            subfolder: string;
            type: string;
        };
        params?: {
            positivePrompt?: string;
            negativePrompt?: string;
            seed?: string;
            width?: number;
            height?: number;
            workflowName?: string;
            [key: string]: unknown;
        };
        imageIdx: number;
        imageLength: number;
        timestamp: number;
    };
}

/**
 * Statistics for the PixelSocket connection
 */
export interface ConnectionStats {
    /**
     * Total number of images received
     */
    imagesReceived: number;

    /**
     * Total bytes received
     */
    bytesReceived: number;

    /**
     * Connection start time
     */
    connectedAt?: Date;

    /**
     * Current connection status
     */
    isConnected: boolean;

    /**
     * Number of reconnection attempts
     */
    reconnectAttempts: number;
}
