import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

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
        <h1>{session?.user?.name}&apos;s Dashboard</h1>
      )}
    </>
  );
};

export default Dashboard;
