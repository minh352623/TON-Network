import {
  SendTransactionRequest,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import Header from "components/Header";
import { FC, useState } from "react";
import { TextField } from "@mui/material";
import BorderLinearProgress from "components/BorderLinearProgress";

export const DetailJettonLaunchpad: FC = ({}) => {
  return (
    <div className="container mx-auto p-8 2xl:px-0 overflow-x-hidden overflow-y-auto">
      <div>
        <Header></Header>

        <div className="flex justify-center">
          <DetailJettonScreen />
        </div>
      </div>
    </div>
  );
};

const DetailJettonScreen = () => {
  return (
    <div className="rounded-lg flex justify-center w-full overflow-x-hidden">
      <div className="flex flex-col w-full flex-1 items-center justify-center">
        <div className="flex flex-1 w-full">
          <DetailJetton />
        </div>
      </div>
    </div>
  );
};

type DetailJetton = {
  // onSwapSent: (t: any) => void;
};

const DetailJetton: FC<DetailJetton> = ({}) => {
  const [tonconnect] = useTonConnectUI();
  const [amount, setAmount] = useState<string | number>(0);
  const [progress, setProgress] = useState(50);
  const userFriendlyAddress = useTonAddress();

  const purcharse = async () => {
    try {
      const tx: SendTransactionRequest = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: "0QAfXKrddeHxwTRjP_MpBmy8u0k2ThwyclIsHVNL6lqcc5gp",
            amount: (Number(amount) * 10 ** 9).toFixed(0),
          },
        ],
      };

      const boc = await tonconnect.sendTransaction(tx);
      console.log(`Send tx result: ${JSON.stringify(boc)}`);
    } catch (err) {
      setAmount(0);
      console.log("🚀 ~ purcharse ~ err:", err);
    }
  };

  return (
    <div className="flex flex-1 gap-3">
      <div className="p-5 flex-1 bg-[#2F2F33] rounded-xl flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <img
              src="https://cache.tonapi.io/imgproxy/8mKBa1CjHSWl2GAq1gDdUNZVlmoCe6tiw5Wilx-bzCY/rs:fill:200:200:1/g:no/aHR0cHM6Ly9pLmliYi5jby9RZjZDR3ExL2ltZ29ubGluZS1jb20tdWEtUmVzaXplLXQtVTQtWDAtRlZjLUsxLmpwZw.webp"
              className="w-[62px] h-[62px] rounded-full"
              alt=""
            />
            <div className="flex flex-col gap-2">
              <span className="tetx-xl font-bold text-2xl">
                WaveTon Fairlaunch
              </span>
              <div className="flex gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="px-2 bg-green-200 rounded-full flex justify-center items-center max-h-[30px] gap-1 text-sm text-green-800">
              <span className="rounded-full w-[8px] h-[8px] bg-green-800"></span>
              <span>Sale Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5  bg-[#2F2F33] rounded-xl flex flex-col gap-4">
        <div className="flex gap-3 flex-col">
          <span className="text-gray-400 text-[16px]">Presale Ends In:</span>
          <div className="flex gap-3 justify-between">
            <div className="px-4 py-2 border border-gray-500 rounded-lg flex flex-col items-center">
              <span>8</span>
              <span>days</span>
            </div>
            <div className="px-4 py-2 border border-gray-500 rounded-lg flex flex-col items-center">
              <span>8</span>
              <span>houre</span>
            </div>
            <div className="px-4 py-2 border border-gray-500 rounded-lg flex flex-col items-center">
              <span>8</span>
              <span>mins</span>
            </div>
            <div className="px-4 py-2 border border-gray-500 rounded-lg flex flex-col items-center">
              <span>8</span>
              <span>secs</span>
            </div>
          </div>
          <div className="flex flex-col-gap-2">
            <BorderLinearProgress progress={progress} />
            <div className="flex flex-1 text-gray-400 justify-between">
              <span>16.84 TON</span>
              <span>3 000 TON</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span>Amount</span>
            <TextField
              id="outlined-number"
              label="Number"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />

            <button
              onClick={purcharse}
              disabled={!userFriendlyAddress || Number(amount) <= 0}
              className={`font-bold text-lg  p-3 rounded-xl hover:scale-105 transition-all ${
                !userFriendlyAddress || Number(amount) <= 0
                  ? "bg-gray-500"
                  : "bg-blue-500"
              }`}
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
