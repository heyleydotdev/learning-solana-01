import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert, expect } from "chai";
import { Contract } from "../target/types/contract";

describe("contract", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Contract as Program<Contract>;
  const provider = program.provider;
  const programId = program.programId;
  const wallet = (provider as unknown as { wallet: anchor.Wallet }).wallet;
  const user = wallet.payer;

  const id = anchor.web3.Keypair.generate().publicKey;
  const content = "first todo";

  const [todoEntry] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("todo_seeds"), id.toBuffer(), user.publicKey.toBuffer()],
    programId
  );

  it("Create todo", async () => {
    await program.methods
      .createTodo(id, content)
      .accounts({ user: user.publicKey })
      .signers([user])
      .rpc();

    const createdTodo = await program.account.toDoState.fetch(todoEntry);

    assert.ok(createdTodo.id.equals(id));
    assert.ok(createdTodo.user.equals(user.publicKey));
    assert.ok(createdTodo.content === content);
  });

  it("Delete todo", async () => {
    await program.methods
      .deleteTodo(id)
      .accounts({ user: user.publicKey })
      .rpc();

    try {
      await program.account.toDoState.fetch(todoEntry);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      if (error instanceof Error) {
        expect(
          error.message.startsWith("Account does not exist or has no data")
        ).to.be.true;
      }
    }
  });
});
