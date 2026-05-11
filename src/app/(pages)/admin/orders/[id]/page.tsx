/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, User, MapPin, Save } from "lucide-react";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { orderService } from "@/services/admin/orderService";
import { toast } from "sonner";
import Image from "next/image";

interface Order {
  _id: string;
  order_code: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  subtotal: number;
  shipping_fee: number;
  createdAt: string;
  tracking_number?: string;
  estimated_delivery?: string;
  admin_note?: string;
  shipping_address: {
    full_name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  items: Array<{
    product_id: {
      _id: string;
      title: string;
      thumbnail: string;
      sku: string;
    };
    quantity: number;
    price: number;
  }>;
  user_id?: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form states
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [params.id]);

  const fetchOrder = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await orderService.getOrderById(id);
      if (res.code === 200) {
        setOrder(res.data);
        setNewStatus(res.data.status);
        setTrackingNumber(res.data.tracking_number || "");
        setEstimatedDelivery(res.data.estimated_delivery ? new Date(res.data.estimated_delivery).toISOString().split('T')[0] : "");
        setAdminNote(res.data.admin_note || "");
      } else {
        toast.error("Không tìm thấy đơn hàng");
        router.push('/admin/orders');
      }
    } catch {
      toast.error("Lỗi khi tải thông tin đơn hàng");
      router.push('/admin/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!order || !newStatus) return;
    
    setIsUpdating(true);
    try {
      const res = await orderService.updateOrderStatus(order._id, newStatus, statusNote);
      if (res.code === 200) {
        toast.success("Cập nhật trạng thái thành công!");
        setStatusNote("");
        fetchOrder(order._id);
      } else {
        toast.error(res.message || "Lỗi khi cập nhật trạng thái");
      }
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!order || !trackingNumber) {
      toast.error("Vui lòng nhập mã vận đơn");
      return;
    }
    
    setIsUpdating(true);
    try {
      const res = await orderService.updateTracking(order._id, trackingNumber, estimatedDelivery || undefined);
      if (res.code === 200) {
        toast.success("Cập nhật thông tin vận chuyển thành công!");
        fetchOrder(order._id);
      } else {
        toast.error(res.message || "Lỗi khi cập nhật thông tin vận chuyển");
      }
    } catch {
      toast.error("Lỗi khi cập nhật thông tin vận chuyển");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateNote = async () => {
    if (!order) return;
    
    setIsUpdating(true);
    try {
      const res = await orderService.addAdminNote(order._id, adminNote);
      if (res.code === 200) {
        toast.success("Cập nhật ghi chú thành công!");
        fetchOrder(order._id);
      } else {
        toast.error(res.message || "Lỗi khi cập nhật ghi chú");
      }
    } catch {
      toast.error("Lỗi khi cập nhật ghi chú");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getOrderStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string; dot: string }> = {
      pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Chờ xác nhận', dot: 'bg-amber-500' },
      confirmed: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Đã xác nhận', dot: 'bg-blue-500' },
      processing: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Đang xử lý', dot: 'bg-purple-500' },
      shipping: { bg: 'bg-indigo-50', text: 'text-indigo-600', label: 'Đang giao', dot: 'bg-indigo-500' },
      delivered: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Đã giao', dot: 'bg-emerald-500' },
      cancelled: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'Đã hủy', dot: 'bg-rose-500' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider ${badge.bg} ${badge.text} border-${badge.text.replace('text-', '')}/20`}>
        <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
        {badge.label}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin border-indigo-500/20" style={{ borderTopColor: "#6366f1" }} />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="w-full space-y-6 pb-10">
      <AdminPageHeader
        title="Chi tiết đơn hàng"
        subTitle={`Mã đơn hàng: ${order.order_code}`}
        actions={
          <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => router.back()}>
            Quay lại
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <AdminCard title="Thông tin đơn hàng">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <Package className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Mã đơn hàng</p>
                    <p className="text-xl font-black text-slate-800">{order.order_code}</p>
                  </div>
                </div>
                {getOrderStatusBadge(order.status)}
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Phương thức thanh toán</p>
                  <p className="text-sm font-bold text-slate-800 uppercase">{order.payment_method}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Trạng thái thanh toán</p>
                  <p className="text-sm font-bold text-slate-800 capitalize">{order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Ngày đặt hàng</p>
                  <p className="text-sm font-bold text-slate-700">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                {order.tracking_number && (
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Mã vận đơn</p>
                    <p className="text-sm font-mono text-slate-600">{order.tracking_number}</p>
                  </div>
                )}
              </div>
            </div>
          </AdminCard>

          {/* Order Items */}
          <AdminCard title="Sản phẩm" subTitle={`${order.items.length} sản phẩm`}>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white">
                    {item.product_id.thumbnail ? (
                      <Image 
                        src={item.product_id.thumbnail} 
                        alt={item.product_id.title} 
                        width={64} 
                        height={64} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <Package className="w-6 h-6 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{item.product_id.title}</p>
                    <p className="text-xs text-slate-400 font-medium">SKU: {item.product_id.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">x{item.quantity}</p>
                    <p className="text-sm font-black text-slate-800">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tạm tính:</span>
                  <span className="font-bold text-slate-800">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Phí vận chuyển:</span>
                  <span className="font-bold text-slate-800">{formatPrice(order.shipping_fee)}</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800">Tổng cộng:</span>
                  <span className="font-black text-indigo-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <AdminCard title="Thông tin khách hàng">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{order.shipping_address.full_name}</p>
                  <p className="text-xs text-slate-500">{order.shipping_address.phone}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Địa chỉ giao hàng</p>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {order.shipping_address.address}, {order.shipping_address.ward}, {order.shipping_address.district}, {order.shipping_address.city}
                </p>
              </div>
            </div>
          </AdminCard>

          {/* Update Status */}
          <AdminCard title="Cập nhật trạng thái">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Trạng thái mới</label>
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Ghi chú (tùy chọn)</label>
                <textarea 
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nhập ghi chú về thay đổi trạng thái..."
                />
              </div>

              <Button 
                size="sm" 
                className="w-full" 
                icon={<Save className="w-4 h-4" />}
                onClick={handleUpdateStatus}
                disabled={isUpdating || newStatus === order.status}
              >
                {isUpdating ? "Đang cập nhật..." : "Cập nhật trạng thái"}
              </Button>
            </div>
          </AdminCard>

          {/* Update Tracking */}
          <AdminCard title="Thông tin vận chuyển">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Mã vận đơn</label>
                <input 
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nhập mã vận đơn..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Ngày giao dự kiến</label>
                <input 
                  type="date"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <Button 
                size="sm" 
                variant="outline"
                className="w-full" 
                icon={<Save className="w-4 h-4" />}
                onClick={handleUpdateTracking}
                disabled={isUpdating}
              >
                {isUpdating ? "Đang cập nhật..." : "Cập nhật vận chuyển"}
              </Button>
            </div>
          </AdminCard>

          {/* Admin Note */}
          <AdminCard title="Ghi chú nội bộ">
            <div className="space-y-4">
              <textarea 
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập ghi chú nội bộ..."
              />

              <Button 
                size="sm" 
                variant="outline"
                className="w-full" 
                icon={<Save className="w-4 h-4" />}
                onClick={handleUpdateNote}
                disabled={isUpdating}
              >
                {isUpdating ? "Đang lưu..." : "Lưu ghi chú"}
              </Button>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
