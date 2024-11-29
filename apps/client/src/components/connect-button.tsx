import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function ConnectButton() {
  return (
    <div className="p-4 border bg-white w-full text-center">
      <WalletMultiButton />
    </div>
  );
}
