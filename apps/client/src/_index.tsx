import ConnectButton from "./components/connect-button";
import Providers from "./components/providers";

export default function HomePage() {
  return (
    <Providers>
      <div className="w-full grid grid-cols-1 gap-y-2">
        <ConnectButton />
      </div>
    </Providers>
  );
}
