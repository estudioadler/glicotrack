"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock04Icon, DashboardSquare02Icon, Radar01Icon } from "hugeicons-react"
import { GlicoseForm } from "./GlicoseForm"
import { useTheme } from "next-themes"
import { signOut, useSession } from "next-auth/react"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const {data: session} = useSession()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="bg-transparent flex md:h-20 h-16 items-center">
      <div className="container mx-auto px-4 md:px-0 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Radar01Icon size={24} className="text-primary scale-x-[-1] -rotate-[225deg]" />
          <span className="uppercase font-semibold">Glicotrack</span>
        </Link>

        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/dashboard" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <DashboardSquare02Icon size={16} className="mr-2 group-focus:text-primary" />
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/history" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Clock04Icon size={16} className="mr-2 group-focus:text-primary" />
                  Histórico
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center">
          <GlicoseForm />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="ml-2 cursor-pointer">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback>{session?.user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile">Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>Trocar tema</DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut( { callbackUrl: "/" } )}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

