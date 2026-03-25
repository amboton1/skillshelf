"use client";

import { MessageCircle, Send, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Comment = {
  id: string;
  description: string;
  createdAt: Date;
  userName: string | null;
  userImage: string | null;
};

interface ResourceCommentsProps {
  resourceId: string;
  initialComments: Comment[];
  isLoggedIn: boolean;
}

export function ResourceComments({
  resourceId,
  initialComments,
  isLoggedIn,
}: ResourceCommentsProps) {
  const [commentList, setCommentList] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || pending) return;

    setPending(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, description: text }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      const newComment: Comment = await res.json();
      setCommentList((prev) => [newComment, ...prev]);
      setText("");
    } catch {
      // silent fail — user can retry
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="size-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">
          Comments{" "}
          <span className="font-normal text-slate-400">
            ({commentList.length})
          </span>
        </h3>
      </div>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Leave a comment..."
            rows={3}
            className="resize-none text-sm"
            disabled={pending}
          />
          <Button
            type="submit"
            size="sm"
            className="self-end gap-2"
            disabled={!text.trim() || pending}
          >
            <Send className="size-3.5" />
            {pending ? "Posting..." : "Post"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-slate-400">Sign in to leave a comment.</p>
      )}

      {commentList.length === 0 ? (
        <p className="text-sm text-slate-400">No comments yet. Be the first!</p>
      ) : (
        <ul className="space-y-4">
          {commentList.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                {comment.userImage ? (
                  <Image
                    src={comment.userImage}
                    alt={comment.userName ?? "User"}
                    className="size-8 rounded-full object-cover"
                    width={32}
                    height={32}
                  />
                ) : (
                  <User className="size-4 text-slate-400" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-slate-800">
                    {comment.userName ?? "Anonymous"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  {comment.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
