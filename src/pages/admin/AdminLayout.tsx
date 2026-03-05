import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#0a0f2c]">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
