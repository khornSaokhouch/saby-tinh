"use client";

import React, { useEffect, useState } from 'react';
import { usePaywayStore } from '@/stores/usePaywayStore';
import { useProductStore } from '@/stores/useProductStore';
import { 
    Loader2, QrCode, RefreshCcw, CheckCircle2, 
    XCircle, ChevronRight, Package, CreditCard,
    AlertCircle, ExternalLink
} from 'lucide-react';

export default function PaywayTestPage() {
    const { 
        merchantId, 
        loading: paywayLoading, 
        error: paywayError, 
        qrResponse, 
        generateQr, 
        checkTransaction,
        clearError,
        clearQrResponse,
        fetchSettings 
    } = usePaywayStore();

    const { 
        products, 
        loading: productsLoading, 
        fetchProducts 
    } = useProductStore();

    const [selectedProductId, setSelectedProductId] = useState('');
    const [firstName, setFirstName] = useState('ABA');
    const [lastName, setLastName] = useState('Bank');
    const [email, setEmail] = useState('khornsaokhouch4456@gm.com');
    const [phone, setPhone] = useState('0964415022');
    const [paymentOption, setPaymentOption] = useState('abapay_khqr');
    const [statusResult, setStatusResult] = useState(null);
    const [checkingStatus, setCheckingStatus] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchSettings();
    }, [fetchProducts, fetchSettings]);

    const handleGenerateQr = async () => {
        if (!selectedProductId) return;

        const tran_id = "TEST-" + Date.now();
        const data = {
            tran_id,
            product_ids: [selectedProductId],
            currency: 'USD',
            payment_option: paymentOption,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            return_params: 'test=123'
        };

        try {
            await generateQr(data);
            setStatusResult(null);
        } catch (err) {
            console.error(err);
        }
    };

    const loading = paywayLoading || productsLoading;
    const error = paywayError;

    const handleCheckStatus = async () => {
        if (!qrResponse?.request?.tran_id) return;

        setCheckingStatus(true);
        try {
            const res = await checkTransaction(qrResponse.request.tran_id);
            setStatusResult(res);
        } catch (err) {
            console.error(err);
        } finally {
            setCheckingStatus(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 font-sans text-slate-900">
            <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* --- HEADER --- */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full mb-2">
                        <CreditCard size={12} className="text-indigo-600" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Payment Gateway</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 italic">
                        PayWay <span className="text-indigo-600 not-italic">Refined</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Integration test environment for ABA PayWay API.</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center justify-between gap-4 animate-in zoom-in-95">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-200">
                                <AlertCircle size={16} strokeWidth={3} />
                            </div>
                            <span className="text-xs font-bold text-rose-700">{error}</span>
                        </div>
                        <button 
                            onClick={clearError}
                            className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600 transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* --- SELECTION CARD --- */}
                <div className="bg-white p-8 rounded-[38px] border border-slate-200/50 shadow-2xl shadow-slate-200/30 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/50 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-50/50 rounded-full -ml-12 -mb-12 group-hover:scale-110 transition-transform duration-1000" />
                    
                    <div className="relative z-10 flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-200 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <Package size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Checkout Details</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-70">Fill in to generate secure QR</p>
                        </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 opacity-80">First Name</label>
                                <input 
                                    type="text" 
                                    value={firstName} 
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 opacity-80">Last Name</label>
                                <input 
                                    type="text" 
                                    value={lastName} 
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 opacity-80">Email</label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 opacity-80">Phone</label>
                                <input 
                                    type="text" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 opacity-80">Payment Method</label>
                            <div className="relative">
                                <select 
                                    value={paymentOption} 
                                    onChange={(e) => setPaymentOption(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="abapay_khqr">ABA KHQR (Secure QR)</option>
                                    <option value="abapay">ABA Mobile App (Deeplink)</option>
                                    <option value="cards">Credit / Debit Cards</option>
                                    <option value="wechat">WeChat Pay</option>
                                    <option value="alipay">Alipay</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                    <CreditCard size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 opacity-80">Select Product</label>
                            <div className="relative">
                                <select 
                                    onChange={(e) => setSelectedProductId(e.target.value)} 
                                    value={selectedProductId}
                                    className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Choose an item...</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} — ${parseFloat(p.price).toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                    <ChevronRight size={18} className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleGenerateQr} 
                            disabled={!selectedProductId || loading}
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group/btn relative overflow-hidden mt-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Secure Checkout</span>
                                    <QrCode size={18} strokeWidth={2.5} className="group-hover/btn:scale-110 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* --- QR RESULT MODAL --- */}
                {qrResponse && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 relative">
                            
                            {/* Modal Close Button */}
                            <button 
                                onClick={clearQrResponse}
                                className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-all z-20"
                            >
                                <XCircle size={20} strokeWidth={2.5} />
                            </button>

                            {/* Modal Header (ABA Branding feel) */}
                            <div className="bg-indigo-600 p-8 text-white text-center space-y-2">
                                <div className="w-14 h-14 bg-white/20 rounded-[20px] flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                                    <QrCode size={28} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-black italic tracking-tighter">PayWay <span className="not-italic text-indigo-200">Secure</span></h3>
                                <p className="text-indigo-100/70 text-[10px] font-black uppercase tracking-[0.2em]">Scan to pay securely</p>
                            </div>

                            <div className="p-8 flex flex-col items-center">
                                {/* QR Code Image */}
                                {qrResponse.qrImage ? (
                                    <div className="relative p-6 bg-white rounded-[32px] border-4 border-slate-50 shadow-inner group transition-transform hover:scale-[1.02] duration-500">
                                        <img 
                                            src={qrResponse.qrImage} 
                                            alt="PayWay QR" 
                                            className="w-52 h-52 relative z-10"
                                        />
                                        <div className="absolute inset-0 bg-indigo-50/50 rounded-[28px] -m-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ) : (
                                    <div className="py-12 flex flex-col items-center gap-3 text-rose-500">
                                        <XCircle size={48} />
                                        <span className="text-xs font-black uppercase tracking-widest">No QR Data Received</span>
                                    </div>
                                )}

                                {/* Transaction Info */}
                                <div className="w-full grid grid-cols-2 gap-4 mt-8">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/80">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-xl font-black text-slate-900 tracking-tighter">
                                            ${qrResponse.amount || qrResponse.request?.amount}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/80 overflow-hidden">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Currency</p>
                                        <p className="text-xl font-black text-indigo-600">{qrResponse.currency || 'USD'}</p>
                                    </div>
                                </div>

                                <div className="w-full space-y-3 mt-6">
                                    {qrResponse.abapay_deeplink && (
                                        <a 
                                            href={qrResponse.abapay_deeplink}
                                            className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
                                        >
                                            <span>Open in ABA Bank</span>
                                            <ExternalLink size={16} className="text-indigo-400" />
                                        </a>
                                    )}

                                    <button 
                                        onClick={handleCheckStatus}
                                        disabled={checkingStatus}
                                        className="w-full h-12 bg-white border-2 border-slate-100 hover:border-indigo-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        {checkingStatus ? (
                                            <Loader2 size={16} className="animate-spin text-indigo-500" />
                                        ) : (
                                            <RefreshCcw size={16} className="opacity-40" />
                                        )}
                                        Verify Status
                                    </button>
                                </div>

                                {/* Status Result */}
                                {statusResult && (
                                    <div className={`mt-6 w-full p-4 rounded-2xl border animate-in slide-in-from-top-4 duration-500 shadow-sm ${
                                        statusResult.response?.status === 0 
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                                        : 'bg-amber-50 border-amber-100 text-amber-800'
                                    }`}>
                                        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest mb-2">
                                            {statusResult.response?.status === 0 ? (
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                            ) : (
                                                <RefreshCcw size={16} className="animate-spin text-amber-500" />
                                            )}
                                            {statusResult.response?.description || 'Payment Pending'}
                                        </div>
                                        <div className="bg-black/5 p-3 rounded-xl overflow-hidden">
                                            <pre className="text-[9px] font-mono leading-tight overflow-x-auto opacity-70">
                                                {JSON.stringify(statusResult.response, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Modal Footer Info */}
                            <div className="px-8 pb-8 pt-0 text-center">
                                <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.3em]">Secured by ABA PayWay</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- FOOTER LINKS --- */}
                <div className="text-center">
                    <button className="inline-flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors">
                        Developer Documentation <ExternalLink size={10} />
                    </button>
                </div>
            </div>
        </div>
    );
}
