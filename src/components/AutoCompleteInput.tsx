import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, useState } from 'react'
import Input from './Input.tsx'

interface AutoCompleteInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  options: string[],
  value?: string
}

export default function AutoCompleteInput({ options, value: _value, ...props }: AutoCompleteInputProps) {
  const [value, setValue] = useState(_value ?? "")
  const [selectedOption, setSelectedOption] = useState<string | undefined>("")

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.substring(selectedOption?.length || 0)

    console.log(selectedOption)
    console.log(value)

    const filteredOptions = options.filter(option => option.toLowerCase().startsWith(value.toLowerCase()))

    setSelectedOption(filteredOptions[0] ?? "")
    setValue(value)
  }

  return (
    <Input {...props} value={`${value}${selectedOption?.substring(value.length)}`} onChange={handleChange} />
  )
}
