'use client';

import { Settings, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';

export function AppSidebar() {
  const [logoSrc, setLogoSrc] = useState('');

  useEffect(() => {
    setLogoSrc('/images/logo.png');
  }, []);

  const items = [
    {
      title: 'Clientes',
      url: '/clients',
      icon: Users,
    },
  ];

  const footerItems = [
    {
      title: 'Configurações',
      url: '/settings',
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="jutify-center flex h-24 w-full items-center p-6">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt="Logo"
              width={300}
              height={300}
              className="rounded-3xl"
            />
          ) : (
            <Skeleton className="h-12 w-full" />
          )}
        </div>
        <div className="-mb-6 text-center font-bold">Desafio Codifica.Dev</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Separator />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {footerItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarFooter>
    </Sidebar>
  );
}
