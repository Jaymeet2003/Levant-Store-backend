"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { message } from "antd";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

export function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [iframeKey, setIframeKey] = useState(0); // Add this line
  const formRef = useRef<HTMLFormElement>(null);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      message.error("No file selected");
      formRef.current?.reset();
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      message.error("Only PDF files are allowed");
      formRef.current?.reset();
      return;
    }

    if (selectedFile.size === 0) {
      message.error("The file is empty");
      formRef.current?.reset();
      return;
    }

    if (selectedFile.size > 10485760) {
      message.error("File size should be less than 10MB");
      formRef.current?.reset();
      return;
    }

    setFile(selectedFile);
    message.success("File selected successfully");
  };

  const uploadMenu = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      message.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("menu", file);

    try {
      const response = await fetch(`${backendURL}/api/menu/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log(data);

      // Update the iframe
      setIframeKey((prevKey) => prevKey + 1);

      // Show success message
      message.success(
        "Menu uploaded successfully. The preview has been updated."
      );

      // Reset the form and file state
      setFile(null);
      formRef.current?.reset();
    } catch (error) {
      console.error("Error uploading menu:", error);
      message.error("Failed to upload menu. Please try again.");
    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Label>Existing Menu</Label>
      <div className="min-h-[25rem] rounded-lg bg-primary my-3">
        <iframe
          src={`${backendURL}/api/menu`}
          width="100%"
          height="400px"
          key={iframeKey}
          className="my-3"
        />
        {/* <div className="text-center text-secondary h-full w-full min-h-full min-w-full">
          No menu has been uploaded yet
        </div> */}
      </div>
      <Label>Update the menu</Label>
      <div className="flex flex-col items-center py-20 justify-center bg-background px-4 sm:px-6 lg:px-8 mt-3 ">
        <div className="max-w-md text-center">
          <form className="space-y-4" onSubmit={uploadMenu} ref={formRef}>
            <div>
              <Label htmlFor="pdf-upload">PDF Menu</Label>
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                maxLength={10485760}
                className="mt-1"
                onChange={handleFileChange}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                PDF files up to 10MB are allowed.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={!file}>
              Upload
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
