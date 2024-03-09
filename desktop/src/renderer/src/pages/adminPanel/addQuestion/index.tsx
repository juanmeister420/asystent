import { FileImage, FilePen, Trash2 } from 'lucide-react'

import { Input } from '@renderer/shadcn/components/ui/input'
import { Label } from '@renderer/shadcn/components/ui/label'
import { Button } from '@renderer/shadcn/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/shadcn/components/ui/select'
import { Textarea } from '@renderer/shadcn/components/ui/textarea'
import { useState } from 'react'

function AdminPanelAddQuestion(): JSX.Element {
  const [imageFileName, setImageFileName] = useState('')
  const [instructionFileName, setInstructionFileName] = useState('')

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImageFileName(file.name)
    }
  }

  const handleInstructionChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setInstructionFileName(file.name)
    }
  }

  const removeImageFile = () => {
    setImageFileName('')
  }

  const removeInstructionFile = () => {
    setInstructionFileName('')
  }
  return (
    <div className="p-8">
      <h1 className="text-3xl text-gray-800 mb-6">Dodaj Nowe Pytanie</h1>

      <form className="grid grid-cols-1 gap-6 md:px-24 lg:px-36 xl:px-96">
        <div className="flex flex-row gap-5">
          <div className="w-full">
            <Label htmlFor="questionName">Nazwa Pytania</Label>
            <Input
              id="questionName"
              type="text"
              placeholder="Dodawanie Promocji Czasowej w PCMarket"
            />
          </div>

          <div>
            <Label htmlFor="questionCategory">Kategoria</Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Wybierz kategorię" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="pcmarket">PCMarket</SelectItem>
                  <SelectItem value="kasa_fiskalna">Kasa Fiskalna</SelectItem>
                  <SelectItem value="drukarka_fiskalna">Drukarka Fiskalna</SelectItem>
                  <SelectItem value="terminal">Terminal Płatniczy</SelectItem>
                  <SelectItem value="other">Inne</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="questionDescription">Opis Pytania</Label>
          <Textarea id="questionDescription" placeholder="Opis Pytania" />
        </div>

        <div className="flex flex-row gap-5">
          <div className="w-1/2">
            <Label htmlFor="imageUpload">Zdjęcie / Film</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FileImage className="mx-auto h-12 w-12 text-orange-600" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="imageUpload"
                    className="relative cursor-pointer border border-orange-600 rounded-md font-medium text-orange-600 focus-within:outline-none p-2"
                  >
                    <span>Wybierz Plik</span>
                    <input
                      id="imageUpload"
                      name="imageUpload"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept=".jpg,.jpeg,.png,.gif,.mp4"
                    />
                  </label>
                  {imageFileName && (
                    <button onClick={removeImageFile} className="ml-2">
                      <Trash2 className="text-orange-600" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500">{imageFileName || '.jpg, .png, .gif, .mp4'}</p>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <Label htmlFor="instructionUpload">Plik z instrukcją</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FilePen className="mx-auto h-12 w-12 text-orange-600" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="instructionUpload"
                    className="relative cursor-pointer border border-orange-600 rounded-md font-medium text-orange-600 focus-within:outline-none p-2"
                  >
                    <span>Wybierz Plik</span>
                    <input
                      id="instructionUpload"
                      name="instructionUpload"
                      type="file"
                      className="sr-only"
                      onChange={handleInstructionChange}
                      accept=".pdf,.md"
                    />
                  </label>
                  {instructionFileName && (
                    <button onClick={removeInstructionFile}>
                      <Trash2 className="text-orange-600" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500">{instructionFileName || '.pdf, .md'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button type="submit" variant="default" className="w-1/2">
            Przejdź Dalej
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AdminPanelAddQuestion
