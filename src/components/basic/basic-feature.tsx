'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { ChangeEvent, useState } from 'react'
import { WalletButton } from '../solana/solana-provider'
import { useBasicProgram } from './basic-data-access'
import Upload from './upload'
import { Trash2 } from 'lucide-react'

interface EntryFormData {
  title: string,
  entry: string,
  image_url: string
}

export default function BasicFeature() {
  const { publicKey } = useWallet()
  const { programId, createEntry, getJournalAccounts, deleteEntry } = useBasicProgram()
  const entries = getJournalAccounts.data
  const [Url, setUrl] = useState('');
  const [formData, setFormData] = useState<EntryFormData>({
    title: '',
    entry: '',
    image_url: ''
  })
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())
  const toggleEntry = (publicKey: string) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(publicKey)) {
        newSet.delete(publicKey)
      } else {
        newSet.add(publicKey)
      }
      return newSet
    })
  }

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
    setFormData({ title: '', entry: '', image_url: '' })
  }

  const handleDelete = (entry_account: PublicKey, title: string) => {
    deleteEntry.mutateAsync({
      entry_account,
      title
    })
  }


  return publicKey ? (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border-4 border-black p-8 shadow-lg h-120 sticky top-8">
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full h-15 text-black px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600 text-lg"
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
              />
              <textarea
                name="entry"
                placeholder="this is the section for the entry..."
                value={formData.entry}
                onChange={handleInputChange}
                className="w-full text-black px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600 text-lg h-48 resize-none"
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
              />
              {/* <Upload onUploadComplete={(uploadedurl) => setUrl(uploadedurl)} /> */}
              <button
                onClick={handleSubmit}
                disabled={createEntry.isPending}
                className="w-full mt-10 bg-black text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
              >
                publish
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {entries && entries.length > 0 ? (
              entries.map((entry) => {
                const isExpanded = expandedEntries.has(entry.publicKey.toString())

                return (
                  <div
                    key={entry.publicKey.toString()}
                    className="bg-white rounded-3xl border-4 border-black shadow-lg hover:shadow-xl transition-all"
                  >
                    <div
                      onClick={() => toggleEntry(entry.publicKey.toString())}
                      className="cursor-pointer p-6 flex items-center justify-between"
                    >
                      <div className="flex-1 pr-4">
                        <h3
                          className="text-2xl font-bold text-gray-800"
                          style={{ fontFamily: 'Comic Sans MS, cursive' }}
                        >
                          {entry.account.title}
                        </h3>
                        {/* {!isExpanded && (
                <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  {entry.account.timestamp.toString()}
                </p>
              )} */}
                      </div>
                      {/* Dropdown Arrow */}
                      {/* <svg
              className={`w-6 h-6 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg> */}
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className='flex justify-between'>
                        <div className="px-6 pb-6 space-y-4 border-t-2 border-white-200 pt-4">
                        <p
                          className="text-gray-600 text-lg leading-relaxed"
                          style={{ fontFamily: 'Comic Sans MS, cursive' }}
                        >
                          {entry.account.content}
                        </p>
                        <p className="text-gray-500 text-sm" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                          Posted: {entry.account.timestamp.toString()}
                        </p>
                      </div>
                      <div className='px-6 pb-6'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(entry.publicKey, entry.account.title)
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
                          style={{ fontFamily: 'Comic Sans MS, cursive' }}
                        >
                          <Trash2 size={16} color='black'/>
                        </button>
                      </div>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="bg-white rounded-3xl border-4 border-black p-12 shadow-lg text-center">
                <p className="text-2xl text-gray-500" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  no entries yet...
                </p>
                <p className="text-lg text-gray-400 mt-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  write your first entry!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          dear diary
        </h1>
        <WalletButton className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors" />
      </div>
    </div>
  )
}