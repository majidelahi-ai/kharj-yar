import { useState, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { formatMoney, uid } from '../lib/format'
import { formatJalali } from '../lib/jalali'
import { Trash2 } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'

export function CategoriesView(){
  const s=useStore()
  const [name,setName]=useState(''); const [kind,setKind]=useState<'expense'|'income'>('expense')
  return <div className="space-y-4">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {s.categories.map(c=> <div key={c.id} className="card p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl grid place-items-center text-white" style={{background:c.color}}>{c.icon}</div>
        <div className="flex-1"><div className="font-medium text-sm">{c.name}</div><div className="text-xs text-slate-500">{c.kind==='income'?'درآمد':'هزینه'}</div></div>
        <button onClick={()=>s.removeCategory(c.id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
      </div>)}
    </div>
    <div className="card p-4 flex gap-3">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="نام دسته" className="border rounded-xl px-3 py-2 text-sm flex-1"/>
      <select value={kind} onChange={e=>setKind(e.target.value as any)} className="border rounded-xl px-3 py-2 text-sm"><option value="expense">هزینه</option><option value="income">درآمد</option></select>
      <button onClick={()=>{if(!name) return; s.addCategory({id:uid(), name, kind, color: kind==='income'?'#10b981':'#ef4444', icon: kind==='income'?'💰':'🧾'}); setName('')}} className="btn bg-slate-900 text-white">افزودن</button>
    </div>
  </div>
}
export function BudgetsView(){
  const s=useStore()
  const [cat,setCat]=useState(''); const [limit,setLimit]=useState('')
  const expenseByCat=(catId:string)=> s.transactions.filter(t=>t.type==='expense' && t.categoryId===catId).reduce((a,c)=>a+c.amount,0)
  return <div className="space-y-4">
    <div className="grid md:grid-cols-2 gap-4">
      {s.budgets.map(b=>{
        const c=s.categories.find(x=>x.id===b.categoryId); const spent=expenseByCat(b.categoryId); const pct=(spent/b.limit)*100
        return <div key={b.id} className="card p-4">
          <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl grid place-items-center text-white" style={{background:c?.color||'#0ea5e9'}}>{c?.icon}</div><div className="font-bold text-sm">{c?.name}</div><button onClick={()=>s.removeBudget(b.id)} className="ms-auto text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button></div>
          <div className="mt-3 text-xs text-slate-500">{formatMoney(spent,s.currency)} از {formatMoney(b.limit,s.currency)}</div>
          <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full" style={{width: Math.min(100,pct)+'%', background: pct>90?'#ef4444': pct>70?'#f59e0b':'#0ea5e9'}}/></div>
          <div className="text-xs mt-1" style={{color: pct>100?'#ef4444':'#64748b'}}>{pct.toFixed(0)}٪ مصرف شده</div>
        </div>
      })}
    </div>
    <div className="card p-4">
      <div className="font-bold mb-3">افزودن بودجه ماهانه</div>
      <div className="flex gap-3">
        <select value={cat} onChange={e=>setCat(e.target.value)} className="border rounded-xl px-3 py-2 text-sm flex-1"><option value="">دسته هزینه</option>{s.categories.filter(c=>c.kind==='expense').map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <input value={limit} onChange={e=>setLimit(e.target.value)} placeholder="سقف (تومان)" className="border rounded-xl px-3 py-2 text-sm flex-1"/>
        <button onClick={()=>{if(!cat||!limit) return; s.addBudget({id:uid(), categoryId:cat, month:'1403/08', limit:Number(limit)}); setCat(''); setLimit('')}} className="btn bg-slate-900 text-white">افزودن</button>
      </div>
    </div>
  </div>
}
export function GoalsView(){
  const s=useStore()
  const [title,setTitle]=useState(''); const [target,setTarget]=useState('')
  return <div className="space-y-4">
    <div className="grid md:grid-cols-2 gap-4">
      {s.goals.map(g=>{
        const pct=(g.saved/g.target)*100
        return <div key={g.id} className="card p-4">
          <div className="flex items-center gap-2"><div className="font-bold text-sm flex-1">{g.title}</div><button onClick={()=>s.removeGoal(g.id)} className="text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button></div>
          <div className="text-xs text-slate-500 mt-1">{formatMoney(g.saved,s.currency)} از {formatMoney(g.target,s.currency)}</div>
          <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full" style={{width: Math.min(100,pct)+'%', background:g.color}}/></div>
          <div className="flex gap-2 mt-3"><button onClick={()=>{const v=Number(prompt('مبلغ واریز به هدف', '500000')||0); if(v) s.updateGoal(g.id,{saved: g.saved+v})}} className="btn bg-slate-900 text-white text-xs flex-1">واریز</button><span className="text-xs py-2">{pct.toFixed(0)}٪</span></div>
        </div>
      })}
    </div>
    <div className="card p-4 flex gap-3">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان هدف (مثلا: خرید ماشین)" className="border rounded-xl px-3 py-2 text-sm flex-1"/>
      <input value={target} onChange={e=>setTarget(e.target.value)} placeholder="مبلغ هدف (تومان)" className="border rounded-xl px-3 py-2 text-sm flex-1"/>
      <button onClick={()=>{if(!title||!target) return; s.addGoal({id:uid(), title, target:Number(target), saved:0, color:'#0ea5e9'}); setTitle(''); setTarget('')}} className="btn bg-slate-900 text-white">افزودن</button>
    </div>
  </div>
}
export function DebtsView(){
  const s=useStore()
  const [title,setTitle]=useState(''); const [amount,setAmount]=useState(''); const [isOwe,setIsOwe]=useState(true)
  return <div className="space-y-4">
    <div className="grid md:grid-cols-2 gap-4">
      {s.debts.map(d=>{
        const pct=(d.paid/d.amount)*100
        return <div key={d.id} className="card p-4">
          <div className="flex items-center gap-2"><span className={`text-xs px-2 py-1 rounded-full ${d.isOwe?'bg-rose-50 text-rose-700':'bg-emerald-50 text-emerald-700'}`}>{d.isOwe?'بدهی من':'طلب من'}</span><div className="font-bold text-sm flex-1">{d.title}</div><button onClick={()=>s.removeDebt(d.id)} className="text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button></div>
          <div className="text-xs text-slate-500 mt-2">{formatMoney(d.paid,s.currency)} از {formatMoney(d.amount,s.currency)}</div>
          <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-900" style={{width: Math.min(100,pct)+'%' }}/></div>
          <button onClick={()=>{const v=Number(prompt('مبلغ پرداخت','500000')||0); if(v) s.updateDebt(d.id,{paid: Math.min(d.amount, d.paid+v)})}} className="btn bg-white border text-xs mt-3 w-full">ثبت پرداخت</button>
        </div>
      })}
    </div>
    <div className="card p-4 flex flex-wrap gap-3">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان بدهی/طلب" className="border rounded-xl px-3 py-2 text-sm flex-1 min-w-[180px]"/>
      <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="مبلغ (تومان)" className="border rounded-xl px-3 py-2 text-sm flex-1"/>
      <select value={String(isOwe)} onChange={e=>setIsOwe(e.target.value==='true')} className="border rounded-xl px-3 py-2 text-sm"><option value="true">بدهی من</option><option value="false">طلب من</option></select>
      <button onClick={()=>{if(!title||!amount) return; s.addDebt({id:uid(), title, amount:Number(amount), isOwe, paid:0}); setTitle(''); setAmount('')}} className="btn bg-slate-900 text-white">افزودن</button>
    </div>
  </div>
}
export function ReportsView(){
  const s=useStore()
  const monthly = useMemo(()=>{
    const m:Record<string,{name:string;income:number;expense:number}>={}
    s.transactions.forEach(t=>{
      const k=t.date.slice(0,7)
      if(!m[k]) m[k]={name:k,income:0,expense:0}
      if(t.type==='income') m[k].income+=t.amount
      if(t.type==='expense') m[k].expense+=t.amount
    })
    return Object.values(m)
  },[s.transactions])
  const byCat = useMemo(()=>{
    const mp:Record<string,number>={}
    s.transactions.filter(t=>t.type==='expense').forEach(t=>{
      const n=s.categories.find(c=>c.id===t.categoryId)?.name||'سایر'
      mp[n]=(mp[n]||0)+t.amount
    })
    return Object.entries(mp).map(([name,value])=>({name,value}))
  },[s.transactions,s.categories])
  const COLORS=['#0ea5e9','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899']
  return <div className="space-y-6">
    <div className="card p-4">
      <div className="font-bold mb-3">گزارش ماهانه</div>
      <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly}><XAxis dataKey="name"/><YAxis hide/><Tooltip/><Bar dataKey="income" name="درآمد" fill="#10b981" radius={[8,8,0,0]}/><Bar dataKey="expense" name="هزینه" fill="#ef4444" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div>
    </div>
    <div className="card p-4">
      <div className="font-bold mb-3">سهم دسته‌ها از کل هزینه</div>
      <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={byCat} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>{byCat.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>
    </div>
    <div className="card p-4">
      <div className="font-bold mb-2">تحلیل هوشمند</div>
      <ul className="text-sm leading-7 list-disc ps-5 text-slate-600">
        <li>بیشترین هزینه شما در دسته «{(byCat[0]?.name)||'-'}» است.</li>
        <li>نسبت هزینه به درآمد: {(() => { const inc=s.transactions.filter(t=>t.type==='income').reduce((a,c)=>a+c.amount,0); const exp=s.transactions.filter(t=>t.type==='expense').reduce((a,c)=>a+c.amount,0); return inc? Math.round(exp/inc*100)+'٪' : '-' })()}</li>
        <li>پیشنهاد: برای دسته‌های پرهزینه، بودجه ماهانه تعیین کنید.</li>
      </ul>
    </div>
  </div>
}
