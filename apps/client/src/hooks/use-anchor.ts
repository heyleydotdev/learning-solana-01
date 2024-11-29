import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
  AnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import IDL from "@lsone/contract/idl";
import { Contract } from "@lsone/contract/types";

export const useAnchorProvider = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  return new AnchorProvider(connection, wallet as AnchorWallet, {});
};

export const useAnchorProgram = () => {
  const provider = useAnchorProvider();

  return new Program(IDL as Contract, provider);
};
