import { useState } from 'react'
import { useStore } from '../store/useStore'
import { uid } from '../lib/format'

export function TxModal({onClose}:{onClose:()=>void}){
  const s=useStore()
  const [type,setType]=useState<'income'|'expense'|'transfer'>('expense')
  const [title,setTitle]=useState(''); const [amount,setAmount]=useState(''); const [cat,setCat]=useState(s.categories[0]?.id||''); const [acc,setAcc]=useState(s.accounts[0]?.id||''); const [toAcc,setToAcc]=useState(s.accounts[1]?.id||''); const [date,setDate]=useState(new Date().toISOString().slice(0,10))
  const submit=()=>{
    if(!title || !amount) return
    s.addTransaction({id:uid(), title, amount:Number(amount), type, categoryId: type==='transfer'? undefined: cat, accountId:acc, toAccountId: type==='transfer'? toAcc: undefined, date})
    onClose()
  }
  return <div className="fixed inset-0 z-50 grid place-items-center p-4">
    <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"/>
    <div className="relative card p-6 w-full max-w-[560px] space-y-4">
      <div className="font-extrabold text-lg">تراکنش جدید</div>
      <div className="flex gap-2">
        {(['expense','income','transfer'] as const).map(k=> <button key={k} onClick={()=>setType(k)} className={`btn flex-1 ${type===k?'bg-slate-900 text-white':'bg-slate-100'}`}>{k==='expense'?'هزینه':k==='income'?'درآمد':'انتقال'}</button>)}
      </div>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان" className="w-full border rounded-xl px-3 py-2.5 text-sm"/>
      <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="مبلغ (تومان)" className="w-full border rounded-xl px-3 py-2.5 text-sm"/>
      {type!=='transfer' ? <select value={cat} onChange={e=>setCat(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-sm">{s.categories.filter(c=> c.kind=== (type==='income'?'income':'expense')).map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}</select> : null}
      <div className="grid grid-cols-2 gap-3">
        <select value={acc} onChange={e=>setAcc(e.target.value)} className="border rounded-xl px-3 py-2.5 text-sm">{s.accounts.map(a=> <option key={a.id} value={a.id}>{a.name}</option>)}</select>
        {type==='transfer' ? <select value={toAcc} onChange={e=>setToAcc(e.target.value)} className="border rounded-xl px-3 py-2.5 text-sm">{s.accounts.map(a=> <option key={a.id} value={a.id}>{a.name}</option>)}</select> : <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border rounded-xl px-3 py-2.5 text-sm"/>}
      </div>
      {type!=='transfer' && <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-sm"/>}
      <div className="flex gap-2 justify-end"><button onClick={onClose} className="btn bg-white border">انصراف</button><button onClick={submit} className="btn bg-slate-900 text-white">ذخیره</button></div>
    </div>
  </div>
}
