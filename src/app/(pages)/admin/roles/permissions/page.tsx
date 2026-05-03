"use client";
import React, { useEffect, useState } from "react";
import { Role } from "@/types/role";
import { Permission } from "@/types/permission";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { Save, RefreshCw, Check, Lock } from "lucide-react";
import { roleService } from "@/services/admin/roleService";
import Button from "@/components/button/Button";
import { toast } from "sonner";

export default function PermissionsPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activePermissions, setActivePermissions] = useState<Record<string, string[]>>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [rolesRes, permsRes] = await Promise.all([
                roleService.getRoles(),
                roleService.getPermissions()
            ]);

            if (rolesRes.code === "success" && permsRes.code === "success") {
                setRoles(rolesRes.roles);
                setPermissions(permsRes.permissionList);
                
                // Map current permissions of roles
                const mapping: Record<string, string[]> = {};
                rolesRes.roles.forEach((role: Role) => {
                    mapping[role._id] = role.permissions || [];
                });
                setActivePermissions(mapping);
            }
        } catch {
            console.error("Fetch permissions error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckboxChange = (roleId: string, permissionValue: string) => {
        setActivePermissions(prev => {
            const current = [...prev[roleId]];
            if (current.includes(permissionValue)) {
                return { ...prev, [roleId]: current.filter(p => p !== permissionValue) };
            } else {
                return { ...prev, [roleId]: [...current, permissionValue] };
            }
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Update each role that has changes
            const promises = Object.entries(activePermissions).map(([roleId, perms]) => {
                return roleService.updateRole(roleId, { permissions: perms });
            });

            await Promise.all(promises);
            toast.success("Cập nhật phân quyền thành công!");
            fetchData();
        } catch {
            toast.error("Lỗi khi cập nhật phân quyền!");
        } finally {
            setIsSaving(false);
        }
    };

    const groupedPermissions = permissions.reduce((acc: Record<string, Permission[]>, curr) => {
        const group = curr.group || "Khác";
        if (!acc[group]) acc[group] = [];
        acc[group].push(curr);
        return acc;
    }, {});

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Phân quyền hệ thống"
                subTitle="Quản lý chi tiết quyền hạn cho các nhóm vai trò trong hệ thống."
                actions={
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
                            onClick={fetchData}
                        >
                            Làm mới
                        </Button>
                        <Button 
                            isLoading={isSaving}
                            icon={<Save className="w-4 h-4" />}
                            onClick={handleSave}
                            className="px-8 shadow-lg shadow-indigo-200"
                        >
                            Lưu cấu hình
                        </Button>
                    </div>
                }
            />

            <AdminCard noPadding title="Ma trận phân quyền" subTitle="Tick để cấp quyền cho từng nhóm vai trò">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="sticky left-0 z-20 bg-slate-50/50 px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 min-w-[280px]">
                                    Tính năng / Mô tả
                                </th>
                                {roles.map(role => (
                                    <th key={role._id} className="px-6 py-5 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Role</span>
                                            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{role.name}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={roles.length + 1} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin border-indigo-500/20" style={{ borderTopColor: "#6366f1" }} />
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang chuẩn bị ma trận...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : Object.keys(groupedPermissions).length === 0 ? (
                                <tr>
                                    <td colSpan={roles.length + 1} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        Chưa có mã quyền nào được cấu hình hoàn thiện.
                                    </td>
                                </tr>
                            ) : (
                                Object.entries(groupedPermissions).map(([group, perms]) => (
                                    <React.Fragment key={group}>
                                        <tr className="bg-slate-50/30">
                                            <td colSpan={roles.length + 1} className="px-8 py-2.5 border-y border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{group}</span>
                                                </div>
                                            </td>
                                        </tr>
                                        {perms.map((perm) => (
                                            <tr key={perm._id} className="group hover:bg-indigo-50/20 transition-all duration-300">
                                                <td className="sticky left-0 z-10 bg-white group-hover:bg-indigo-50 transition-colors px-8 py-4 border-r border-slate-100/60 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.02)]">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-700 opacity-90">{perm.title}</span>
                                                        <span className="text-[10px] font-medium text-slate-400 mt-0.5 font-mono">{perm.value}</span>
                                                    </div>
                                                </td>
                                                {roles.map(role => (
                                                    <td key={role._id} className="px-6 py-4 text-center">
                                                        <label className="relative inline-flex items-center cursor-pointer justify-center">
                                                            <input 
                                                                type="checkbox" 
                                                                className="sr-only peer"
                                                                checked={activePermissions[role._id]?.includes(perm.value) || false}
                                                                onChange={() => handleCheckboxChange(role._id, perm.value)}
                                                            />
                                                            <div className="w-6 h-6 border-2 border-slate-200 rounded-lg peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all duration-300 flex items-center justify-center group-hover:border-indigo-300 shadow-sm relative overflow-hidden">
                                                                {/* Check Icon with direct React logic for reliability */}
                                                                <Check 
                                                                    className={`w-4 h-4 text-white transition-all duration-300 stroke-[3px] ${
                                                                        activePermissions[role._id]?.includes(perm.value) 
                                                                        ? "scale-100 opacity-100" 
                                                                        : "scale-0 opacity-0"
                                                                    }`} 
                                                                />
                                                                
                                                                {/* Hover effect internal */}
                                                                <div className="absolute inset-0 bg-indigo-50/50 opacity-0 group-hover:opacity-100 peer-checked:opacity-0 transition-opacity pointer-events-none" />
                                                                
                                                                {/* Lock icon for visual cue when unchecked */}
                                                                {!activePermissions[role._id]?.includes(perm.value) && (
                                                                    <div className="text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity absolute">
                                                                        <Lock className="w-2.5 h-2.5" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </label>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </AdminCard>
            
            {/* Legend/Footer */}
            <div className="flex items-center gap-8 px-8 py-6 bg-slate-50/50 rounded-b-3xl border-t border-slate-100">
                 <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-200">
                        <Check className="w-3 h-3 text-white stroke-[3px]" />
                    </div>
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Đã cấp quyền</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md border-2 border-slate-200 flex items-center justify-center bg-white shadow-sm">
                        <Lock className="w-2.5 h-2.5 text-slate-300" />
                    </div>
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Chưa cấp quyền</span>
                 </div>
                 <div className="flex-1" />
                 <div className="flex items-center gap-2 bg-indigo-50/50 px-4 py-2 rounded-xl border border-indigo-100/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <p className="text-[10px] italic text-indigo-900/60 font-bold uppercase tracking-tight">Bấm &quot;Lưu cấu hình&quot; để áp dụng thay đổi ngay lập tức</p>
                 </div>
            </div>
        </div>
    );
}
