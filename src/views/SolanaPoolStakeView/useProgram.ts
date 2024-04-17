import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { IDL } from "./spl_token_staking-version-2";

// import { IDL } from "./spl_token_staking";


export interface Wallet {
  signTransaction(
    tx: anchor.web3.Transaction
  ): Promise<anchor.web3.Transaction>;
  signAllTransactions(
    txs: anchor.web3.Transaction[]
  ): Promise<anchor.web3.Transaction[]>;
  publicKey: anchor.web3.PublicKey;
}

type ProgramProps = {
  connection: Connection;
  wallet: Wallet;
};

export const useProgram = ({ connection, wallet }: ProgramProps) => {
  const [program, setProgram] = useState<anchor.Program<anchor.Idl>>();

  useEffect(() => {
    updateProgram();
    console.log(program)
  }, [connection, wallet]);

  const updateProgram = () => {
    const provider = new anchor.AnchorProvider(connection, wallet,{ commitment: "confirmed" });
    console.log("provider", provider);

    //version 2

    const programId = new anchor.web3.PublicKey("H2GsXPsK3xrxM2Uy9DKD9oMKdeUW2P11rqPqA9TbAvba")
    const program = new anchor.Program(IDL as any, programId, provider);
    setProgram(program);
  };

  return {
    program,
  };
};
