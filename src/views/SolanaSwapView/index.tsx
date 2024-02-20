import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { HomeIcon, UserIcon } from "@heroicons/react/outline";
import orderBy from "lodash.orderby";

import { Loader, SelectAndConnectWalletButton } from "components";
import * as anchor from "@project-serum/anchor";

import { SolanaLogo } from "components";
import styles from "./index.module.css";
import { swap } from "./swap";
import { useProgram } from "./useProgram";
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createMintToInstruction, createTransferInstruction, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { SPL_TOKEN_PROGRAM_ID, splTokenProgram } from "@coral-xyz/spl-token";
import { getNextUnusedStakeReceiptNonce } from "@mithraic-labs/token-staking";
import { SplTokenStaking } from "./spl_token_staking";

const endpoint = "https://explorer-api.devnet.solana.com";

const connection = new anchor.web3.Connection(endpoint);

export const SolanaSwapView: FC = ({ }) => {
  const [isAirDropped, setIsAirDropped] = useState(false);
  const wallet = useAnchorWallet();


  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
          <div className="flex-none">
            <button className="btn btn-square btn-ghost">
              <span className="text-4xl">🌔</span>
            </button>
          </div>
          <div className="flex-1 px-2 mx-2">
            <div className="text-sm breadcrumbs">
              <ul className="text-xl">

                <li>
                  <span className="opacity-40">minh352623</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-none">
            <WalletMultiButton className="btn btn-ghost" />
          </div>
        </div>

        <div className="text-center pt-2">
          <div className="hero min-h-16 pt-4">
            <div className="text-center hero-content">
              <div className="max-w-lg">
                <h1 className="mb-5 text-5xl">
                  Swap SOL for MOVE <SolanaLogo />
                </h1>

                <p>1 SOL = 10 MOVE</p>
              </div>
            </div>
          </div>
        </div>



        <div className="flex justify-center">
          {!wallet ? (
            <SelectAndConnectWalletButton onUseWalletClick={() => { }} />
          ) : (
            <SwapScreen />
          )}
        </div>
      </div>
    </div>
  );
};

const SwapScreen = () => {
  const wallet: any = useAnchorWallet();
  const [swaps, setSwaps] = useState<unknown[]>([]);
  const { program } = useProgram({ connection, wallet });
  const [lastUpdatedTime, setLastUpdatedTime] = useState<number>();

  useEffect(() => {
  }, [wallet, lastUpdatedTime]);




  const onSwapSent = (swapEvent: unknown) => {
    setSwaps((prevState) => ({
      ...prevState,
      swapEvent,
    }));
  };

  return (
    <div className="rounded-lg flex justify-center">

      <div className="flex flex-col items-center justify-center">
        <div className="text-xs">
          <NetSwap onSwapSent={onSwapSent} />

        </div>

      </div>
    </div>
  );
};

type NetSwap = {
  onSwapSent: (t: any) => void;
};

