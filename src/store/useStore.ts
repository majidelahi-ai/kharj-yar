import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Currency = 'TOMAN'|'RIAL'
export type TxType = 'income'|'expense'|'transfer'
export type AccountType = 'cash'|'card'|'bank'|'wallet'
export type CategoryKind = 'income'|'expense'

export interface Account{ id:string; name:string; type:AccountType; color:string; icon:string; balance:number }
export interface Category{ id:string; name:string; kind:CategoryKind; color:string; icon:string }
export interface Transaction{ id:string; title:string; amount:number; type:TxType; categoryId?:string; accountId:string; toAccountId?:string; date:string; note?:string }
export interface Budget{ id:string; categoryId:string; month:string; limit:number }
export interface Goal{ id:string; title:string; target:number; saved:number; deadline?:string; color:string }
export interface Debt{ id:string; title:string; amount:number; isOwe:boolean; dueDate?:string; paid:number }

type State = {
  currency: Currency
  categories: Category[]
  accounts: Account[]
  transactions: Transaction[]
  budgets: Budget[]
  goals: Goal[]
  debts: Debt[]
  setCurrency:(c:Currency)=>void
  addTransaction:(t:Transaction)=>void
  updateTransaction:(id:string,patch:Partial<Transaction>)=>void
  removeTransaction:(id:string)=>void
  addAccount:(a:Account)=>void
  updateAccount:(id:string,patch:Partial<Account>)=>void
  removeAccount:(id:string)=>void
  addCategory:(c:Category)=>void
  updateCategory:(id:string,patch:Partial<Category>)=>void
  removeCategory:(id:string)=>void
  addBudget:(b:Budget)=>void
  updateBudget:(id:string,patch:Partial<Budget>)=>void
  removeBudget:(id:string)=>void
  addGoal:(g:Goal)=>void
  updateGoal:(id:string,patch:Partial<Goal>)=>void
  removeGoal:(id:string)=>void
  addDebt:(d:Debt)=>void
  updateDebt:(id:string,patch:Partial<Debt>)=>void
  removeDebt:(id:string)=>void
  seedIfEmpty:()=>void
}

// دیتای اولیه خالی - کاربر خودش حساب و دسته‌بندی می‌سازد

export const useStore = create<State>()(persist((set,get)=>({
  currency:'TOMAN',
  categories: [],
  accounts: [],
  transactions: [],
  budgets: [],
  goals: [],
  debts: [],
  setCurrency:(currency)=> set({currency}),
  addTransaction:(t)=> set({transactions:[t,...get().transactions]}),
  updateTransaction:(id,patch)=> set({transactions:get().transactions.map(x=> x.id===id? {...x,...patch}:x)}),
  removeTransaction:(id)=> set({transactions:get().transactions.filter(x=> x.id!==id)}),
  addAccount:(a)=> set({accounts:[...get().accounts,a]}),
  updateAccount:(id,patch)=> set({accounts:get().accounts.map(x=> x.id===id? {...x,...patch}:x)}),
  removeAccount:(id)=> set({accounts:get().accounts.filter(x=> x.id!==id)}),
  addCategory:(c)=> set({categories:[...get().categories,c]}),
  updateCategory:(id,patch)=> set({categories:get().categories.map(x=> x.id===id? {...x,...patch}:x)}),
  removeCategory:(id)=> set({categories:get().categories.filter(x=> x.id!==id)}),
  addBudget:(b)=> set({budgets:[...get().budgets,b]}),
  updateBudget:(id,patch)=> set({budgets:get().budgets.map(x=> x.id===id? {...x,...patch}:x)}),
  removeBudget:(id)=> set({budgets:get().budgets.filter(x=> x.id!==id)}),
  addGoal:(g)=> set({goals:[...get().goals,g]}),
  updateGoal:(id,patch)=> set({goals:get().goals.map(x=> x.id===id? {...x,...patch}:x)}),
  removeGoal:(id)=> set({goals:get().goals.filter(x=> x.id!==id)}),
  addDebt:(d)=> set({debts:[...get().debts,d]}),
  updateDebt:(id,patch)=> set({debts:get().debts.map(x=> x.id===id? {...x,...patch}:x)}),
  removeDebt:(id)=> set({debts:get().debts.filter(x=> x.id!==id)}),
  seedIfEmpty:()=>{},
}),{name:'kharjyar-finance-v1'}))
