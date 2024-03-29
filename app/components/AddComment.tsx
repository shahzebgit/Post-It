"use client";

import axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Comment = {
  postId?: string;
  title: string;
};
type PostProps = {
  id?: string;
};
export default function AddComment({ id }: PostProps) {
  let commentToastId: string;
  console.log(id);
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  function handleChange(e: string) {
    if (e.length >= 301) return;
    e.length ? setIsDisabled(false) : setIsDisabled(true);
    setTitle(e);
  }

  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async (data: Comment) => {
      return axios.post("/api/posts/addComment", { data });
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["detail-post"]);
        setTitle("");
        setIsDisabled(false);
        toast.success("Added your comment", { id: commentToastId });
      },
      onError: (error) => {
        console.log(error);
        setIsDisabled(false);
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message, { id: commentToastId });
        }
      },
    }
  );

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    commentToastId = toast.loading("Adding your comment", {
      id: commentToastId,
    });
    setTimeout(() => {
      toast.dismiss(commentToastId);
    }, 1600);
    mutate({ title, postId: id });
  };
  return (
    <form onSubmit={submitPost} className="my-8">
      <h3 className="text-xl">Add a comment</h3>

      <div className="flex flex-col my-2">
        <input
          onChange={(e) => handleChange(e.target.value)}
          value={title}
          type="text"
          name="title"
          placeholder="Share your opinions"
          className="p-4 text-lg rounded-md my-2 border-solid border-2 border-gray-300"
        />
      </div>
      <div className="flex justify-between items-center gap-2">
        <button
          disabled={isDisabled}
          className="text-sm bg-teal-600 text-white py-2 px-4 rounded-xl disabled:opacity-25"
          type="submit"
        >
          Add Comment 🚀
        </button>
        <p
          className={`font-bold  ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          } `}
        >{`${title.length}/300`}</p>
      </div>
    </form>
  );
}
