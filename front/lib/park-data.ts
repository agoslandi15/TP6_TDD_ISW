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

export function getMinDate(): string {
  const today = new Date()
  return today.toISOString().split("T")[0]
}

export interface Ticket {
  id: string
  userId: string
  visitDate: string
  quantity: number
  visitors: Array<{ age: number; passType: "VIP" | "Regular" }>
  paymentMethod: "cash" | "card"
  totalAmount: number
  purchaseDate: string
  status: "pending" | "confirmed" | "cancelled"
}

export const TICKET_PRICES = {
  regular: 1500,
  vip: 3000,
}

export function calculateTotal(visitors: Array<{ age: number; passType: "VIP" | "Regular" }>): number {
  return visitors.reduce((total, visitor) => {
    const basePrice = visitor.passType === "VIP" ? TICKET_PRICES.vip : TICKET_PRICES.regular
    // Children under 5 get 50% discount
    const discount = visitor.age < 5 ? 0.5 : 0
    return total + basePrice * (1 - discount)
  }, 0)
}
