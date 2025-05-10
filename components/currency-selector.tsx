"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const currencies = [
  { code: "XOF", name: "FCFA", symbol: "FCFA" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "USD", name: "Dollar US", symbol: "$" },
]

export default function CurrencySelector() {
  const [currency, setCurrency] = useState(currencies[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center text-sm text-gray-800">
          <span>
            {currency.code} {currency.name}
          </span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {currencies.map((curr) => (
          <DropdownMenuItem key={curr.code} className="cursor-pointer" onClick={() => setCurrency(curr)}>
            <div className="flex items-center justify-between w-full">
              <span>{curr.name}</span>
              <span className="text-muted-foreground">{curr.symbol}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
