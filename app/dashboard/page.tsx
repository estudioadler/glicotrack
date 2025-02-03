"use client"

import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity01Icon, Calendar01Icon, Calendar02Icon, GivePillIcon } from "hugeicons-react"
import type { Measurement } from "@/types/measurement"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import Header from "@/components/header"

const Dashboard = () => {
  const [glucoseData, setGlucoseData] = useState<Measurement[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    const storedMeasurements = JSON.parse(localStorage.getItem("glucoseMeasurements") || "[]")
    setGlucoseData(storedMeasurements)
  }, [])

  const getGlucoseStatus = (value: number) => {
    if (value < 70) return "Hipoglicemia"
    if (value >= 70 && value <= 99) return "Normal (jejum)"
    if (value >= 100 && value <= 125) return "Pré-diabetes"
    return "Diabetes"
  }

  // Filter measurements for the selected date
  const selectedDateMeasurements = glucoseData.filter((m) => {
    const measurementDate = new Date(m.measurementDateTime)
    return (
      measurementDate.getDate() === selectedDate.getDate() &&
      measurementDate.getMonth() === selectedDate.getMonth() &&
      measurementDate.getFullYear() === selectedDate.getFullYear()
    )
  })

  const lastMeasurement = selectedDateMeasurements[selectedDateMeasurements.length - 1] || {
    glucoseValue: "N/A",
    measurementDateTime: "N/A",
    status: "N/A",
    insulinDoses: "0",
  }

  // Calculate the average for the selected date
  const selectedDateAverage =
    selectedDateMeasurements.length > 0
      ? Math.round(
          selectedDateMeasurements.reduce((sum, m) => sum + Number(m.glucoseValue), 0) /
            selectedDateMeasurements.length,
        )
      : null

  // Calculate the percentage change from the previous day
  const previousDay = new Date(selectedDate)
  previousDay.setDate(previousDay.getDate() - 1)
  const previousDayMeasurements = glucoseData.filter((m) => {
    const measurementDate = new Date(m.measurementDateTime)
    return (
      measurementDate.getDate() === previousDay.getDate() &&
      measurementDate.getMonth() === previousDay.getMonth() &&
      measurementDate.getFullYear() === previousDay.getFullYear()
    )
  })

  const previousDayAverage =
    previousDayMeasurements.length > 0
      ? Math.round(
          previousDayMeasurements.reduce((sum, m) => sum + Number(m.glucoseValue), 0) / previousDayMeasurements.length,
        )
      : null

  const percentageChange =
    selectedDateAverage && previousDayAverage
      ? Math.round(((selectedDateAverage - previousDayAverage) / previousDayAverage) * 100)
      : null

  return (
    <>
    <Header />
    <div className="min-h-screen px-4 md:px-20 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="grid grid-cols-1 col-span-1 gap-4">
          <Card className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Medição</CardTitle>
              <Activity01Icon size={18} className="text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lastMeasurement.glucoseValue} mg/dL</div>
              <p className="text-xs text-muted-foreground">
                {lastMeasurement.measurementDateTime !== "N/A"
                  ? new Date(lastMeasurement.measurementDateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}{" "}
                - {getGlucoseStatus(Number(lastMeasurement.glucoseValue))}
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Aplicação</CardTitle>
              <GivePillIcon size={18} className="text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Insulina</div>
              <p className="text-xs text-muted-foreground">
                {lastMeasurement.measurementDateTime !== "N/A"
                  ? new Date(lastMeasurement.measurementDateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}{" "}
                - {lastMeasurement.insulinDoses} unidade(s)
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
              <Calendar01Icon size={18} className="text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedDateAverage || "N/A"} mg/dL</div>
              <p className="text-xs text-muted-foreground">
                {percentageChange !== null
                  ? `${percentageChange > 0 ? "↑" : "↓"} ${Math.abs(percentageChange)}% que ontem`
                  : "Dados insuficientes"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Monitoramento de Glicemia</CardTitle>
                <CardDescription>
                  {format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </CardDescription>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="px-2 md:px-4 ml-auto dark:bg-card dark:hover:bg-muted">
                    <Calendar02Icon className="h-4 w-4" />
                    <span className="hidden md:inline">Selecionar data</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    required
                    selected={selectedDate}
                    onSelect={(date?: Date) => date && setSelectedDate(date)}
                    locale={ptBR}
                    className="rounded-md border shadow "
                  />
                </PopoverContent>
              </Popover>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedDateMeasurements} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                    <XAxis
                      dataKey="measurementDateTime"
                      stroke="currentColor"
                      className="text-sm opacity-50"
                      tick={{ fill: "currentColor" }}
                      tickLine={{ stroke: "currentColor" }}
                      axisLine={{ stroke: "currentColor" }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }
                    />
                    <YAxis
                      stroke="currentColor"
                      className="text-sm opacity-50"
                      domain={[0, 200]}
                      tick={{ fill: "currentColor" }}
                      tickLine={{ stroke: "currentColor" }}
                      axisLine={{ stroke: "currentColor" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value: number) => [`${value} mg/dL - ${getGlucoseStatus(value)}`, "Glicose"]}
                      labelFormatter={(value) =>
                        new Date(value).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      }
                    />
                    <defs>
                      <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="glucoseValue"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorGlucose)"
                    />
                    <ReferenceLine y={70} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                    <ReferenceLine y={99} stroke="hsl(var(--warning))" strokeDasharray="3 3" />
                    <ReferenceLine y={125} stroke="hsl(var(--warning))" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="glucoseValue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{
                        fill: "hsl(var(--primary))",
                        stroke: "hsl(var(--background))",
                        strokeWidth: 2,
                      }}
                      activeDot={{
                        fill: "hsl(var(--primary))",
                        stroke: "hsl(var(--background))",
                        strokeWidth: 2,
                        r: 8,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  )
}

export default Dashboard

