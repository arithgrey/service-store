export function type_of_payment(payment_on_delivery) {
    return payment_on_delivery ? "Pago contra entrega" : "Orden Pagada";
}
  