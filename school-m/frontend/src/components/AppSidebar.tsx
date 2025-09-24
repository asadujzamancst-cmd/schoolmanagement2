"use client";

import React, { useState } from "react";
import {
  Home,
  BookOpen,
  CalendarCheck,
  FileText,
  CreditCard,
  BarChart,
  Users,
  Book,
  Bell,
  Medal,
  Warehouse,
  Notebook,
  Car,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
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
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

const items = [
  { title: "Home", icon: Home, link: "/" },
  { title: "Departments", icon: Notebook, link: "/Department" },
  {
    title: "Staff",
    icon: Users,
    subItems: [{ label: "Staff Directory", link: "/staff" }],
  },
  {
    title: "Courses",
    icon: BookOpen,
    subItems: [{ label: "Course List", link: "/courses" }],
  },
  { title: "Attendance", icon: CalendarCheck, link: "/attendence" },
  { title: "Exams", icon: FileText, link: "/exams/give" },

  // ✅ Dashboard with subItems
  {
    title: "Dashboard",
    icon: CreditCard,
    subItems: [
      { label: "Student Dashboard", link: "/students" },
      { label: "Admin Dashboard", link: "/Dashbord" },
      { label: "Staff Dashboard", link: "/Staff_Dashbord" },
    ],
  },

  { title: "Results", icon: BarChart, link: "/results" },
  { title: "Library", icon: Book, link: "/library" },
  { title: "Holiday", icon: Car, link: "/holiday" },
  { title: "All notice", icon: Bell, link: "/notifications" },
  { title: "Event", icon: Medal, link: "/events" },
  { title: "Hostel", icon: Warehouse, link: "/hostel" },
];

const AppSidebar = () => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <Sidebar className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 shadow-md z-40">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2 p-2">
                <Image src="/logo.svg" alt="logo" width={20} height={20} />
                <span className="font-semibold">ABC College</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Content */}
      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <React.Fragment key={item.title}>
                  <SidebarMenuItem>
                    {item.subItems ? (
                      <SidebarMenuButton
                        onClick={() => toggleMenu(item.title)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </div>
                        {openMenus[item.title] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton asChild>
                        <Link href={item.link} className="flex items-center gap-2">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>

                  {item.subItems &&
                    openMenus[item.title] &&
                    item.subItems.map((sub, idx) => (
                      <SidebarMenuItem key={idx}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={sub.link}
                            className="pl-8 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 block"
                          >
                            • {sub.label}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
