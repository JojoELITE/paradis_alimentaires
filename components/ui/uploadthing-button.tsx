// components/ui/uploadthing-button.tsx
"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2 } from "lucide-react";

interface UploadthingButtonProps {
    onUploadComplete: (url: string) => void;
    onUploadError?: (error: Error) => void;
    className?: string;
}

export function UploadthingButton({
    onUploadComplete,
    onUploadError,
    className
}: UploadthingButtonProps) {
    return (
        <UploadButton<OurFileRouter>
            endpoint="productImageUploader"
            onClientUploadComplete={(res) => {
                if (res && res[0]) {
                    onUploadComplete(res[0].ufsUrl);
                }
            }}
            onUploadError={(error: Error) => {
                console.error("Upload error:", error);
                if (onUploadError) onUploadError(error);
            }}
            appearance={{
                button: {
                    background: "hsl(var(--primary))",
                    color: "white",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                },
                allowedContent: {
                    color: "hsl(var(--muted-foreground))",
                },
            }}
        />
    );
}