const NetSwap: FC<NetSwap> = ({ onSwapSent }) => {
  const wallet: any = useAnchorWallet();
  const wallet2 = useWallet()
  const { program } = useProgram({ connection, wallet });
  const [content, setContent] = useState<string>("");
  const [value, setValue] = useState<any>(0)
  const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value) {
      setContent(value);
    }
  };

  const onSwapClick = async () => {
    if (!program) return;

    const amount = new anchor.BN(Number(value) * (10**9));

    const swap_result = await swap({
      program,
      wallet,
      amount
    });


    console.log("New swap transaction succeeded: ", swap_result);
    setContent("");
    onSwapSent(swap_result);
  };

  const depositStakingSplToken = async () => {
    try {
      if (!program) return;
      const stakePoolNonce = 77; // TODO unique global nonce generation?
      const mintToBeStaked = new anchor.web3.PublicKey(
        "4RbTu1sNQ8tHcc69NxTj75FsAx64uVpaDnupjmMC2hZu"
      );
      const TEST_MINT_DECIMALS = 9;
      
      const rewardMint1 = new anchor.web3.PublicKey("J6boRtivt7qxWpMQHECpbzsZ6sUPLUDEMek8EeGLuCpY")
      const stakePoolKey =new  anchor.web3.PublicKey("GtEzn2dvh2JKk6f92nStA5xa1fQKEnhBo66gPFiPcLdG")
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ vaultKey:", vaultKey.toString())
      const [stakeMint] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("stakeMint", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ stakeMint:", stakeMint.toString())

      // const stakeMintAccountKey = getAssociatedTokenAddressSync(
      //   stakeMint,
      //   wallet.publicKey,
      //   false,
      //   TOKEN_PROGRAM_ID
      // );
      // await importToken(stakeMint.toString())
      const stakeMintAccountKey = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        stakeMint,
        wallet.publicKey,
        false,
      );

      console.log("🚀 ~ depositStakingSplToken ~ stakeMintAccountKey:", stakeMintAccountKey.toString())
      // console.log("🚀 ~ depositStakingSplToken ~ stakeMintAccountKey2:", stakeMintAccountKey2.address.toString())
  
      const mintToBeStakedAccount = getAssociatedTokenAddressSync(
        mintToBeStaked,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );
      console.log("🚀 ~ depositStakingSplToken ~ mintToBeStakedAccount:", mintToBeStakedAccount.toString())

      const deposit1Amount = new anchor.BN(2_000_000_000);
      const minDuration = new anchor.BN(1000);
   
  
      // deposit
  
      const nextNonce = await getNextUnusedStakeReceiptNonce(
        program.provider.connection,
        program.programId,
        wallet.publicKey,
        stakePoolKey
      );
      // const nextNonce = 0;
      console.log("🚀 ~ depositStakingSplToken ~ nextNonce:", nextNonce)

      const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          stakePoolKey.toBuffer(),
          new anchor.BN(nextNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );

      console.log("🚀 ~ depositStakingSplToken ~ stakeReceiptKey:", stakeReceiptKey.toString())
      const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakePoolKey.toBuffer(),
          rewardMint1.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ rewardVaultKey:", rewardVaultKey.toString())
  
      const rewardsTransferAmount = new anchor.BN(1_000_000_000);
      const rewardsPerEffectiveStake = rewardsTransferAmount.div(deposit1Amount);
      console.log("🚀 ~ depositStakingSplToken ~ rewardsPerEffectiveStake:", Number(rewardsPerEffectiveStake))
      const transferIx = createTransferInstruction(
        getAssociatedTokenAddressSync(rewardMint1,new anchor.web3.PublicKey("3s44iXti5YBBxA5kP8h7L8LCEeVTh3Wd6LAF9r3Vv8tT")),
        rewardVaultKey,
        new anchor.web3.PublicKey("3s44iXti5YBBxA5kP8h7L8LCEeVTh3Wd6LAF9r3Vv8tT"),
        rewardsTransferAmount.toNumber()
      );

      await program.methods
        .deposit(nextNonce, deposit1Amount, minDuration)
        .accounts({
          payer: wallet.publicKey,
          owner: wallet.publicKey,
          from: mintToBeStakedAccount,
          stakeMint,
          stakePool: stakePoolKey,
          vault: vaultKey,
          destination: stakeMintAccountKey.address,
          stakeDepositReceipt: stakeReceiptKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .remainingAccounts([
          {
            pubkey: rewardVaultKey,
            isWritable: false,
            isSigner: false,
          },
        ])
        // .preInstructions([transferIx])
        // .signers([keypair])
        .rpc({ skipPreflight: true });
      // const [
      //   mintToBeStakedAccountAfter,
      //   vault,
      //   stakeMintAccount,
      //   stakeReceipt,
      //   stakePool,
      // ] = await Promise.all([
      //   tokenProgram.account.account.fetch(mintToBeStakedAccount),
      //   tokenProgram.account.account.fetch(vaultKey),
      //   tokenProgram.account.account.fetch(stakeMintAccountKey),
      //   program.account.stakeDepositReceipt.fetch(stakeReceiptKey),
      //   program.account.stakePool.fetch(stakePoolKey),
      // ]);
      // console.log({  mintToBeStakedAccountAfter,
      //   vault,
      //   stakeMintAccount,
      //   stakeReceipt,
      //   stakePool,});
      
    } catch (e) {
      console.log("🚀 ~ depositStakingSplToken ~ e:", e);
    }
  };
  console.log(value)
  function isNumeric(value:any) {
    return /^[0-9]{0,9}(\.[0-9]{1,2})?$/.test(value);
  }

  const importToken = async (contractAddress: string, onDone?: (tx?: string) => any)=> {
    try {
      console.log("importToken contractAddress", contractAddress);
      const tokenMintAddress = new anchor.web3.PublicKey(contractAddress);
      console.log("importToken tokenMintAddress", tokenMintAddress);
      const associatedToken = getAssociatedTokenAddressSync(
        tokenMintAddress,
        wallet.publicKey as any as anchor.web3.PublicKey,
        false
      );
      const transaction = new anchor.web3.Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey as any as anchor.web3.PublicKey,
          associatedToken,
          wallet.publicKey as any as anchor.web3.PublicKey,
          tokenMintAddress
        )
      );
      const tx = await wallet2.sendTransaction(
        transaction,
        connection
      );
      if (tx) {
        onDone && onDone(tx);
      }
      console.log("importToken", tx);
      return tx;
    } catch (err) {
      console.log("importToken", err);
    }
  }

  const withfraw = async(receiptNonceNumber:number)=>{
    try{
      if (!program) return;
      const mintToBeStaked = new anchor.web3.PublicKey(
        "4RbTu1sNQ8tHcc69NxTj75FsAx64uVpaDnupjmMC2hZu"
      );
      const TEST_MINT_DECIMALS = 9;
      
      const rewardMint1 = new anchor.web3.PublicKey("J6boRtivt7qxWpMQHECpbzsZ6sUPLUDEMek8EeGLuCpY")
      const stakePoolKey =new  anchor.web3.PublicKey("GtEzn2dvh2JKk6f92nStA5xa1fQKEnhBo66gPFiPcLdG")
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ vaultKey:", vaultKey.toString())
      const [stakeMint] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("stakeMint", "utf-8")],
        program.programId
      );
      // await importToken("J6boRtivt7qxWpMQHECpbzsZ6sUPLUDEMek8EeGLuCpY")
      const stakeMintAccountKey = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        stakeMint,
        wallet.publicKey,
        false,
      );
      const receiptNonce = receiptNonceNumber;
      console.log("🚀 ~ withfraw ~ receiptNonce:", receiptNonce)
      const mintToBeStakedAccount = getAssociatedTokenAddressSync(
        mintToBeStaked,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );
      const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          stakePoolKey.toBuffer(),
          new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );
      const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakePoolKey.toBuffer(),
          rewardMint1.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );


      const depositorReward1AccountKey = getAssociatedTokenAddressSync(
        rewardMint1,
        wallet.publicKey
      );
      await program.methods
      .withdraw()
      .accounts({
        claimBase: {
          owner: wallet.publicKey,
          stakePool: stakePoolKey,
          stakeDepositReceipt: stakeReceiptKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        vault: vaultKey,
        stakeMint,
        from: stakeMintAccountKey.address,
        destination: mintToBeStakedAccount,
      })
      .remainingAccounts([
        {
          pubkey: rewardVaultKey,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: depositorReward1AccountKey,
          isWritable: true,
          isSigner: false,
        },
      ])
      .rpc({ skipPreflight: true });
    }catch (err) {
    console.log("🚀 ~ withfraw ~ err:", err)
    }
  }

  const claimReward = async  (receiptNonceNumber:number) => {
    try{
      if (!program) return;

      const mintToBeStaked = new anchor.web3.PublicKey(
        "4RbTu1sNQ8tHcc69NxTj75FsAx64uVpaDnupjmMC2hZu"
      );
      const TEST_MINT_DECIMALS = 9;
      
      const rewardMint1 = new anchor.web3.PublicKey("J6boRtivt7qxWpMQHECpbzsZ6sUPLUDEMek8EeGLuCpY")
      const stakePoolKey =new  anchor.web3.PublicKey("GtEzn2dvh2JKk6f92nStA5xa1fQKEnhBo66gPFiPcLdG")
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ vaultKey:", vaultKey.toString())
      const receiptNonce = receiptNonceNumber;

      const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          stakePoolKey.toBuffer(),
          new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );
    
      const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakePoolKey.toBuffer(),
          rewardMint1.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );
      const depositorReward1AccountKey = getAssociatedTokenAddressSync(
        rewardMint1,
        wallet.publicKey
      );
      console.log("🚀 ~ claimReward ~ depositorReward1AccountKey:", depositorReward1AccountKey)

      await program.methods
      .claimAll()
      .accounts({
        claimBase: {
          owner: wallet.publicKey,
          stakePool: stakePoolKey,
          stakeDepositReceipt: stakeReceiptKey,
          tokenProgram: TOKEN_PROGRAM_ID
        },
      
      })
      .remainingAccounts([
        {
          pubkey: rewardVaultKey,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: depositorReward1AccountKey,
          isWritable: true,
          isSigner: false,
        },
      ])
      .rpc({ skipPreflight: true });
    }catch(err) {
    console.log("🚀 ~ claimReward ~ err:", err)
    }
  }

  const infoReceipt = async (receiptNonce: number) => {
    if (!program) return;
    const provider = new anchor.AnchorProvider(connection, wallet,{ commitment: "confirmed" });

    const tokenProgram = splTokenProgram({ programId: TOKEN_PROGRAM_ID, provider:provider as any });

    const stakePoolKey =new  anchor.web3.PublicKey("GtEzn2dvh2JKk6f92nStA5xa1fQKEnhBo66gPFiPcLdG");
    const rewardMint1 = new anchor.web3.PublicKey("J6boRtivt7qxWpMQHECpbzsZ6sUPLUDEMek8EeGLuCpY")
    
  const depositerReward1AccKey = getAssociatedTokenAddressSync(
    rewardMint1,
    wallet.publicKey
  );
    const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        wallet.publicKey.toBuffer(),
        stakePoolKey.toBuffer(),
        new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
        Buffer.from("stakeDepositReceipt", "utf-8"),
      ],
      program.programId
    );


    const [depositerReward1Account, stakeReceipt, stakePool] =
      await Promise.all([
        tokenProgram.account.account.fetch(depositerReward1AccKey),
        program.account.stakeDepositReceipt.fetch(stakeReceiptKey),
        program.account.stakePool.fetch(stakePoolKey),
      ]);

      console.log("🚀 ~ infoReceipt ~ depositerReward1Account:", depositerReward1Account)
      console.log("🚀 ~ infoReceipt ~ stakeReceipt:", Number(stakeReceipt.depositAmount))
      console.log("🚀 ~ infoReceipt ~ stakeReceipt:", Number(stakeReceipt.lockupDuration))
      console.log("🚀 ~ infoReceipt ~ stakeReceipt:", Number(stakeReceipt.depositTimestamp))
      console.log("date", new Date((Number(stakeReceipt.lockupDuration) + Number(stakeReceipt.depositTimestamp) )* 1000));
      

      console.log("🚀 ~ infoReceipt ~ stakeReceipt:", (stakeReceipt))

      console.log("🚀 ~ infoReceipt ~ stakePool:", stakePool);
      console.log("claim amount");
      
      (stakeReceipt as any)?.claimedAmounts.forEach((item:any)=>{
        console.log(Number(item));
        
      })

  }


  const addReward = async ()=>{
    if (!program) return;
    const provider = new anchor.AnchorProvider(connection, wallet,{ commitment: "confirmed" });

    const pr0_pub = new anchor.web3.PublicKey("3s44iXti5YBBxA5kP8h7L8LCEeVTh3Wd6LAF9r3Vv8tT")
    const stakePoolKey =new  anchor.web3.PublicKey("GtEzn2dvh2JKk6f92nStA5xa1fQKEnhBo66gPFiPcLdG");
    const rewardMint1 = new anchor.web3.PublicKey("J6boRtivt7qxWpMQHECpbzsZ6sUPLUDEMek8EeGLuCpY");
    const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        stakePoolKey.toBuffer(),
        rewardMint1.toBuffer(),
        Buffer.from("rewardVault", "utf-8"),
      ],
      program.programId
    );
    const totalReward1 = 10_000_000_000;
    const transferIx = createTransferInstruction(
      getAssociatedTokenAddressSync(rewardMint1, pr0_pub),
      rewardVaultKey,
      pr0_pub,
      totalReward1
    );

    // transfer 1 reward token to RewardPool at index 0
    await wallet2.sendTransaction(
      new anchor.web3.Transaction()
        .add(transferIx),
        connection
    );
  }

