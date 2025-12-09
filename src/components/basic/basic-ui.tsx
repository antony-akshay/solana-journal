'use client'

import { useBasicProgram } from './basic-data-access'
import { Button } from '@/components/ui/button'

export function BasicCreate() {

  const {getJournalAccounts} = useBasicProgram()

  if(getJournalAccounts.isLoading) return (
    <div>loading....</div>
  )

  if(getJournalAccounts.error) return (
    <div>some error occured</div>
  )

  const entries = getJournalAccounts.data ?? []

  return (
    //  <div className="space-y-4">
    //   <h1 className="text-xl font-bold">Your Journal Entries</h1>

    //   {entries.length === 0 && (
    //     <div>No entries found.</div>
    //   )}

    //   <ul className="space-y-3">
    //     {entries.map((entry) => (
    //       <li
    //         key={entry.publicKey.toBase58()}
    //         className="border p-4 rounded-lg shadow"
    //       >
    //         <h2 className="font-semibold text-lg">{entry.account.title}</h2>
    //         <p className="text-sm">{entry.account.content}</p>

    //         <span className="text-xs opacity-70">
    //           {/* {new Date(entry.account.timestamp * 1000).toLocaleString()} */}
    //         </span>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    <>
    <div className='border rounded-4xl w-200 h-150 border-4 border-white'>
      <div>
        <input type="text" />
      </div>
    </div>
    </>
  )
}
