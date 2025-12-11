import React, { useState } from 'react'

interface uploadProps {
  onUploadComplete: (url: string) => void
}

const Upload = ({ onUploadComplete }: uploadProps) => {

  const [Uploaded, setUploaded] = useState(true);
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const form = new FormData;
    form.append("file", file)

    const res = await fetch('api/upload', {
      method: "POST",
      body: form
    })

    const data: { url?: string, error?: string } = await res.json();

    if (data.error) {
      setUploaded(false);
    } else if (data.url) {
      onUploadComplete(data.url)
    }
  }

  return (
    <div className=''>
      <label
        className="bg-white text-black"
      >
        {Uploaded ? <span>Upload</span> : <span>Upload failed try again</span>}
        <input
          type="file"
          className="hidden mt-4"
          onChange={handleUpload}
        />
      </label>
    </div>
  )
}

export default Upload