//
  const inittialPool = async () =>{
    try{
    if (!program) return;
      const SCALE_FACTOR_BASE = 1000000000;
      const nonce = 33;
    const mintToBeStaked = new anchor.web3.PublicKey(
      "DkuNXi6GNDBLQo5piaQJZEF6dNxLahpbXRCAg3j6DLYn"
    );
    const authority = wallet.publicKey;
    const [stakePoolKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        new anchor.BN(nonce).toArrayLike(Buffer, "le", 1),
        mintToBeStaked.toBuffer(),
        authority.toBuffer(),
        Buffer.from("stakePool", "utf-8"),
      ],
      program.programId
    );
    console.log("🚀 ~ inittialPool ~ stakePoolKey:", stakePoolKey.toString())
    const [stakeMintKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [stakePoolKey.toBuffer(), Buffer.from("stakeMint", "utf-8")],
      program.programId
    );
    const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [stakePoolKey.toBuffer(), Buffer.from("vault", "utf-8")],
      program.programId
    );

    const minDuration = new anchor.BN(0);
    const maxDuration = new anchor.BN(31536000); // 1 year in seconds
    const maxWeight = new anchor.BN(4 * parseInt(SCALE_FACTOR_BASE.toString()));
    await program.methods
      .initializeStakePool(nonce, maxWeight, minDuration, maxDuration)
      .accounts({
        payer: wallet.publicKey,
        authority: authority,
        stakePool: stakePoolKey,
        stakeMint: stakeMintKey,
        mint: mintToBeStaked,
        vault: vaultKey,
        tokenProgram: SPL_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
      setTimeout(async ()=>{
        const stakePoolKey = new  anchor.web3.PublicKey("D6n38j1Vjv5HMdkME1xHYvFMMKZFgJMjZWbMWumAUvkp")
        const [stakePool ] = await Promise.all([
          program.account.stakePool.fetch(stakePoolKey),
        ]);
    
        console.log("🚀 ~ it ~ stakePool:", stakePool);
        console.log({
          authority: (stakePool as any).authority.toString(),
          mint: (stakePool as any).mint.toString(),
          stakeMint: (stakePool as any).stakeMint.toString(),
          vault: (stakePool as any).vault.toString(),
          creator: (stakePool as any).creator.toString(),
          totalWeightedStake: Number((stakePool as any).totalWeightedStake),
          baseWeight: (stakePool as any).baseWeight,
          maxWeight: (stakePool as any).maxWeight,
          minDuration: (stakePool as any).minDuration,
          maxDuration: (stakePool as any).maxDuration,
        });
      },2000)
    }catch(err) {
    console.log("🚀 ~ inittialPool ~ err:", err)
    }
  }

  const addRewardPool = async () =>{
    try{
    if (!program) return;
      const rewardPoolIndex  = 1
      const _authority = wallet.publicKey
    const stakePoolKey = new anchor.web3.PublicKey("D6n38j1Vjv5HMdkME1xHYvFMMKZFgJMjZWbMWumAUvkp");
    const rewardMint = new anchor.web3.PublicKey("7znV6ugwiUDqP7jiBUk1gp3dKFTUztcKMQ5dwcLMgfwm");
    const rewardMint2 = new anchor.web3.PublicKey("Dxp4GchCUraGabfdkPd1DJonSSrir3166y6T61rECqTd");

    const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        stakePoolKey.toBuffer(),
        rewardMint2.toBuffer(),
        Buffer.from("rewardVault", "utf-8"),
      ],
      program.programId
    );
    console.log("🚀 ~ addRewardPool ~ rewardVaultKey:", rewardVaultKey.toString())
    return program.methods
      .addRewardPool(rewardPoolIndex)
      .accounts({
        payer: wallet.publicKey,
        authority: _authority,
        rewardMint:rewardMint2,
        stakePool: stakePoolKey,
        rewardVault: rewardVaultKey,
        tokenProgram: SPL_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    }catch(err) {
    console.log("🚀 ~ addRewardPool ~ err:", err)
    }
  }

  const depositStakingSplToken2 = async () => {
    try {
      if (!program) return;
      const stakePoolNonce = 77; // TODO unique global nonce generation?
      const mintToBeStaked = new anchor.web3.PublicKey(
        "DkuNXi6GNDBLQo5piaQJZEF6dNxLahpbXRCAg3j6DLYn"
      );
      const TEST_MINT_DECIMALS = 9;
      
      const rewardMint1 = new anchor.web3.PublicKey("7znV6ugwiUDqP7jiBUk1gp3dKFTUztcKMQ5dwcLMgfwm")
    const rewardMint2 = new anchor.web3.PublicKey("Dxp4GchCUraGabfdkPd1DJonSSrir3166y6T61rECqTd");

      const stakePoolKey =new  anchor.web3.PublicKey("D6n38j1Vjv5HMdkME1xHYvFMMKZFgJMjZWbMWumAUvkp")
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ vaultKey:", vaultKey.toString())
      const [stakeMint] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("stakeMint", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ stakeMint:", stakeMint.toString())

      // const stakeMintAccountKey = getAssociatedTokenAddressSync(
      //   stakeMint,
      //   wallet.publicKey,
      //   false,
      //   TOKEN_PROGRAM_ID
      // );
      // await importToken(stakeMint.toString());
      const stakeMintAccountKey = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        stakeMint,
        wallet.publicKey,
        false,
      );

      console.log("🚀 ~ depositStakingSplToken ~ stakeMintAccountKey:", stakeMintAccountKey.address.toString())
      // console.log("🚀 ~ depositStakingSplToken ~ stakeMintAccountKey2:", stakeMintAccountKey2.address.toString())
  
      const mintToBeStakedAccount = getAssociatedTokenAddressSync(
        mintToBeStaked,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );
      console.log("🚀 ~ depositStakingSplToken ~ mintToBeStakedAccount:", mintToBeStakedAccount.toString())

      const deposit1Amount = new anchor.BN(3_000_000_000);
      const minDuration = new anchor.BN(31536000/4);
   
  
      // deposit
  
      const nextNonce = await getNextUnusedStakeReceiptNonce(
        program.provider.connection,
        program.programId,
        wallet.publicKey,
        stakePoolKey
      );
      // const nextNonce = 0;
      console.log("🚀 ~ depositStakingSplToken ~ nextNonce:", nextNonce)

      const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          stakePoolKey.toBuffer(),
          new anchor.BN(nextNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );

      console.log("🚀 ~ depositStakingSplToken ~ stakeReceiptKey:", stakeReceiptKey.toString())
      const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakePoolKey.toBuffer(),
          rewardMint1.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );

      const [rewardVaultKey2] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakePoolKey.toBuffer(),
          rewardMint2.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ rewardVaultKey:", rewardVaultKey.toString())
  
      const rewardsTransferAmount = new anchor.BN(1_000_000_000);
      const rewardsPerEffectiveStake = rewardsTransferAmount.div(deposit1Amount);
      console.log("🚀 ~ depositStakingSplToken ~ rewardsPerEffectiveStake:", Number(rewardsPerEffectiveStake))
      const transferIx = createTransferInstruction(
        getAssociatedTokenAddressSync(rewardMint1,new anchor.web3.PublicKey("3s44iXti5YBBxA5kP8h7L8LCEeVTh3Wd6LAF9r3Vv8tT")),
        rewardVaultKey,
        new anchor.web3.PublicKey("3s44iXti5YBBxA5kP8h7L8LCEeVTh3Wd6LAF9r3Vv8tT"),
        rewardsTransferAmount.toNumber()
      );

      await program.methods
        .deposit(nextNonce, deposit1Amount, minDuration)
        .accounts({
          payer: wallet.publicKey,
          owner: wallet.publicKey,
          from: mintToBeStakedAccount,
          stakeMint,
          stakePool: stakePoolKey,
          vault: vaultKey,
          destination: stakeMintAccountKey.address,
          stakeDepositReceipt: stakeReceiptKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .remainingAccounts([
          {
            pubkey: rewardVaultKey,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: rewardVaultKey2,
            isWritable: false,
            isSigner: false,
          },
        ])
        // .preInstructions([transferIx])
        // .signers([keypair])
        .rpc({ skipPreflight: true });
      // const [
      //   mintToBeStakedAccountAfter,
      //   vault,
      //   stakeMintAccount,
      //   stakeReceipt,
      //   stakePool,
      // ] = await Promise.all([
      //   tokenProgram.account.account.fetch(mintToBeStakedAccount),
      //   tokenProgram.account.account.fetch(vaultKey),
      //   tokenProgram.account.account.fetch(stakeMintAccountKey),
      //   program.account.stakeDepositReceipt.fetch(stakeReceiptKey),
      //   program.account.stakePool.fetch(stakePoolKey),
      // ]);
      // console.log({  mintToBeStakedAccountAfter,
      //   vault,
      //   stakeMintAccount,
      //   stakeReceipt,
      //   stakePool,});
      
    } catch (e) {
      console.log("🚀 ~ depositStakingSplToken ~ e:", e);
    }
  };

  const addReward2 = async ()=>{
    if (!program) return;
    const provider = new anchor.AnchorProvider(connection, wallet,{ commitment: "confirmed" });

    const pr0_pub = wallet.publicKey;
    const stakePoolKey =new  anchor.web3.PublicKey("D6n38j1Vjv5HMdkME1xHYvFMMKZFgJMjZWbMWumAUvkp");
    const rewardMint1 = new anchor.web3.PublicKey("7znV6ugwiUDqP7jiBUk1gp3dKFTUztcKMQ5dwcLMgfwm");
    const rewardMint2 = new anchor.web3.PublicKey("Dxp4GchCUraGabfdkPd1DJonSSrir3166y6T61rECqTd");

    const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        stakePoolKey.toBuffer(),
        rewardMint2.toBuffer(),
        Buffer.from("rewardVault", "utf-8"),
      ],
      program.programId
    );
    const totalReward1 = 10_000_000_000;
    const transferIx = createTransferInstruction(
      getAssociatedTokenAddressSync(rewardMint2, pr0_pub),
      rewardVaultKey,
      pr0_pub,
      totalReward1
    );

    // transfer 1 reward token to RewardPool at index 0
    await wallet2.sendTransaction(
      new anchor.web3.Transaction()
        .add(transferIx),
        connection
    );
  }


  const withfraw2 = async(receiptNonceNumber:number)=>{
    try{
      if (!program) return;
      const mintToBeStaked = new anchor.web3.PublicKey(
        "DkuNXi6GNDBLQo5piaQJZEF6dNxLahpbXRCAg3j6DLYn"
      );
      const TEST_MINT_DECIMALS = 9;
      
      const rewardMint1 = new anchor.web3.PublicKey("7znV6ugwiUDqP7jiBUk1gp3dKFTUztcKMQ5dwcLMgfwm")
      const rewardMint2 = new anchor.web3.PublicKey("Dxp4GchCUraGabfdkPd1DJonSSrir3166y6T61rECqTd");

      const stakePoolKey =new  anchor.web3.PublicKey("D6n38j1Vjv5HMdkME1xHYvFMMKZFgJMjZWbMWumAUvkp")
      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ vaultKey:", vaultKey.toString())
      const [stakeMint] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("stakeMint", "utf-8")],
        program.programId
      );
      // await importToken("J6boRtivt7qxWpMQHECpbzsZ6sUPLUDEMek8EeGLuCpY")
      const stakeMintAccountKey = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        stakeMint,
        wallet.publicKey,
        false,
      );
      const receiptNonce = receiptNonceNumber;
      console.log("🚀 ~ withfraw ~ receiptNonce:", receiptNonce)
      const mintToBeStakedAccount = getAssociatedTokenAddressSync(
        mintToBeStaked,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );
      const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          stakePoolKey.toBuffer(),
          new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );
      const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakePoolKey.toBuffer(),
          rewardMint1.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );


      const depositorReward1AccountKey = getAssociatedTokenAddressSync(
        rewardMint1,
        wallet.publicKey
      );

      const [rewardVaultKey2] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakePoolKey.toBuffer(),
          rewardMint2.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );


      const depositorReward1AccountKey2 = getAssociatedTokenAddressSync(
        rewardMint2,
        wallet.publicKey
      );
      await program.methods
      .withdraw()
      .accounts({
        claimBase: {
          owner: wallet.publicKey,
          stakePool: stakePoolKey,
          stakeDepositReceipt: stakeReceiptKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        vault: vaultKey,
        stakeMint,
        from: stakeMintAccountKey.address,
        destination: mintToBeStakedAccount,
      })
      .remainingAccounts([
        {
          pubkey: rewardVaultKey,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: depositorReward1AccountKey,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: rewardVaultKey2,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: depositorReward1AccountKey2,
          isWritable: true,
          isSigner: false,
        },
      ])
      .rpc({ skipPreflight: true });
    }catch (err) {
    console.log("🚀 ~ withfraw ~ err:", err)
    }
  }

  const claimReward2 = async  (receiptNonceNumber:number) => {
    try{
      if (!program) return;

      const mintToBeStaked = new anchor.web3.PublicKey(
        "DkuNXi6GNDBLQo5piaQJZEF6dNxLahpbXRCAg3j6DLYn"
      );
      const TEST_MINT_DECIMALS = 9;
      
      const rewardMint1 = new anchor.web3.PublicKey("7znV6ugwiUDqP7jiBUk1gp3dKFTUztcKMQ5dwcLMgfwm")
      const stakePoolKey =new  anchor.web3.PublicKey("D6n38j1Vjv5HMdkME1xHYvFMMKZFgJMjZWbMWumAUvkp")
      const rewardMint2 = new anchor.web3.PublicKey("Dxp4GchCUraGabfdkPd1DJonSSrir3166y6T61rECqTd");

      const [vaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [stakePoolKey.toBuffer(), Buffer.from("vault", "utf-8")],
        program.programId
      );
      console.log("🚀 ~ depositStakingSplToken ~ vaultKey:", vaultKey.toString())
      const receiptNonce = receiptNonceNumber;

      const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          wallet.publicKey.toBuffer(),
          stakePoolKey.toBuffer(),
          new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
          Buffer.from("stakeDepositReceipt", "utf-8"),
        ],
        program.programId
      );
    
      const [rewardVaultKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakePoolKey.toBuffer(),
          rewardMint1.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );
      const [rewardVaultKey2] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          stakePoolKey.toBuffer(),
          rewardMint2.toBuffer(),
          Buffer.from("rewardVault", "utf-8"),
        ],
        program.programId
      );
      const depositorReward1AccountKey = getAssociatedTokenAddressSync(
        rewardMint1,
        wallet.publicKey
      );
      const depositorReward1AccountKey2 = getAssociatedTokenAddressSync(
        rewardMint2,
        wallet.publicKey
      );
      console.log("🚀 ~ claimReward ~ depositorReward1AccountKey:", depositorReward1AccountKey)

      await program.methods
      .claimAll()
      .accounts({
        claimBase: {
          owner: wallet.publicKey,
          stakePool: stakePoolKey,
          stakeDepositReceipt: stakeReceiptKey,
          tokenProgram: TOKEN_PROGRAM_ID
        },
      
      })
      .remainingAccounts([
        {
          pubkey: rewardVaultKey,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: depositorReward1AccountKey,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: rewardVaultKey2,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: depositorReward1AccountKey2,
          isWritable: true,
          isSigner: false,
        },
      ])
      .rpc({ skipPreflight: true });
    }catch(err) {
    console.log("🚀 ~ claimReward ~ err:", err)
    }
  }

  const infoReceipt2 = async (receiptNonce: number) => {
    if (!program) return;
    console.log("🚀 ~ infoReceipt2 ~ program:", program)

    const provider = new anchor.AnchorProvider(connection, wallet,{ commitment: "confirmed" });

    const tokenProgram = splTokenProgram({ programId: TOKEN_PROGRAM_ID, provider:provider as any });
    console.log("🚀 ~ infoReceipt2 ~ tokenProgram:", tokenProgram)

    const stakePoolKey =new  anchor.web3.PublicKey("D6n38j1Vjv5HMdkME1xHYvFMMKZFgJMjZWbMWumAUvkp");
    const rewardMint1 = new anchor.web3.PublicKey("7znV6ugwiUDqP7jiBUk1gp3dKFTUztcKMQ5dwcLMgfwm")
    
  const depositerReward1AccKey = getAssociatedTokenAddressSync(
    rewardMint1,
    wallet.publicKey
  );
    const [stakeReceiptKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        wallet.publicKey.toBuffer(),
        stakePoolKey.toBuffer(),
        new anchor.BN(receiptNonce).toArrayLike(Buffer, "le", 4),
        Buffer.from("stakeDepositReceipt", "utf-8"),
      ],
      program.programId
    );


    const [depositerReward1Account, stakeReceipt, stakePool] =
      await Promise.all([
        tokenProgram.account.account.fetch(depositerReward1AccKey),
        program.account.stakeDepositReceipt.fetch(stakeReceiptKey),
        program.account.stakePool.fetch(stakePoolKey),
      ]);

      console.log("🚀 ~ infoReceipt ~ depositerReward1Account:", depositerReward1Account)
      console.log("🚀 ~ infoReceipt ~ stakeReceipt:", Number(stakeReceipt.depositAmount)) // amount stake
      console.log("🚀 ~ infoReceipt ~ effectiveStake:", Number(stakeReceipt.effectiveStake)) // amount after time stake

      console.log("🚀 ~ infoReceipt ~ stakeReceipt time lock:", Number(stakeReceipt.lockupDuration))//time lock
      console.log("🚀 ~ infoReceipt ~ stakeReceipt: time start lock", Number(stakeReceipt.depositTimestamp))//time start lock
      console.log("date Withdrawed", new Date((Number(stakeReceipt.lockupDuration) + Number(stakeReceipt.depositTimestamp) )* 1000)); //date claimed
      

      console.log("🚀 ~ infoReceipt ~ stakeReceipt:", (stakeReceipt))

      console.log("🚀 ~ infoReceipt ~ stakePool:", stakePool);
      console.log("claim amount");
      console.log(Number((stakePool as any).rewardPools[receiptNonce].rewardsPerEffectiveStake));
      
      (stakePool as any)?.rewardPools.forEach((item:any)=>{
        console.log("----------------");
        
        console.log(Number(item.rewardsPerEffectiveStake));
        
      })

  }
  return (
    <div style={{ minWidth: 240 }} className="mb-8 pb-4 border-b border-gray-500 flex ">

      <div className="w-full">
        <input value={value} onChange={(e) => {
          const value = e.target.value 
          console.log(value)
          setValue(value)
          
          
        }
        } placeholder="Enter the SOL amount" className="mb-4"></input>
        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={depositStakingSplToken2}
          style={{ minHeight: 0, height: 40 }}
        >
          Deposit
        </button>
        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={()=>withfraw2(0)}
          style={{ minHeight: 0, height: 40 }}
        >
          Withdraw and claim reward
        </button>

        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={()=>claimReward2(1)}
          style={{ minHeight: 0, height: 40 }}
        >
          Claim Reward
        </button>
        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={()=>infoReceipt2(0)}
          style={{ minHeight: 0, height: 40 }}
        >
         Get Info Reward
        </button>

        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={()=>addReward2()}
          style={{ minHeight: 0, height: 40 }}
        >
         Add Reward
        </button>


        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={()=>inittialPool()}
          style={{ minHeight: 0, height: 40 }}
        >
         init pool stake
        </button>

        <button
          className="btn btn-primary rounded-full normal-case	w-full"
          onClick={()=>addRewardPool()}
          style={{ minHeight: 0, height: 40 }}
        >
         add pool reward
        </button>
      </div>
    </div>
  );
};
