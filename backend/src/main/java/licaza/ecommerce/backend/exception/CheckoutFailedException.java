package licaza.ecommerce.backend.exception;

import licaza.ecommerce.backend.dto.OrderResponseDTO;

public class CheckoutFailedException extends RuntimeException {
  private final OrderResponseDTO orderResponse;

  public CheckoutFailedException(String message, OrderResponseDTO orderResponse) {
    super(message);
    this.orderResponse = orderResponse;
  }

  public OrderResponseDTO getOrderResponse() {
    return orderResponse;
  }
}
