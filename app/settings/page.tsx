"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Activity01Icon, Notification01Icon } from "hugeicons-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";

export default function Settings() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      updateSettings(settings);
      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
    <Header />
    
    <div className="container mx-auto max-w-2xl px-8 py-8 rounded-lg space-y-4 bg-card">
      <h1 className="md:text-2xl text-xl">Configurações</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid">
          <Card className="border-none shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="flex items-center gap-2">
                <Notification01Icon className="h-5 w-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notificações no navegador</Label>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked: boolean) =>
                    updateSettings({ ...settings, notifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">
                  Notificações por email
                </Label>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked: boolean) =>
                    updateSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
          <Separator />
          <Card className="border-none shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="flex items-center gap-2">
                <Activity01Icon className="h-5 w-5" />
                Monitoramento de Glicemia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              <div className="space-y-2">
                <Label>Unidade de medida</Label>
                <Select
                  value={settings.glucoseUnit}
                  onValueChange={(value: string) =>
                    updateSettings({ ...settings, glucoseUnit: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg/dl">mg/dL</SelectItem>
                    <SelectItem value="mmol/l">mmol/L</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Faixa alvo de glicemia</Label>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="min-glucose">Mínimo (mg/dL)</Label>
                    <Input
                      id="min-glucose"
                      type="number"
                      value={settings.glucoseTarget.min}
                      onChange={(e) =>
                        updateSettings({
                          ...settings,
                          glucoseTarget: {
                            ...settings.glucoseTarget,
                            min: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="max-glucose">Máximo (mg/dL)</Label>
                    <Input
                      id="max-glucose"
                      type="number"
                      value={settings.glucoseTarget.max}
                      onChange={(e) =>
                        updateSettings({
                          ...settings,
                          glucoseTarget: {
                            ...settings.glucoseTarget,
                            max: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit">Salvar Configurações</Button>
        </div>
      </form>
    </div>
    </>
  );
}
