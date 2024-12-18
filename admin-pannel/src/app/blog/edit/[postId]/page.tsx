"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import { message, Modal, Form } from "antd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BlogPost as BaseBlogPost } from "@/types/blog";

interface BlogPost extends BaseBlogPost {
  htmlContent: string;
}

export default function EditBlogPost() {
  const router = useRouter();
  const { postId } = useParams();
  const editorRef = useRef<TinyMCEEditor | any | null>(null);
  const [title, setTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [seoKeywords, setSeoKeywords] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the existing blog post data
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${postId}`
        );
        if (response.ok) {
          const data: BlogPost = await response.json();
          setTitle(data.title);
          setMetaDescription(data.metaDescription);
          setSeoKeywords(data.seoKeywords);
          setContent(data.htmlContent);
        } else {
          message.error("Error fetching blog post");
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        message.error("Error fetching blog post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [postId]);

  const generateHtmlContent = (content: string) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title || "Blog Post"}</title>
        <meta name="description" content="${metaDescription || ""}">
        <meta name="keywords" content="${seoKeywords || ""}">
        <style>
          body { font-family: Helvetica, Arial, sans-serif; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
  };

  const previewContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const previewWindow = window.open("", "_blank");
      if (previewWindow) {
        previewWindow.document.write(generateHtmlContent(content));
        previewWindow.document.close();
      }
    }
  };

  const handleSubmit = async () => {
    if (!title || !metaDescription || !seoKeywords) {
      setIsModalVisible(true);
    } else {
      const content = editorRef.current?.getContent();
      const htmlContent = generateHtmlContent(content || "");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${postId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              content,
              metaDescription,
              seoKeywords,
              htmlContent,
            } as BlogPost),
          }
        );

        if (response.ok) {
          message.success("Blog post updated successfully");
          router.push("/blog");
        } else {
          const data = await response.json();
          console.error("Error updating blog:", data.error);
          message.error("Error updating blog: " + data.error);
        }
      } catch (error) {
        console.error("Error updating blog:", error);
        message.error("Error updating blog");
      }
    }
  };

  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

  const handleSaveSeo = () => {
    setIsModalVisible(false);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter the blog title"
        className="mb-2 text-xl h-15"
      />
      <TinyMCEEditor
        apiKey={apiKey}
        onInit={(_evt, editor) => {
          editorRef.current = editor;
          editor.ui.registry.addButton("seo", {
            text: "SEO",
            icon: "settings",
            onAction: () => setIsModalVisible(true),
          });
        }}
        initialValue={content}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
            "emoticons",
            "a11ychecker",
            "paste",
            "codewordcount",
            "toc",
            "a11ychecker",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | \
            link image media table | code preview fullscreen | \
            emoticons codesample toc | help seo",
          image_title: true,
          automatic_uploads: false,
          file_picker_types: "image",
          file_picker_callback: (cb, value, meta) => {
            if (meta.filetype === "image") {
              message.info(
                "Please use a link pointing to the image instead of uploading files."
              );
              const input = document.createElement("input");
              input.setAttribute("type", "text");
              input.setAttribute("placeholder", "Enter image URL");
              input.onchange = () => {
                cb(input.value, { title: "Image URL" });
              };
              input.click();
            }
          },
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Button
            variant={"destructive"}
            style={{ marginLeft: "10px" }}
            onClick={() => router.push("/blog")}
          >
            Cancel
          </Button>
        </div>
        <div>
          <Button onClick={handleSubmit}>Update</Button>
          <Button
            variant={"outline"}
            style={{ marginLeft: "10px" }}
            onClick={previewContent}
          >
            Preview
          </Button>
        </div>
      </div>
      <Modal
        title="SEO Settings"
        open={isModalVisible}
        footer={null} // Disable default footer to use custom buttons
        onCancel={() => setIsModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Meta Description">
            <Textarea
              value={metaDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMetaDescription(e.target.value)
              }
              placeholder="Enter meta description"
            />
          </Form.Item>
          <Form.Item label="SEO Keywords">
            <Input
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="Enter SEO keywords"
            />
          </Form.Item>
        </Form>
        <div className="flex justify-end mt-2">
          <Button onClick={handleSaveSeo}>Save</Button>
          <Button
            variant="outline"
            className="ml-3"
            onClick={() => setIsModalVisible(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
