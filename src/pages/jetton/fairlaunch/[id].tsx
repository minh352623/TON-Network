import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { DetailJettonLaunchpad } from "views/DetailJettonLaunchpad";
const Home: NextPage = (props) => {
  const router = useRouter();
  const { id } = router.query;
  console.log("🚀 ~ query:", id);
  return (
    <div>
      <Head>
        <title> {id}! </title>
        <meta name="description" content={id as string} />
      </Head>
      <DetailJettonLaunchpad />
    </div>
  );
};

export default Home;
