// PaymentMethods.js - Refined for professional look
export default function PaymentMethods() {
  return (
    <div className="mt-8 pt-8 border-t border-slate-200">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Secured Transactions</p>
      <div className="flex items-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all">
        <img src="/visa.png" alt="Visa" className="h-6 object-contain" />
        <img src="/acleda.png" alt="Acleda" className="h-8 object-contain" />
      </div>
    </div>
  );
}