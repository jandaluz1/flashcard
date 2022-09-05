import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signOut, getSession } from "next-auth/react";
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

const UserCardList = () => {
  const { data: session } = useSession();
  const { data: cards } = trpc.useQuery([
    "flashcard.getUserCards",
    { id: session!.user!.id! },
  ]);

  return (
    <>
      {cards?.map((card) => (
        <div key={card.id}>{card.question}</div>
      ))}
    </>
  );
};

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <>
      {status === "loading" ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>{session?.user?.name}&apos;s Dashboard</h1>
          <hr />
          <h2>Topics</h2>
          <UserTopicList />
          <h2>Flashcards</h2>
          <UserCardList />
        </>
      )}
    </>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Dashboard;
