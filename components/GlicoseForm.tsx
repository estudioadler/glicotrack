"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { useSettings } from "@/contexts/SettingsContext"
import { Add01Icon, MinusSignIcon } from "hugeicons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Apple, Utensils, Moon, Sun } from "lucide-react"
import { Measurement } from "@/types/measurement"

type StatusOption = {
  icon: React.ElementType
  title: string
}

const statusOptions: StatusOption[] = [
  { icon: Coffee, title: "Jejum" },
  { icon: Apple, title: "Pré-refeição" },
  { icon: Utensils, title: "Pós-refeição" },
  { icon: Moon, title: "Antes de dormir" },
  { icon: Sun, title: "Geral" },
]

export function GlicoseForm() {
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null)
  const { settings } = useSettings()
  const [glucoseValue, setGlucoseValue] = React.useState(settings.glucoseTarget.min)
  const [measurementDateTime, setMeasurementDateTime] = React.useState(getCurrentDateTime())
  const [insulinDoses, setInsulinDoses] = React.useState<string>("0")

  function getCurrentDateTime() {
    const now = new Date()
    return now.toISOString().slice(0, 16) // YYYY-MM-DDTHH:mm format
  }

  const onClick = (adjustment: number) => {
    const newValue = (Number.parseInt(glucoseValue) + adjustment).toString()
    setGlucoseValue(newValue)
  }

  const handleSubmit = () => {
    const newMeasurement: Measurement = {
      id: Date.now().toString(), // Use timestamp as a simple unique ID
      glucoseValue,
      measurementDateTime,
      status: selectedStatus || "",
      insulinDoses,
    }

    // Get existing measurements from localStorage
    const existingMeasurements = JSON.parse(localStorage.getItem("glucoseMeasurements") || "[]")

    // Add new measurement to the array
    const updatedMeasurements = [newMeasurement, ...existingMeasurements]

    // Save updated measurements to localStorage
    localStorage.setItem("glucoseMeasurements", JSON.stringify(updatedMeasurements))

    // Reset form fields
    setGlucoseValue(settings.glucoseTarget.min)
    setMeasurementDateTime(getCurrentDateTime())
    setSelectedStatus(null)
    setInsulinDoses("0")

    // Close the sheet (you might need to implement this functionality)
    // closeSheet();
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div>
          <Button className="hidden md:flex items-center">
            <Add01Icon size={16} className="mr-2" />
            Adicionar Medição
          </Button>
          <Button
            size="icon"
            variant="default"
            className="fixed bottom-4 right-4 md:hidden h-16 w-16 rounded-full z-50"
          >
            <Add01Icon size={16} />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent className="border px-6">
        <div className="mx-auto w-full max-w-sm space-y-6 py-4">
          <SheetHeader className="px-0">
            <SheetTitle>Adicionar Medição</SheetTitle>
          </SheetHeader>

          {/* Glicose */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-1)}
                disabled={Number.parseInt(glucoseValue) <= Number.parseInt(settings.glucoseTarget.min)}
              >
                <MinusSignIcon size={16} />
                <span className="sr-only">Diminuir</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">{glucoseValue}</div>
                <div className="text-[0.70rem] text-muted-foreground">
                  <span className="uppercase">Glicose no sangue</span> ({settings.glucoseUnit})
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(1)}
                disabled={Number.parseInt(glucoseValue) >= Number.parseInt(settings.glucoseTarget.max)}
              >
                <Add01Icon size={16} />
                <span className="sr-only">Aumentar</span>
              </Button>
            </div>
          </div>

          {/* Data e Hora */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-muted-foreground">Data e Hora da Medição</label>
            <Input
              type="datetime-local"
              value={measurementDateTime}
              onChange={(e) => setMeasurementDateTime(e.target.value)}
              className="w-full bg-secondary py-6 text-center rounded-xl"
              aria-label="Data e hora da medição"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">Status da Medição</label>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="grid grid-cols-5 px-0 gap-2">
                {statusOptions.map((option) => (
                  <div key={option.title} className="flex flex-col items-center gap-2">
                    <Button
                      size="icon"
                      variant={selectedStatus === option.title ? "secondary" : "outline"}
                      className="flex items-center justify-center rounded-xl h-14 w-14 sm:h-16 sm:w-16"
                      onClick={() => setSelectedStatus(option.title)}
                    >
                      <option.icon className="h-5 w-5" />
                    </Button>
                    <span className="text-center text-xs text-muted-foreground">{option.title}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Medicamentos e Doses */}
          <div className="w-full">

            {/* Doses de Insulina */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">Doses de Insulina</label>
              <Input
                type="number"
                value={insulinDoses}
                onChange={(e) => setInsulinDoses(e.target.value)}
                min="0"
                step="0.5"
                className="w-full"
                placeholder="Número de doses"
              />
            </div>
          </div>

          <SheetFooter className="px-0">
            <div className="flex space-x-2 w-full">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
              <Button onClick={handleSubmit} className="w-full">
                Salvar
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}

