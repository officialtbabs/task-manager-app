import { useSession } from "@/hooks/useSession";
import type { Session } from "@supabase/supabase-js";
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const data = {
  // versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      items: [
        {
          title: "Home",
          url: "/",
        },
        {
          title: "Task Manager",
          url: "/task-manager",
        },
      ],
    },
  ],
};

function MainLayout() {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const mappedNavMain = React.useMemo(
    () =>
      data.navMain.map((item) => ({
        ...item,
        items: item.items.map((subItem) => ({
          ...subItem,
          isActive: subItem.url === location.pathname || false,
        })),
      })),
    [location]
  );

  const currentNav = React.useMemo(() => {
    return data.navMain
      .flatMap((section) =>
        section.items.map((item) => ({
          ...item,
          sectionUrl: section.url,
          sectionTitle: section.title,
        }))
      )
      .find((item) => location.pathname === item.url);
  }, [location]);

  const user = React.useMemo(() => {
    if (session === null) return null;
    return (session as Session).user;
  }, [session]);

  useEffect(() => {
    if (session === null) navigate("/login");
  }, [session, navigate]);

  if (
    session &&
    typeof session === "object" &&
    typeof (session as Promise<Session | null>).then === "function"
  )
    return null;

  if (session === null) return null;

  return (
    <>
      <SidebarProvider>
        <AppSidebar navData={mappedNavMain} user={user!} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={currentNav?.sectionUrl}>
                    {currentNav?.sectionTitle}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentNav?.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default MainLayout;
