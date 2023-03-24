"use client";

import { PostType } from "@/app/types/Post";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Post from "./../../components/Posts";
import AddComment from "../../components/AddComment";
import Image from "next/image";
import { motion } from "framer-motion";
import moment from 'moment';

type URL = {
  params: {
    slug: string;
  };
};

const fetchDetails = async (slug: string) => {
  const res = await axios.get(`/api/posts/${slug}`);
  return res.data;
};

export default function PostDetail(url: URL) {
  const { data, isLoading } = useQuery<PostType[]>({
    queryKey: ["detail-post"],
    queryFn: () => fetchDetails(url.params.slug),
  });

  if (isLoading) return "isLoading...";
  console.log(data);
  
  return (
    <div>
      <Post
        id={data.id}
        name={data.user.name}
        avatar={data.user.image}
        postTitle={data.title}
        comments={data.Comments}
      />
      <AddComment id={data.id} />
      {data?.Comments?.map((comment) => (
        <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ ease: "easeOut" }}
        className="my-6 bg-white p-8 rounded-md"
        key={comment.id}
      >
        <div className="flex items-center gap-2 ">
          <Image
            width={26}
            height={26}
            src={comment.user?.image}
            className='rounded-xl'
            alt="avatar"
          />
          <h3 className="font-bold">{comment?.user?.name}</h3>
          <h2 className="text-sm bg-gray-200 rounded-md px-2 py-1">{moment(comment.createdAt).format("MMMM Do YYYY, h:mm a")}</h2>
        </div>
        <div className="py-0">{comment.message}</div>
      </motion.div>
      ))}
    </div>
  );
}