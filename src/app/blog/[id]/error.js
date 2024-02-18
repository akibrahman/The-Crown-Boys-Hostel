"use client";

import { useRouter } from "next/navigation";

const Error = () => {
  const router = useRouter();
  return (
    <div>
      <p>File not Found</p>
      <button onClick={() => router.back()}>Back</button>
    </div>
  );
};

export default Error;
