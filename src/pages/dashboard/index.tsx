import type { NextPage } from "next";
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

  return (
    <>
      {status === "loading" ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>{session?.user?.name}&apos;s Dashboard</h1>
          <button onClick={() => signOut()}>Sign Out</button>
          <hr />
          <h2>My Topics</h2>
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
