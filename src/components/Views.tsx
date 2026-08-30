import { useState, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { formatMoney, uid } from '../lib/format'
import { formatJalali } from '../lib/jalali'
import { Search, Trash2, Download, Plus } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'
function Progress({pct}:{pct:number}){ return <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-900" style={{width: `${Math.min(100,pct)}%`}}/></div> }

export function TransactionsView({q,setQ,filtered,onNew}:{q:string;setQ:(v:string)=>void;filtered:any[];onNew:()=>void}){
  const s=useStore()
  const [typeFilter,setTypeFilter]=useState<'all'|'income'|'expense'|'transfer'>('all')
  const list = useMemo(()=> filtered.filter(t=> typeFilter==='all' || t.type===typeFilter),[filtered,typeFilter])
  const exportCsv=()=>{
    const rows=[['عنوان','مبلغ','نوع','تاریخ','دسته','حساب'].join(',')].concat(list.map(t=>[t.title,t.amount,t.type,t.date,s.categories.find(c=>c.id===t.categoryId)?.name||'',s.accounts.find(a=>a.id===t.accountId)?.name||''].join(',')))
    const blob=new Blob([rows.join('\n')],{type:'text/csv;charset=utf-8;'})
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='transactions.csv'; a.click(); URL.revokeObjectURL(url)
  }
  return <div className="space-y-4">
    <div className="card p-4 flex flex-wrap gap-2 items-center">
      <div className="flex items-center gap-2 bg-slate-50 border rounded-xl px-3 py-2 flex-1 min-w-[220px]"><Search size={16}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="جستجو در تراکنش‌ها..." className="bg-transparent outline-none flex-1 text-sm"/></div>
      <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value as any)} className="border rounded-xl px-3 py-2 text-sm"><option value="all">همه</option><option value="income">درآمد</option><option value="expense">هزینه</option><option value="transfer">انتقال</option></select>
      <button onClick={exportCsv} className="btn bg-white border"><Download size={16}/> خروجی CSV</button>
      <button onClick={onNew} className="btn bg-slate-900 text-white"><Plus size={16}/> جدید</button>
    </div>
    <div className="card p-2 divide-y">
      {list.length===0 && <div className="p-8 text-center text-slate-500 text-sm">تراکنشی یافت نشد</div>}
      {list.map(t=>{
        const cat=s.categories.find(c=>c.id===t.categoryId); const acc=s.accounts.find(a=>a.id===t.accountId)
        return <div key={t.id} className="flex items-center gap-3 p-3">
          <div className="w-10 h-10 rounded-xl grid place-items-center text-white" style={{background: cat?.color || (t.type==='transfer'?'#64748b':'#94a3b8')}}>{cat?.icon || (t.type==='transfer'?'⇄':'•')}</div>
          <div className="flex-1"><div className="text-sm font-medium">{t.title}</div><div className="text-xs text-slate-500">{formatJalali(t.date)} • {cat?.name || 'انتقال'} • {acc?.name}</div></div>
          <div className={`text-sm font-extrabold ${t.type==='income'?'text-emerald-600':t.type==='expense'?'text-rose-600':'text-slate-600'}`}>{t.type==='expense'?'-':t.type==='income'?'+':''}{formatMoney(t.amount,s.currency)}</div>
          <button onClick={()=>s.removeTransaction(t.id)} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
        </div>
      })}
    </div>
  </div>
}

export function AccountsView(){
  const s=useStore()
  const [name,setName]=useState(''); const [type,setType]=useState<any>('bank'); const [balance,setBalance]=useState('')
  const [from,setFrom]=useState(''); const [to,setTo]=useState(''); const [amt,setAmt]=useState('')
  const doTransfer=()=>{
    const a=Number(amt); if(!a || !from || !to || from===to) return;
    const f=s.accounts.find(x=>x.id===from); const t=s.accounts.find(x=>x.id===to); if(!f||!t) return;
    s.updateAccount(from,{balance: f.balance - a}); s.updateAccount(to,{balance: t.balance + a})
    s.addTransaction({id:uid(), title:`انتقال ${f.name} → ${t.name}`, amount:a, type:'transfer', accountId:from, toAccountId:to, date:new Date().toISOString().slice(0,10)})
    setAmt('')
  }
  return <div className="space-y-4">
    <div className="grid md:grid-cols-3 gap-4">
      {s.accounts.map(a=> <div key={a.id} className="card p-4">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl grid place-items-center text-white" style={{background:a.color}}>{a.icon}</div><div><div className="font-bold text-sm">{a.name}</div><div className="text-xs text-slate-500">{a.type}</div></div><button onClick={()=>s.removeAccount(a.id)} className="ms-auto text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button></div>
        <div className="mt-3 font-extrabold">{formatMoney(a.balance,s.currency)}</div>
      </div>)}
    </div>
    <div className="card p-4">
      <div className="font-bold mb-3">انتقال بین حساب‌ها</div>
      <div className="grid md:grid-cols-4 gap-3">
        <select value={from} onChange={e=>setFrom(e.target.value)} className="border rounded-xl px-3 py-2 text-sm"><option value="">مبدا</option>{s.accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select>
        <select value={to} onChange={e=>setTo(e.target.value)} className="border rounded-xl px-3 py-2 text-sm"><option value="">مقصد</option>{s.accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select>
        <input value={amt} onChange={e=>setAmt(e.target.value)} placeholder="مبلغ (تومان)" className="border rounded-xl px-3 py-2 text-sm"/>
        <button onClick={doTransfer} className="btn bg-slate-900 text-white">انتقال</button>
      </div>
    </div>
    <div className="card p-4">
      <div className="font-bold mb-3">افزودن حساب جدید</div>
      <div className="grid md:grid-cols-4 gap-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="نام حساب" className="border rounded-xl px-3 py-2 text-sm"/>
        <select value={type} onChange={e=>setType(e.target.value)} className="border rounded-xl px-3 py-2 text-sm"><option value="bank">بانک</option><option value="card">کارت</option><option value="cash">نقدی</option><option value="wallet">کیف پول</option></select>
        <input value={balance} onChange={e=>setBalance(e.target.value)} placeholder="موجودی (تومان)" className="border rounded-xl px-3 py-2 text-sm"/>
        <button onClick={()=>{if(!name) return; s.addAccount({id:uid(), name, type, color:'#0ea5e9', icon:'🏦', balance:Number(balance)||0}); setName(''); setBalance('')}} className="btn bg-slate-900 text-white">افزودن</button>
      </div>
    </div>
  </div>
}
