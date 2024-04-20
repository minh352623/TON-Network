import { FC, Key, useEffect, useState } from "react";

import { SolanaLogo } from "components";
import styles from "./index.module.css";
import { Address, beginCell, Cell, contractAddress, StateInit } from "ton";

import Navbar from "components/Navbar";
import {
  SendTransactionRequest,
  TonConnectButton,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { useTonAddress } from "@tonconnect/ui-react";
import TonWeb from "tonweb";
import { useUserStore } from "store/userStore";
import { apiRaffles } from "api/raffles";

export const SolanaPoolStakeView: FC = ({}) => {
  const userFriendlyAddress = useTonAddress();

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box justify-between">
          <div className="flex gap-3">
            <div className="flex-none">
              <button className="btn btn-square btn-ghost">
                <span className="text-4xl">🌔</span>
              </button>
            </div>
            <div className="flex-1 px-2 mx-2">
              <div className="text-sm breadcrumbs">
                <ul className="text-xl">
                  <li>
                    <span className="opacity-40">
                      {"tonraffles".toUpperCase()}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex-none">
            <TonConnectButton className="button_ton_connect_button" />
          </div>
        </div>

        <div className="flex justify-center">
          {userFriendlyAddress && <StakingScreen />}
        </div>
      </div>
    </div>
  );
};

const StakingScreen = () => {
  return (
    <div className="rounded-lg flex justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="text-xs">
          <NetStaking />
        </div>
      </div>
    </div>
  );
};

type NetStaking = {
  // onSwapSent: (t: any) => void;
};

const NetStaking: FC<NetStaking> = ({}) => {
  const [tonconnect] = useTonConnectUI();
  const [amount, setAmount] = useState<string | number>(0);
  const token = useUserStore((state: any) => state.token);

  const sendTON = async () => {
    try {
      const tx: SendTransactionRequest = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: "EQARDniUyL39Rw9-yfJs9f7rrHhY8lT-yJiVCqIjtMzT8Q5n",
            amount: (Number(amount) * 10 ** 9).toFixed(0),
          },
        ],
      };

      const boc = await tonconnect.sendTransaction(tx);
      console.log(`Send tx result: ${JSON.stringify(boc)}`);
    } catch (err) {
      console.log("🚀 ~ sendTON ~ err:", err);
    }
  };

  const testCall = async () => {
    const data = await apiRaffles.testClientSend();
    console.log("🚀 ~ testCall ~ data:", data);
  };
  return (
    <div
      style={{ minWidth: 240 }}
      className="mb-8   flex  w-[600px] flex-col gap-5"
    >
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <span>Amount </span>
          <input
            onChange={(e) => setAmount(e.target.value)}
            name="amount"
            type="number"
            placeholder="Enter amount token TON"
            className="mb-4 "
          ></input>
        </div>
      </div>
      <button
        onClick={testCall}
        className="btn btn-primary rounded-full normal-case	w-full"
      >
        Send Transaction
      </button>
    </div>
  );
};
