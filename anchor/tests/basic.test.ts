import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { Basic } from '../target/types/basic'
describe('basic', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())

  const provider = anchor.AnchorProvider.env()
  const program = anchor.workspace.Basic as Program<Basic>

  it('should run the program', async () => {
    // // Add your test here.
    // const tx = await program.methods.greet().rpc()
    // console.log('Your transaction signature', tx)

    const add = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ENTRY_STATE"),
        Buffer.from("test"),
        provider.wallet.publicKey.toBuffer()
      ],
      program.programId
    )[0]

    const tx = await program.methods.createEntry(
      "test",
      "test",
      new anchor.BN(Math.floor(Date.now() / 1000)),
      ""
    )
      .accounts({
        journalAccount: add,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()
    console.log('Your transaction signature', tx)

    const acc = await program.account.journalEntry.fetch(add)
    console.log(acc)

    const tx2 = program.methods.closeEvent().accounts({

    });

  })
})
