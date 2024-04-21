import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import BorderLinearProgress from "./BorderLinearProgress";

const CardInfoToken = () => {
  const [progress, setProgress] = useState(50);

  return (
    <div className="p-5 bg-[#2F2F33] rounded-xl flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <img
          src="https://cache.tonapi.io/imgproxy/8mKBa1CjHSWl2GAq1gDdUNZVlmoCe6tiw5Wilx-bzCY/rs:fill:200:200:1/g:no/aHR0cHM6Ly9pLmliYi5jby9RZjZDR3ExL2ltZ29ubGluZS1jb20tdWEtUmVzaXplLXQtVTQtWDAtRlZjLUsxLmpwZw.webp"
          className="w-[62px] h-[62px] rounded-full"
          alt=""
        />
        <div className="flex gap-3">
          <div className="px-2 bg-green-200 rounded-full flex justify-center items-center max-h-[30px] gap-1 text-sm text-green-800">
            <span className="rounded-full w-[8px] h-[8px] bg-green-800"></span>
            <span>Sale Live</span>
          </div>
          <div className="px-2 bg-blue-200 rounded-full flex justify-center items-center max-h-[30px] gap-1 text-sm text-blue-600">
            <span className="rounded-full w-[8px] h-[8px] bg-blue-600"></span>
            <span>Sale Live</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col ">
        <span className="text-xl font-bold">WaveTon</span>
        <span className="text-[16px] text-gray-400">
          1 WaveTON = 0.000004685 TON
        </span>
      </div>
      <div className="flex flex-col ">
        <span className="text-lg text-blue-400 font-bold mt-2">3000 TON</span>

        <span className="text-[16px] text-gray-400">Soft cap</span>
      </div>
      <div className="p-3 border gap-2 flex flex-col border-1 border-gray-500 rounded-lg">
        <div className="flex justify-between">
          <span className="text-gray-400">Liquidity:</span>
          <span>51%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Offered::</span>
          <span>3 500 000 WaveTON</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span>
            Progress <span className="text-gray-400">({progress}%)</span>
          </span>
          <p className="flex gap-1">
            <span>0.00</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">1000 TON</span>
          </p>
        </div>
        <div className="w-full">
          <BorderLinearProgress progress={progress} />
        </div>
      </div>
      <div className="flex gap-3 justify-between">
        <div className="border flex flex-1 justify-center border-gray-500 p-3 text-white rounded-lg">
          08 : 19 : 36 : 12
        </div>
        <Link href={`jetton/fairlaunch/WaveTON`}>
          <button className="bg-blue-500 w-[120px] cursor-pointer hover:scale-105 transition-all rounded-lg font-semibold">
            View
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CardInfoToken;
