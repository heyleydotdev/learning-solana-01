import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { Contract } from "../target/types/contract";

describe("contract", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Contract as Program<Contract>;
  const provider = program.provider;
  const programId = program.programId;
  const wallet = (provider as unknown as { wallet: anchor.Wallet }).wallet;

  it("Create todo", async () => {
    const user = wallet.payer;
    const id = anchor.web3.Keypair.generate().publicKey;
    const content = "first todo";

    const [todoEntry] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("todo_seeds"), id.toBuffer(), user.publicKey.toBuffer()],
      programId
    );

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
});
