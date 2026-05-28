"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { voucherService, Voucher } from "@/services/client/voucherService";

export default function CartSummary() {
  const { cart, loading, applyVoucher, removeVoucher } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [voucherCode, setVoucherCode] = React.useState("");
  const [isApplying, setIsApplying] = React.useState(false);
  const [voucherError, setVoucherError] = React.useState<string | null>(null);
  
  // Modal state
  const [showVoucherModal, setShowVoucherModal] = React.useState(false);
  const [availableVouchers, setAvailableVouchers] = React.useState<Voucher[]>([]);
  const [loadingVouchers, setLoadingVouchers] = React.useState(false);

  if (!cart) return null;

  const { subtotal, discount_amount, total, items } = cart;
  
  const selectedItems = items.filter(item => item.selected !== false);
  const itemCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-lg border p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      {/* Items Count */}
      <div className="flex justify-between text-gray-600 mb-2">
        <span>Items ({itemCount})</span>
        <span>{subtotal.toLocaleString('vi-VN')}₫</span>
      </div>

      {/* Discount */}
      {discount_amount > 0 && (
        <div className="flex justify-between text-green-600 mb-2">
          <span>Discount</span>
          <span>-{discount_amount.toLocaleString('vi-VN')}₫</span>
        </div>
      )}

      {/* Voucher Input */}
      <div className="my-4">
        {cart.voucher_code ? (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-green-700">{cart.voucher_code}</span>
              </div>
              <button 
                onClick={async () => {
                  setIsApplying(true);
                  try {
                    await removeVoucher();
                  } catch (err: any) {
                    setVoucherError(err.message);
                  } finally {
                    setIsApplying(false);
                  }
                }}
                disabled={isApplying}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                disabled={!isAuthenticated || isApplying}
              />
              <button
                onClick={async () => {
                  if (!voucherCode.trim()) return;
                  setIsApplying(true);
                  setVoucherError(null);
                  try {
                    await applyVoucher(voucherCode.trim());
                    setVoucherCode("");
                  } catch (err: any) {
                    setVoucherError(err.message);
                  } finally {
                    setIsApplying(false);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !isAuthenticated || !voucherCode.trim() || isApplying
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={!isAuthenticated || !voucherCode.trim() || isApplying}
              >
                {isApplying ? '...' : 'Áp dụng'}
              </button>
            </div>
            
            {isAuthenticated ? (
              <button 
                onClick={async () => {
                  setShowVoucherModal(true);
                  setLoadingVouchers(true);
                  try {
                    const res = await voucherService.getAvailableVouchers();
                    setAvailableVouchers(res.data);
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setLoadingVouchers(false);
                  }
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V4.242c0-.754-.727-1.294-1.453-1.096a60.07 60.07 0 0 1-15.797 2.101c-.699.156-1.25.76-1.25 1.47v9.558c0 .71.551 1.314 1.25 1.47Z" />
                </svg>
                Chọn Voucher có sẵn
              </button>
            ) : (
              <p className="text-xs text-orange-500 mt-2">Vui lòng đăng nhập để sử dụng mã giảm giá.</p>
            )}
            
            {voucherError && (
              <p className="text-xs text-red-500 mt-2">{voucherError}</p>
            )}
          </div>
        )}
      </div>

      <div className="border-t pt-4 mt-4">
        {/* Total */}
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total</span>
          <span className="text-red-600">{total.toLocaleString('vi-VN')}₫</span>
        </div>

        {/* Checkout Button */}
        <Link
          href="/checkout"
          className={`
            block w-full py-3 text-center rounded-lg font-medium transition-colors
            ${selectedItems.length === 0 || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
          onClick={(e) => {
            if (selectedItems.length === 0 || loading) {
              e.preventDefault();
            }
          }}
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </Link>

        {/* Continue Shopping */}
        <Link
          href="/products"
          className="block w-full mt-3 py-3 text-center border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Security Badge */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Thanh toán an toàn</span>
        </div>
      </div>

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">Mã giảm giá của bạn</h3>
              <button 
                onClick={() => setShowVoucherModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
              {loadingVouchers ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : availableVouchers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Hiện không có mã giảm giá nào phù hợp.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableVouchers.map((voucher) => {
                    const isEligible = subtotal >= voucher.min_order_value;
                    return (
                      <div 
                        key={voucher._id} 
                        className={`bg-white border rounded-lg p-4 shadow-sm flex gap-4 relative overflow-hidden ${!isEligible ? 'opacity-60' : ''}`}
                      >
                        {/* Decorative jagged edge */}
                        <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col justify-between">
                           {[...Array(6)].map((_, i) => (
                             <div key={i} className="w-2 h-2 bg-gray-50 rounded-full -translate-x-1"></div>
                           ))}
                        </div>
                        
                        <div className="w-20 shrink-0 bg-blue-50 text-blue-600 rounded flex flex-col items-center justify-center font-bold p-2 ml-2">
                          {voucher.discount_type === 'percent' 
                            ? `${voucher.discount_value}%` 
                            : `-${(voucher.discount_value / 1000)}k`}
                          <span className="text-[10px] font-normal uppercase mt-1">Giảm</span>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-gray-900 border border-blue-200 bg-blue-50 px-2 py-0.5 rounded text-xs">{voucher.code}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-800 mt-1 line-clamp-2">
                              {voucher.description || `Giảm ${voucher.discount_type === 'percent' ? voucher.discount_value + '%' : voucher.discount_value.toLocaleString('vi-VN') + '₫'}`}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Đơn tối thiểu {voucher.min_order_value.toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                          
                          <div className="mt-3 flex justify-between items-end">
                            <span className="text-[11px] text-gray-400">HSD: {new Date(voucher.end_date).toLocaleDateString('vi-VN')}</span>
                            <button
                              disabled={!isEligible || isApplying}
                              onClick={async () => {
                                setIsApplying(true);
                                setVoucherError(null);
                                try {
                                  await applyVoucher(voucher.code);
                                  setShowVoucherModal(false);
                                } catch (err: any) {
                                  alert(err.message);
                                } finally {
                                  setIsApplying(false);
                                }
                              }}
                              className={`text-sm px-4 py-1.5 rounded font-medium ${
                                isEligible 
                                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {isApplying ? '...' : isEligible ? 'Dùng' : 'Chưa đạt'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
