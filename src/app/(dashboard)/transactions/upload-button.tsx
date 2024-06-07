import React from 'react'
import { Upload } from 'lucide-react'
import { useCSVReader } from "react-papaparse"
import { Button } from '@/components/ui/button';

type Props = {
   onUpload: (results: any) => void;
}

const UploadButton = ({ onUpload }: Props) => {
   const { CSVReader } = useCSVReader();

   // Todo: Add a paywall
   return (
      <CSVReader onUploadAccepted={onUpload}>
         {({ getRootProps }: any) => (
            <Button className='w-full h-auto font-normal text-sm lg:w-auto bg-neutral-950 rounded text-white' {...getRootProps()}>
               <Upload className='size-4 mr-2 text-neutral-100' />
               Import
            </Button>
         )}
      </CSVReader>
   )
}

export default UploadButton
