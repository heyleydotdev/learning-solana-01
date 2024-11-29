import ConnectButton from "./components/connect-button";
import CreateForm from "./components/create-form";
import Providers from "./components/providers";
import TodoList from "./components/todo-list";

export default function HomePage() {
  return (
    <Providers>
      <div className="w-full grid grid-cols-1 gap-y-2">
        <ConnectButton />
        <CreateForm />
        <TodoList />
      </div>
    </Providers>
  );
}
