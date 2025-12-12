'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { WalletButton } from '../solana/solana-provider'
import { useBasicProgram } from './basic-data-access'
import { BasicCreate } from './basic-ui'
import { AppHero } from '../app-hero'
import { ellipsify } from '@/lib/utils'
import { ChangeEvent, useState } from 'react'
import Upload from './upload'
import { PublicKey } from '@solana/web3.js'

interface EntryFormData {
  title: string,
  entry: string,
  image_url: string
}

export default function BasicFeature() {
  const { publicKey } = useWallet()
  const { programId, createEntry } = useBasicProgram()

  const [Url, setUrl] = useState('');

  const [formData, setFormData] = useState<EntryFormData>({
    title: '',
    entry: '',
    image_url: ''
  })

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      entry: '',
      image_url: ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    console.log(programId.toBase58());
    e.preventDefault()
    if (!publicKey) return;
    const time = Math.floor(
      new Date(Date.now()).getTime() / 1000
    )

    const entry_account = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ENTRY_STATE"),
        Buffer.from(formData.title.trim()),
        publicKey.toBuffer()
      ],
      programId
    )[0]

    createEntry.mutateAsync({
      title: formData.title.trim(),
      entry: formData.entry.trim(),
      imageUrl: "".trim(),
      entry_account: entry_account
    })


    console.log(formData.entry, formData.title);
  }

  return publicKey ? (
    <div>
      <form className='flex flex-col items-center my-5'>
        <input
          type="text"
          placeholder='title'
          name='title'
          value={formData.title}
          onChange={handleInputChange}
          className='bg-white text-black p-4'
        />
        <input
          type="text"
          placeholder='entry'
          name='entry'
          value={formData.entry}
          onChange={handleInputChange}
          className='bg-white text-black p-4 mt-1 h-20'
        />
        <Upload onUploadComplete={(uploadedurl) => setUrl(uploadedurl)} />
        <button
          onClick={handleSubmit}
          className='border p-4 rounded-3xl mt-10'
          disabled={createEntry.isPending}
        >
          click me!
        </button>
      </form>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton className="btn btn-primary" />
        </div>
      </div>
    </div>
  )
}
