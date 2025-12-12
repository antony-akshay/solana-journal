'use client'

import { getBasicProgram, getBasicProgramId } from '@project/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import * as anchor from "@coral-xyz/anchor"
import { toast } from 'sonner'

interface createEntryArgs {
  title: string,
  entry: string,
  imageUrl: string,
  entry_account: PublicKey
}

export function useBasicProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getBasicProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getBasicProgram(provider, programId), [provider, programId])
  const { publicKey } = useWallet();

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const getJournalAccounts = useQuery({
    queryKey: ['journal', { cluster, wallet: publicKey }],
    queryFn: async () => {
      if (!publicKey) return;
      const all = await program.account.journalEntry.all();

      return all.filter(acc => {
        const title = acc.account.title
        const [pda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("ENTRY"),
            Buffer.from(title),
            publicKey.toBuffer()
          ],
          programId
        )

        return acc.publicKey.equals(pda)
      })
    }
  })

  const createEntry = useMutation<string, Error, createEntryArgs>({
    mutationKey: ['create', 'entry', { cluster }],
    mutationFn: ({ title, entry, imageUrl, entry_account }) => (
      program.methods.createEntry(
        title,
        entry,
        new anchor.BN(Math.floor(
          new Date(Date.now()).getTime() / 1000
        )),
        imageUrl
      ).accounts({
        journalAccount: entry_account
      }).rpc()
    ),

    onError: (err) => {
      toast.error(err.toString());
    },
    onSuccess: async (signature) => {
      transactionToast(signature)
      await getJournalAccounts.refetch()
    },
  })


  return {
    program,
    programId,
    getProgramAccount,
    getJournalAccounts,
    createEntry
  }
}
