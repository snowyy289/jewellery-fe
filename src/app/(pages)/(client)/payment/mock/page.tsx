"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircleIcon, XCircleIcon, QrCodeIcon } from "@heroicons/react/24/outline";

export default function MockPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");
  const amount = searchParams.get("amount");
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId || !method) {
      router.push("/");
    }
  }, [orderId, method, router]);

  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      
      if (method === "vnpay") {
        const returnUrl = `${baseUrl}/client/payment/vnpay/return?vnp_TxnRef=${orderId}&vnp_ResponseCode=00&vnp_TransactionNo=MOCK${Date.now()}&vnp_SecureHash=mock`;
        window.location.href = returnUrl;
      } else if (method === "momo") {
        const returnUrl = `${baseUrl}/client/payment/momo/return?orderId=${orderId}&resultCode=0&transId=MOCK${Date.now()}&signature=mock`;
        window.location.href = returnUrl;
      } else if (method === "zalopay") {
        // ZaloPay requires a POST to the callback endpoint
        const mockData = JSON.stringify({
          app_trans_id: `MOCK_${orderId}`,
          status: 1,
          zp_trans_id: `ZP${Date.now()}`
        });
        
        await fetch(`${baseUrl}/client/payment/zalopay/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: mockData,
            mac: "mock_mac"
          })
        });
        
        // Redirect to order details
        router.push(`/orders/${orderId}?payment=success`);
      }
    } catch (error) {
      console.error("Payment simulation error:", error);
      alert("Lỗi khi mô phỏng thanh toán!");
      setLoading(false);
    }
  };

  const handlePaymentFail = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      
      if (method === "vnpay") {
        const returnUrl = `${baseUrl}/client/payment/vnpay/return?vnp_TxnRef=${orderId}&vnp_ResponseCode=24&vnp_TransactionNo=MOCK${Date.now()}&vnp_SecureHash=mock`;
        window.location.href = returnUrl;
      } else if (method === "momo") {
        const returnUrl = `${baseUrl}/client/payment/momo/return?orderId=${orderId}&resultCode=1006&transId=MOCK${Date.now()}&signature=mock`;
        window.location.href = returnUrl;
      } else if (method === "zalopay") {
        // ZaloPay requires a POST to the callback endpoint
        const mockData = JSON.stringify({
          app_trans_id: `MOCK_${orderId}`,
          status: 0,
          zp_trans_id: `ZP${Date.now()}`
        });
        
        await fetch(`${baseUrl}/client/payment/zalopay/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: mockData,
            mac: "mock_mac"
          })
        });
        
        // Redirect to order details
        router.push(`/orders/${orderId}?payment=failed`);
      }
    } catch (error) {
      console.error("Payment simulation error:", error);
      alert("Lỗi khi mô phỏng thanh toán!");
      setLoading(false);
    }
  };

  if (!orderId || !method) return null;

  const methodNames: Record<string, string> = {
    vnpay: "VNPay",
    momo: "MoMo",
    zalopay: "ZaloPay"
  };

  const methodName = methodNames[method as string] || method;

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Cổng thanh toán {methodName} (Môi trường thử nghiệm)
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Mã đơn hàng: <span className="font-bold">{orderId}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mb-6">
            <p className="text-gray-500 mb-2">Quét mã QR để thanh toán</p>
            <p className="text-2xl font-bold text-blue-600 mb-6">
              {Number(amount).toLocaleString('vi-VN')}₫
            </p>
            
            <div className="mx-auto w-48 h-48 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg mb-6">
              <QrCodeIcon className="w-24 h-24 text-gray-400" />
            </div>
            
            <p className="text-sm text-gray-500 mb-8">
              Đây là trang mô phỏng thanh toán vì hệ thống chưa cấu hình API key thật. Bạn có thể nhấn nút bên dưới để giả lập kết quả giao dịch.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handlePaymentSuccess}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? (
                "Đang xử lý..."
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Mô phỏng Thanh toán THÀNH CÔNG
                </>
              )}
            </button>
            
            <button
              onClick={handlePaymentFail}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? (
                "Đang xử lý..."
              ) : (
                <>
                  <XCircleIcon className="w-5 h-5 mr-2 text-red-500" />
                  Mô phỏng Thanh toán THẤT BẠI
                </>
              )}
            </button>
            
            <button
              onClick={() => router.push(`/orders/${orderId}`)}
              disabled={loading}
              className="w-full flex justify-center py-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Hủy thanh toán & Quay lại đơn hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
