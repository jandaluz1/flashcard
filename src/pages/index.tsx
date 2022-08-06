import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <div>
          Logged in as: {session.user?.name}{" "}
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : null}
      <button onClick={() => signIn()}>Sign In</button>
    </>
  );
};

export default Home;
