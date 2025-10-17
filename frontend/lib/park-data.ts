export interface park_schedule {
  day_of_week: number // 0 = Sunday, 6 = Saturday
  is_open: boolean
}

// Park is open Tuesday to Sunday (closed on Mondays)
export const park_schedule: park_schedule[] = [
  { day_of_week: 0, is_open: true }, // Sunday
  { day_of_week: 1, is_open: false }, // Monday - CLOSED
  { day_of_week: 2, is_open: true }, // Tuesday
  { day_of_week: 3, is_open: true }, // Wednesday
  { day_of_week: 4, is_open: true }, // Thursday
  { day_of_week: 5, is_open: true }, // Friday
  { day_of_week: 6, is_open: true }, // Saturday
]

export function is_park_open(date: Date): boolean {
  const day_of_week = date.getDay()
  const schedule = park_schedule.find((s: park_schedule) => s.day_of_week === day_of_week)
  return schedule?.is_open ?? false
}

export function is_christmas(date: Date): boolean {
  return date.getDate() === 25 && date.getMonth() === 11 // December 25
}

export function is_new_year(date: Date): boolean {
  return date.getDate() === 1 && date.getMonth() === 0 // January 1
}

export function is_within_one_month(date: Date): boolean {
  const today = new Date()
  const one_month_from_now = new Date()
  one_month_from_now.setMonth(today.getMonth() + 1)
  return date <= one_month_from_now
}

export function get_min_date(): string {
  const today = new Date()
  return today.toISOString().split("T")[0]
}

export interface Ticket {
  id: string
  user_id: string
  visit_date: string
  quantity: number
  visitors: Array<{ age: number | null; pass_type: "VIP" | "Regular" }>
  payment_method: "cash" | "card"
  total_amount: number
  purchase_date: string
  status: "pending" | "confirmed" | "cancelled"
}

export const TICKET_PRICES = {
  regular: 5000,
  vip: 10000,
}

export function calculate_total(visitors: Array<{ age: number | null; pass_type: "VIP" | "Regular" }>): number {
  return visitors.reduce((total, visitor) => {
    if (visitor.age === null) return total;
    
    const base_price = visitor.pass_type === "VIP" ? TICKET_PRICES.vip : TICKET_PRICES.regular
    
    // Gratis para menores de 3 años y mayores de 60
    if (visitor.age <= 3 || visitor.age >= 60) {
      return total;
    }
    
    // 50% de descuento para edades entre 4 y 15
    if (visitor.age >= 4 && visitor.age <= 15) {
      return total + base_price * 0.5;
    }
    
    // Precio completo para el resto
    return total + base_price;
  }, 0)
}
