import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { trpc } from "@/utils/trpc";

const TopicList = () => {
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
        topics?.map((topic) => <div key={topic.id}>{topic.name}</div>)
      )}
    </>
  );
};

const TopicForm = () => {
  const { data: session } = useSession();

  const createMutation = trpc.useMutation(["topic.create"]);

  const initState = {
    name: "",
    description: "",
    public: false,
  };

  const [topic, setTopic] = useState<{
    name: string;
    description: string;
    public: boolean;
  }>(initState);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTopic((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTopic((prev) => {
      return { ...prev, public: !prev.public };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log({ ...topic, userId: session?.user?.id });
    await createMutation.mutateAsync({ ...topic, ownerId: session!.user!.id! });
    setTopic(initState);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Topic</label>
        <input
          type={"text"}
          name="name"
          value={topic.name}
          onChange={handleTextChange}
        />

        <label htmlFor="description">Description</label>
        <input
          type={"textarea"}
          name="description"
          value={topic.description}
          placeholder="optional"
          onChange={handleTextChange}
        />

        <label htmlFor="public">Public</label>
        <input
          type={"checkbox"}
          name="public"
          checked={topic.public}
          onChange={handleCheckChange}
        />

        <br />
        <input type="submit" value="Submit" />
      </form>
      {createMutation.isSuccess && <div>TOPIC CREATED</div>}
      <hr />
    </>
  );
};

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <div>
          Logged in as: {session.user?.name}{" "}
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}

      {session && session.user ? <TopicForm /> : null}
      {session && session.user ? <TopicList /> : null}
    </>
  );
};

export default Home;
