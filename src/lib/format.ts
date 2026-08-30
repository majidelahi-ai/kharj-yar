export function formatMoney(n:number, currency:'TOMAN'|'RIAL'='TOMAN'){
  const rial = currency==='RIAL' ? n*10 : n // store as Toman internally? we store toman; display *10 if rial
  // Actually store toman; convert for display
  const display = currency==='RIAL' ? n*10 : n
  return new Intl.NumberFormat('fa-IR').format(Math.round(display)) + (currency==='RIAL'?' ریال':' تومان')
}
export function formatNumber(n:number){ return new Intl.NumberFormat('fa-IR').format(n) }
export function clamp(n:number,a:number,b:number){ return Math.max(a,Math.min(b,n)) }
export function uid(){ return Math.random().toString(36).slice(2,9) }
