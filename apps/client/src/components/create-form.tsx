import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { z } from "zod";
import { useAnchorProgram } from "../hooks/use-anchor";

export default function CreateForm() {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return null;
  }

  return <CreateFormInner />;
}

function CreateFormInner() {
  const qClient = useQueryClient();
  const wallet = useWallet();
  const program = useAnchorProgram();

  const [fieldError, setFieldError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (content: string) => {
      const id = Keypair.generate().publicKey;
      return program.methods.createTodo(id, content).rpc();
    },
    onSettled: () => {
      qClient.invalidateQueries({ queryKey: ["todo", "all"] });
    },
  });

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFieldError(null);
    const formData = new FormData(e.currentTarget);
    const parse = z
      .object({
        content: z.string().min(3).max(255),
      })
      .safeParse(Object.fromEntries(formData.entries()));
    if (parse.success) {
      mutate(parse.data.content);
      e.currentTarget.reset();
      return;
    }

    const error = parse.error.flatten().fieldErrors.content?.[0] ?? null;
    setFieldError(error);
  };

  return (
    <form className="p-4 border bg-white" onSubmit={onSubmitHandler}>
      <fieldset className="grid grid-cols-1 gap-2" disabled={isPending}>
        <input
          type="text"
          name="content"
          className="px-3 py-2 border text-sm/6 w-full text-zinc-950 placeholder:text-zinc-500 disabled:opacity-70"
          placeholder="Content...."
        />
        {fieldError && (
          <p className="text-sm/6 text-red-600 font-medium">{fieldError}</p>
        )}
        <button className="px-3 py-2 text-sm/6 bg-purple-800 hover:bg-purple-700 text-white disabled:opacity-70">
          {isPending ? "..." : "Continue"}
        </button>
      </fieldset>
    </form>
  );
}
