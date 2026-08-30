// @ts-ignore
import * as jalaali from 'jalaali-js'

const faMonths = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']
const faWeekDays = ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنج‌شنبه','جمعه','شنبه']

export function toJalali(date: Date){
  const {jy,jm,jd} = jalaali.toJalaali(date)
  return {jy,jm,jd}
}
export function formatJalali(dateStr: string){
  const d = new Date(dateStr)
  const {jy,jm,jd} = jalaali.toJalaali(d)
  return `${jd} ${faMonths[jm-1]} ${jy}`
}
export function formatJalaliFull(dateStr: string){
  const d = new Date(dateStr)
  const {jy,jm,jd} = jalaali.toJalaali(d)
  const w = faWeekDays[d.getDay()]
  return `${w}، ${jd} ${faMonths[jm-1]} ${jy}`
}
export function jalaliMonthKey(dateStr: string){
  const d = new Date(dateStr)
  const {jy,jm} = jalaali.toJalaali(d)
  return `${jy}/${String(jm).padStart(2,'0')}`
}
export function nowJalaliLabel(){
  const {jy,jm,jd} = jalaali.toJalaali(new Date())
  return `${jd} ${faMonths[jm-1]} ${jy}`
}
export function toGregorian(jy:number,jm:number,jd:number){
  return jalaali.toGregorian(jy,jm,jd)
}
export const monthsList = faMonths
