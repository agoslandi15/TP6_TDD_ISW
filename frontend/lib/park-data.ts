export interface ParkSchedule {
  dayOfWeek: number // 0 = Sunday, 6 = Saturday
  isOpen: boolean
}

// Park is open Tuesday to Sunday (closed on Mondays)
export const parkSchedule: ParkSchedule[] = [
  { dayOfWeek: 0, isOpen: true }, // Sunday
  { dayOfWeek: 1, isOpen: false }, // Monday - CLOSED
  { dayOfWeek: 2, isOpen: true }, // Tuesday
  { dayOfWeek: 3, isOpen: true }, // Wednesday
  { dayOfWeek: 4, isOpen: true }, // Thursday
  { dayOfWeek: 5, isOpen: true }, // Friday
  { dayOfWeek: 6, isOpen: true }, // Saturday
]

export function isParkOpen(date: Date): boolean {
  const dayOfWeek = date.getDay()
  const schedule = parkSchedule.find((s) => s.dayOfWeek === dayOfWeek)
  return schedule?.isOpen ?? false
}

export function isChristmas(date: Date): boolean {
  return date.getDate() === 25 && date.getMonth() === 11 // December 25
}

export function isNewYear(date: Date): boolean {
  return date.getDate() === 1 && date.getMonth() === 0 // January 1
}

export function isWithinOneMonth(date: Date): boolean {
  const today = new Date()
  const oneMonthFromNow = new Date()
  oneMonthFromNow.setMonth(today.getMonth() + 1)
  return date <= oneMonthFromNow
}

export function getMinDate(): string {
  const today = new Date()
  return today.toISOString().split("T")[0]
}

export interface Ticket {
  id: string
  userId: string
  visitDate: string
  quantity: number
  visitors: Array<{ age: number | null; passType: "VIP" | "Regular" }>
  paymentMethod: "cash" | "card"
  totalAmount: number
  purchaseDate: string
  status: "pending" | "confirmed" | "cancelled"
}

export const TICKET_PRICES = {
  regular: 5000,
  vip: 10000,
}

export function calculateTotal(visitors: Array<{ age: number | null; passType: "VIP" | "Regular" }>): number {
  return visitors.reduce((total, visitor) => {
    if (visitor.age === null) return total;
    
    const basePrice = visitor.passType === "VIP" ? TICKET_PRICES.vip : TICKET_PRICES.regular
    
    // Gratis para menores de 3 años y mayores de 60
    if (visitor.age <= 3 || visitor.age >= 60) {
      return total;
    }
    
    // 50% de descuento para edades entre 4 y 15
    if (visitor.age >= 4 && visitor.age <= 15) {
      return total + basePrice * 0.5;
    }
    
    // Precio completo para el resto
    return total + basePrice;
  }, 0)
}
