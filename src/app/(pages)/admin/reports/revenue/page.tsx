"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminPageHeader, AdminCard, AdminStatsCard } from "@/components/layouts/admin/shared";
import Button from "@/components/button/Button";
import { orderService } from "@/services/admin/orderService";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Calendar, DollarSign, Filter, RefreshCw, ShoppingBag, TrendingUp } from "lucide-react";

interface ChartData {
  date: string;
  revenue: number;
  orders: number;
}

interface FilteredOrder {
  _id: string;
  order_code: string;
  total: number;
  createdAt: string;
  shipping_address: {
    full_name: string;
  };
}

export default function RevenueReportPage() {
  const [data, setData] = useState<ChartData[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<FilteredOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [groupBy, setGroupBy] = useState<'day' | 'month' | 'year'>('day');
  
  // Default to last 30 days
  const defaultFromDate = new Date();
  defaultFromDate.setDate(defaultFromDate.getDate() - 30);
  
  const [fromDate, setFromDate] = useState<string>(defaultFromDate.toISOString().split('T')[0]);
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getRevenueChartData(fromDate, toDate, groupBy);
      if (res.code === 200) {
        const chartData = res.data;
        setData(chartData);
        
        // Calculate summary
        const totalRev = chartData.reduce((sum: number, item: ChartData) => sum + item.revenue, 0);
        const totalOrd = chartData.reduce((sum: number, item: ChartData) => sum + item.orders, 0);
        
        setSummary({
          totalRevenue: totalRev,
          totalOrders: totalOrd,
          avgOrderValue: totalOrd > 0 ? totalRev / totalOrd : 0
        });
      }

      // Fetch the actual orders for the list
      const ordersRes = await orderService.getAllOrders({
        from_date: fromDate,
        to_date: toDate,
        status: 'delivered', // Revenue is based on delivered orders
        limit: 100 // Get up to 100 orders for this view
      });
      
      if (ordersRes.code === 200) {
        setFilteredOrders(ordersRes.data);
      }
    } catch (error) {
      console.error("Error fetching revenue chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupBy]); // Removed fromDate and toDate from auto-fetch to allow manual application

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatChartDate = (dateString: string) => {
    if (!dateString) return "";
    
    // Format based on groupBy
    if (groupBy === 'day') {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}`;
    } else if (groupBy === 'month') {
      const [year, month] = dateString.split('-');
      return `T${month}/${year}`;
    }
    return dateString; // year
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100">
          <p className="font-bold text-slate-800 mb-2">{formatChartDate(label)}</p>
          <div className="space-y-1">
            <p className="text-indigo-600 font-semibold text-sm">
              Doanh thu: {formatPrice(payload[0].value)}
            </p>
            {payload[1] && (
              <p className="text-amber-600 font-semibold text-sm">
                Số đơn: {payload[1].value}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-10">
      <AdminPageHeader
        title="Báo Cáo Doanh Thu"
        subTitle="Thống kê và phân tích doanh thu theo thời gian thực."
      />

      {/* Filter Section */}
      <AdminCard>
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              Từ ngày
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              Đến ngày
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              Nhóm theo
            </label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white"
            >
              <option value="day">Theo Ngày</option>
              <option value="month">Theo Tháng</option>
              <option value="year">Theo Năm</option>
            </select>
          </div>

          <div className="flex items-center gap-3 h-10">
            <Button
              onClick={fetchData}
              icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
              disabled={isLoading}
            >
              Lọc Dữ Liệu
            </Button>
            
            {/* Chart Type Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl h-full items-center">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  chartType === 'bar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Cột
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  chartType === 'line' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Đường
              </button>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminStatsCard
          label="Tổng Doanh Thu"
          value={formatPrice(summary.totalRevenue)}
          icon={DollarSign}
          color="indigo"
        />
        <AdminStatsCard
          label="Tổng Đơn Hàng Thành Công"
          value={summary.totalOrders.toString()}
          icon={ShoppingBag}
          color="emerald"
        />
        <AdminStatsCard
          label="Giá Trị Đơn Trung Bình"
          value={formatPrice(summary.avgOrderValue)}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Chart */}
      <AdminCard title="Biểu Đồ Doanh Thu" className="min-h-[500px]">
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin border-indigo-500/20" style={{ borderTopColor: "#6366f1" }} />
              <p className="text-sm font-medium text-slate-400">Đang tải dữ liệu biểu đồ...</p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-slate-400">
            <BarChart className="w-16 h-16 mb-4 text-slate-200" />
            <p>Không có dữ liệu doanh thu trong khoảng thời gian này.</p>
          </div>
        ) : (
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatChartDate}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                      return value;
                    }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar 
                    yAxisId="left"
                    dataKey="revenue" 
                    name="Doanh thu (VNĐ)" 
                    fill="#6366f1" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={50}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="orders" 
                    name="Số đơn hàng" 
                    fill="#f59e0b" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={50}
                  />
                </BarChart>
              ) : (
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatChartDate}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                      return value;
                    }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    name="Doanh thu (VNĐ)" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="orders" 
                    name="Số đơn hàng" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </AdminCard>

      {/* Filtered Orders List */}
      <AdminCard title="Danh Sách Đơn Hàng Đã Giao" subTitle={`Hiển thị các đơn hàng trong khoảng thời gian đã lọc (Tối đa 100 đơn)`}>
        {isLoading ? (
          <div className="py-8 text-center text-slate-400">Đang tải danh sách...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-8 text-center text-slate-400">Không có đơn hàng nào khớp với bộ lọc.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-4 px-4 font-semibold text-slate-600 text-sm">Mã đơn</th>
                  <th className="py-4 px-4 font-semibold text-slate-600 text-sm">Khách hàng</th>
                  <th className="py-4 px-4 font-semibold text-slate-600 text-sm">Ngày đặt</th>
                  <th className="py-4 px-4 font-semibold text-slate-600 text-sm text-right">Tổng tiền</th>
                  <th className="py-4 px-4 font-semibold text-slate-600 text-sm text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-800">{order.order_code}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {order.shipping_address?.full_name}
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-4 font-black text-slate-800 text-right">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Link href={`/admin/orders/${order._id}`}>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition-colors">
                          Chi tiết
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
