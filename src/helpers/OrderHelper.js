export function type_of_payment(payment_on_delivery) {
    return payment_on_delivery ? "Pago contra entrega" : "Orden Pagada";
}
export function get_status_label(order){

    let status = order.status;
    let choices = order.status_choices;
    const statusOption = choices.find(
      (option) => option.key === status
    );
    return statusOption.label;
}

export function get_order_bg_class(order) {
  switch (order.status) {
    case "canceled":
      return "bg-slate-100";
    default:
      return "";
  }
}