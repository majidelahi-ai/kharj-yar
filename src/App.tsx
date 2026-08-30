import { useState, useMemo } from 'react'
import { useStore } from './store/useStore'
import { formatMoney } from './lib/format'
import { formatJalali, nowJalaliLabel } from './lib/jalali'
import { LayoutDashboard, Wallet, ArrowLeftRight, Tag, Target, HandCoins, BarChart3, PieChart, Settings2, Plus, Search, Trash2, Edit3, Download, TrendingUp, TrendingDown, Sparkles } from 'lucide-react'
import { PieChart as RPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, Legend } from 'recharts'
import { TransactionsView, AccountsView } from './components/Views'
import { CategoriesView, BudgetsView, GoalsView, DebtsView, ReportsView } from './components/MoreViews'
import { TxModal } from './components/TxModal'

type View = 'dashboard'|'transactions'|'accounts'|'categories'|'budgets'|'goals'|'debts'|'reports'

export default function App(){
  const [view,setView]=useState<View>('dashboard')
  const [q,setQ]=useState('')
  const [showTx,setShowTx]=useState(false)
  const s = useStore()
  const totalBalance = useMemo(()=> s.accounts.reduce((a,c)=>a+c.balance,0),[s.accounts])
  const income = useMemo(()=> s.transactions.filter(t=>t.type==='income').reduce((a,c)=>a+c.amount,0),[s.transactions])
  const expense = useMemo(()=> s.transactions.filter(t=>t.type==='expense').reduce((a,c)=>a+c.amount,0),[s.transactions])

  const filteredTx = useMemo(()=> s.transactions.filter(t=> !q || t.title.includes(q)),[s.transactions,q])

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8fafc] text-slate-800">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white grid place-items-center font-bold">خ</div>
          <div className="leading-tight">
            <div className="font-extrabold">خرج یار</div>
            <div className="text-xs text-slate-500">{nowJalaliLabel()} — مدیریت مالی شخصی</div>
          </div>
          <div className="ms-auto hidden md:flex items-center gap-2">
            <span className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-full">موجودی کل: {formatMoney(totalBalance, s.currency)}</span>
            <select value={s.currency} onChange={e=>s.setCurrency(e.target.value as any)} className="text-sm border rounded-xl px-3 py-2">
              <option value="TOMAN">تومان</option><option value="RIAL">ریال</option>
            </select>
          </div>
          <button onClick={()=>setShowTx(true)} className="btn bg-slate-900 text-white ms-2"><Plus size={16}/> تراکنش جدید</button>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6 grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2">
          <nav className="card p-2 sticky top-[72px]">
            {[
              ['dashboard','داشبورد',LayoutDashboard],
              ['transactions','تراکنش‌ها',ArrowLeftRight],
              ['accounts','حساب‌ها',Wallet],
              ['categories','دسته‌بندی',Tag],
              ['budgets','بودجه',PieChart],
              ['goals','اهداف',Target],
              ['debts','بدهی',HandCoins],
              ['reports','گزارش‌ها',BarChart3],
            ].map(([id,label,Icon]:any)=>(
              <button key={id} onClick={()=>setView(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${view===id?'bg-slate-900 text-white':'hover:bg-slate-50 text-slate-700'}`}>
                <Icon size={18}/>{label}
              </button>
            ))}
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100">
              <div className="text-sm font-bold flex items-center gap-2"><Sparkles size={16} className="text-sky-600"/> تحلیل هوشمند</div>
              <p className="text-xs text-slate-600 mt-1 leading-5">هزینه خوراک شما نسبت به ماه قبل ۱۲٪ کمتر شده. آفرین!</p>
            </div>
          </nav>
        </aside>

        <main className="col-span-12 lg:col-span-9 xl:col-span-10 space-y-6">
          {view==='dashboard' && <Dashboard income={income} expense={expense} totalBalance={totalBalance} />}
          {view==='transactions' && <TransactionsView q={q} setQ={setQ} filtered={filteredTx} onNew={()=>setShowTx(true)} />}
          {view==='accounts' && <AccountsView />}
          {view==='categories' && <CategoriesView />}
          {view==='budgets' && <BudgetsView />}
          {view==='goals' && <GoalsView />}
          {view==='debts' && <DebtsView />}
          {view==='reports' && <ReportsView />}
        </main>
      </div>

      {showTx && <TxModal onClose={()=>setShowTx(false)} />}
      <footer className="text-center text-xs text-slate-400 py-8">ساخته شده با ♥ — خرج یار • نسخه ۱.۰ • کاملا آفلاین و امن — تومان / ریال • تقویم شمسی</footer>
    </div>
  )
}

function Stat({title,value,sub,icon,accent}:{title:string;value:string;sub:string;icon:any;accent:string}){
  return <div className="card p-4 flex items-center gap-4">
    <div className="w-12 h-12 rounded-2xl grid place-items-center text-white" style={{background:accent}}>{icon}</div>
    <div><div className="text-xs text-slate-500">{title}</div><div className="font-extrabold text-[15px]">{value}</div><div className="text-xs text-slate-400">{sub}</div></div>
  </div>
}

function Dashboard({income,expense,totalBalance}:{income:number;expense:number;totalBalance:number}){
  const s=useStore()
  const data = useMemo(()=>{
    const map:Record<string,{name:string;income:number;expense:number}>={ }
    s.transactions.forEach(t=>{
      const k=(t.date).slice(0,7)
      if(!map[k]) map[k]={name:k,income:0,expense:0}
      if(t.type==='income') map[k].income+=t.amount
      if(t.type==='expense') map[k].expense+=t.amount
    })
    return Object.values(map).slice(-6)
  },[s.transactions])
  const expenseByCat = useMemo(()=>{
    const m:Record<string,number>={}
    s.transactions.filter(t=>t.type==='expense').forEach(t=>{
      const cat = s.categories.find(c=>c.id===t.categoryId)?.name || 'سایر'
      m[cat]=(m[cat]||0)+t.amount
    })
    return Object.entries(m).map(([name,value])=>({name,value}))
  },[s.transactions,s.categories])
  const COLORS=['#0ea5e9','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4']
  return <div className="space-y-6">
    <div className="grid md:grid-cols-3 gap-4">
      <Stat title="موجودی کل" value={formatMoney(totalBalance,s.currency)} sub="مجموع حساب‌ها" icon={<Wallet size={20}/>} accent="linear-gradient(135deg,#0ea5e9,#6366f1)"/>
      <Stat title="درآمد" value={formatMoney(income,s.currency)} sub="کل درآمد ثبت‌شده" icon={<TrendingUp size={20}/>} accent="linear-gradient(135deg,#10b981,#06b6d4)"/>
      <Stat title="هزینه" value={formatMoney(expense,s.currency)} sub="کل هزینه‌ها" icon={<TrendingDown size={20}/>} accent="linear-gradient(135deg,#ef4444,#f59e0b)"/>
    </div>
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="card p-4 lg:col-span-2">
        <div className="font-bold mb-3">روند ماهانه — درآمد vs هزینه</div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="name" /><YAxis hide/><Tooltip/><Legend/>
              <Area type="monotone" dataKey="income" name="درآمد" stroke="#10b981" fill="#d1fae5"/>
              <Area type="monotone" dataKey="expense" name="هزینه" stroke="#ef4444" fill="#fee2e2"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card p-4">
        <div className="font-bold mb-3">هزینه بر اساس دسته</div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <RPie><Pie data={expenseByCat} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>{expenseByCat.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/></RPie>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    <div className="card p-4">
      <div className="font-bold mb-3">آخرین تراکنش‌ها</div>
      <div className="divide-y">
        {s.transactions.slice(0,5).map(t=>{
          const cat=s.categories.find(c=>c.id===t.categoryId)
          return <div key={t.id} className="flex items-center gap-3 py-3">
            <div className="w-10 h-10 rounded-xl grid place-items-center text-white" style={{background:cat?.color || '#94a3b8'}}>{cat?.icon || '•'}</div>
            <div className="flex-1"><div className="text-sm font-medium">{t.title}</div><div className="text-xs text-slate-500">{formatJalali(t.date)} • {cat?.name || 'انتقال'}</div></div>
            <div className={`text-sm font-extrabold ${t.type==='income'?'text-emerald-600': t.type==='expense'?'text-rose-600':'text-slate-700'}`}>{t.type==='expense'?'-':'+'}{formatMoney(t.amount,s.currency)}</div>
          </div>
        })}
      </div>
    </div>
  </div>
}
