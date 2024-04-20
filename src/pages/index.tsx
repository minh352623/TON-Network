import { useTonAddress } from "@tonconnect/ui-react";
import { apiRaffles } from "api/raffles";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useUserStore } from "store/userStore";
import { setLocalStore } from "utils";
import { SolanaPoolStakeView } from "views";

const Home: NextPage = (props) => {
  const userFriendlyAddress = useTonAddress();
  const setToken = useUserStore((state: any) => state.setToken);

  const connectBe = async (userFriendlyAddress: string) => {
    try {
      const token = await apiRaffles.connectBE({
        wallet_address: userFriendlyAddress,
      });
      setToken({ token });
      setLocalStore("access_token", token);
    } catch (err: any) {
      console.log("🚀 ~ connectBe ~ err:", err);
    }
  };
  useEffect(() => {
    if (userFriendlyAddress) {
      connectBe(userFriendlyAddress);
    }
  }, [userFriendlyAddress]);
  return (
    <div>
      <Head>
        <title> Swapper! </title>
        <meta name="description" content="A demo site for Remi" />
      </Head>
      <SolanaPoolStakeView />
    </div>
  );
};

export default Home;
