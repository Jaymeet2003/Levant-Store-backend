"use client";

import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BlogPost } from "@/types/blog";
import { Empty, message } from "antd";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`)
      .then((response) => response.json())
      .then((data: BlogPost[]) => setBlogs(data))
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        message.error("Error fetching blogs");
      });
  }, []);

  const handleDelete = (id: string) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
          message.success("Blog post deleted successfully");
        } else {
          console.error("Error deleting blog:", response.statusText);
          message.error("Error deleting blog");
        }
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
        message.error("Error deleting blog");
      });
  };

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle className="flex justify-between">Blog Posts</CardTitle>
        <CardDescription>
          Manage your blog posts and optimize their SEO.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/blog/add">
          <Button className="mb-2" size="sm">
            Create Post
          </Button>
        </Link>

        {blogs.length === 0 ? (
          <Empty description="No blogs available. Create a new post!" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">
                  SEO Description
                </TableHead>
                <TableHead className="hidden md:table-cell">SEO Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/blog/${blog._id}`}
                      className="hover:underline"
                    >
                      {blog.title}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {blog.metaDescription}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {blog.seoKeywords}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <DotsHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/blog/edit/${blog._id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(blog._id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default Blog;
