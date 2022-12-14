import type { NextPage } from "next";
import { useSession, signIn, getSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { trpc, inferMutationInput } from "@/utils/trpc";

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
          id="name"
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
      <hr className="py-2" />
    </>
  );
};

const FlashcardForm = () => {
  const { data: session } = useSession();
  const { data: userTopics } = trpc.useQuery([
    "topic.getUserTopics",
    { userId: session!.user!.id! },
  ]);
  const initFormData = { question: "", answer: "", topicId: undefined };
  const [formData, setFormData] = useState<{
    question: string;
    answer: string;
    topicId?: string;
  }>(initFormData);

  type createFlashcard = inferMutationInput<"flashcard.create">;
  const flashcardCreateMutation = trpc.useMutation(["flashcard.create"]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    return setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newCard: createFlashcard = {
      ...formData,
      ownerId: session!.user!.id!,
    };

    console.log(newCard);
    await flashcardCreateMutation.mutateAsync(newCard);
    setFormData(initFormData);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic">Topic</label>
        <select
          name="topicId"
          id="topic"
          value={formData.topicId}
          onChange={handleChange}
        >
          <option value={undefined}>Uncategorized</option>
          {userTopics &&
            userTopics.map((topic) => (
              <option value={topic.id} key={topic.id}>
                {topic.name}
              </option>
            ))}
        </select>

        <label htmlFor="question">Question:</label>
        <input
          type="text"
          name="question"
          id="question"
          value={formData.question}
          onChange={handleChange}
        />

        <label htmlFor="answer">Answer:</label>
        <input
          type="text"
          name="answer"
          id="answer"
          value={formData.answer}
          onChange={handleChange}
        />

        <br />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

const PublicTopics = () => {
  const { data: topics } = trpc.useQuery(["public.getPublicTopics"]);

  return (
    <>
      <h2>Public Topics</h2>
      {topics?.map((topic) => (
        <div key={topic.id}>{topic.name}</div>
      ))}
    </>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <button
        onClick={() =>
          signIn("gmail github", {
            callbackUrl: `${window.location.origin}/dashboard`,
          })
        }
      >
        Sign In
      </button>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Home;
