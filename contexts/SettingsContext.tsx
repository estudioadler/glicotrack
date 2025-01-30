// contexts/SettingsContext.tsx
"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SettingsContextType {
  settings: {
    notifications: boolean
    emailNotifications: boolean
    glucoseUnit: string
    glucoseInterval: string
    glucoseTarget: {
      min: string
      max: string
    }
    theme: string
  }
  updateSettings: (newSettings: SettingsContextType['settings']) => void
}

const defaultSettings: SettingsContextType['settings'] = {
  notifications: false,
  emailNotifications: false,
  glucoseUnit: "mg/dl",
  glucoseInterval: "1h",
  glucoseTarget: {
    min: "70",
    max: "180"
  },
  theme: "light"
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings)

  const updateSettings = (newSettings: SettingsContextType['settings']) => {
    setSettings(newSettings)
    // Opcional: Salvar no localStorage
    localStorage.setItem('userSettings', JSON.stringify(newSettings))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}