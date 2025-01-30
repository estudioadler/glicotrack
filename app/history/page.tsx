"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Measurement } from "@/types/measurement"

export default function History() {
  const [measurements, setMeasurements] = useState<Measurement[]>([])

  useEffect(() => {
    const storedMeasurements = JSON.parse(localStorage.getItem("glucoseMeasurements") || "[]")
    setMeasurements(storedMeasurements)
  }, [])

  return (
    <div className="min-h-screen px-4 md:px-20 pt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Tabs defaultValue="glucose" className="space-y-4">
          <TabsList>
            <TabsTrigger value="glucose">Glicemia</TabsTrigger>
            <TabsTrigger value="applications">Aplicações</TabsTrigger>
          </TabsList>

          <TabsContent value="glucose">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Medições de Glicemia</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Valor (mg/dL)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {measurements.map((measurement) => (
                      <TableRow key={measurement.id}>
                        <TableCell>{new Date(measurement.measurementDateTime).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(measurement.measurementDateTime).toLocaleTimeString()}</TableCell>
                        <TableCell>{measurement.glucoseValue}</TableCell>
                        <TableCell>{measurement.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Aplicações</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Medicação</TableHead>
                      <TableHead>Quantidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {measurements
                      .filter((m) => Number(m.insulinDoses) > 0)
                      .map((measurement) => (
                        <TableRow key={measurement.id}>
                          <TableCell>{new Date(measurement.measurementDateTime).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(measurement.measurementDateTime).toLocaleTimeString()}</TableCell>
                          <TableCell>Insulina</TableCell>
                          <TableCell>{measurement.insulinDoses} unidade(s)</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

