import { useWallet } from "@solana/wallet-adapter-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAnchorProgram } from "../hooks/use-anchor";
import React from "react";
import { PublicKey } from "@solana/web3.js";

export default function TodoList() {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 divide-y border bg-white">
      <TodoListInner />
    </div>
  );
}

function TodoListInner() {
  const program = useAnchorProgram();
  const wallet = useWallet();

  const { data, isPending } = useQuery({
    queryKey: ["todo", "all"],
    queryFn: () =>
      program.account.toDoState.all([
        {
          memcmp: {
            // DISCRIMINATOR + ID length
            // IDK better approach, works for now
            offset: 8 + 32,
            bytes: wallet.publicKey!.toBase58(),
          },
        },
      ]),
  });

  if (isPending) {
    return <TodoState>Fetching...</TodoState>;
  }

  if (!data?.length) {
    return <TodoState>No records found.</TodoState>;
  }

  return data.map((item) => (
    <TodoListItem key={item.account.id.toString()}>
      <TodoListItemId>{item.account.id.toString()}</TodoListItemId>
      <TodoListItemContent>{item.account.content}</TodoListItemContent>
      <TodoListItemDelete id={item.account.id} />
    </TodoListItem>
  ));
}

function TodoListItem({ children }: React.PropsWithChildren) {
  return <div className="px-3 py-2 space-y-2">{children}</div>;
}

function TodoListItemId({ children }: React.PropsWithChildren) {
  return <p className="text-xs/6 text-zinc-600 font-mono">{children}</p>;
}

function TodoListItemContent({ children }: React.PropsWithChildren) {
  return <p className="text-sm/6 text-zinc-950">{children}</p>;
}

function TodoListItemDelete({ id }: { id: PublicKey }) {
  const qClient = useQueryClient();
  const program = useAnchorProgram();

  const { mutate } = useMutation({
    mutationFn: () => program.methods.deleteTodo(id).rpc(),
    onSettled: () => {
      qClient.invalidateQueries({ queryKey: ["todo", "all"] });
    },
  });

  return (
    <button
      className="text-[0.8rem] uppercase tracking-wide text-red-600 font-medium"
      onClick={() => mutate()}
    >
      Delete
    </button>
  );
}

function TodoState({ children }: React.PropsWithChildren) {
  return (
    <div className="px-3 py-10 text-center">
      <p className="text-sm/6 text-zinc-500">{children}</p>
    </div>
  );
}
