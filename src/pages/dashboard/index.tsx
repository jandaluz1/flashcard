import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";

const UserTopicList = () => {
  const { data: session } = useSession();

  const { data: topics, isLoading } = trpc.useQuery([
    "topic.getUserTopics",
    { userId: session!.user!.id! },
  ]);

  return (
    <>
      <h2>{session?.user?.name} Topics</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>Uncategorized</div>
          {topics?.map((topic) => (
            <div key={topic.id}>{topic.name}</div>
          ))}
        </>
      )}
      <hr className="py-2" />
    </>
  );
};

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    status === "unauthenticated" ? router.push("/") : router.push("/dashboard");
  }, []);
  return (
    <>
      {status === "loading" ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>{session?.user?.name}&apos;s Dashboard</h1>
          <h2>Topics</h2>
          <UserTopicList />
        </>
      )}
    </>
  );
};

export default Dashboard;
