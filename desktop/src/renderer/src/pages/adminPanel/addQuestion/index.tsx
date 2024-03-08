import { Inbox } from 'lucide-react'

import { Input } from '@renderer/shadcn/components/ui/input'
import { Label } from '@renderer/shadcn/components/ui/label'
import { Button } from '@renderer/shadcn/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@renderer/shadcn/components/ui/select'
import { Textarea } from '@renderer/shadcn/components/ui/textarea'

function AdminPanelAddQuestion(): JSX.Element {
  return (
    <div className="p-8">
      <h1 className="text-3xl text-gray-800 mb-6">Dodaj Nowe Pytanie</h1>

      <form className="grid grid-cols-1 gap-6 md:px-24 lg:px-36 xl:px-72">
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
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
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
            <Label htmlFor="fileUpload">Zdjęcie / Film</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="fileUpload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                  >
                    <span>Wybierz Plik</span>
                    <input id="fileUpload" name="fileUpload" type="file" className="sr-only" />
                  </label>
                </div>
                <p className="text-xs text-gray-500">Plik z Instrukcją</p>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <Label htmlFor="fileUpload">Plik z instrukcją</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="fileUpload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                  >
                    <span>Wybierz Plik</span>
                    <input id="fileUpload" name="fileUpload" type="file" className="sr-only" />
                  </label>
                </div>
                <p className="text-xs text-gray-500">Plik z Instrukcją</p>
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
