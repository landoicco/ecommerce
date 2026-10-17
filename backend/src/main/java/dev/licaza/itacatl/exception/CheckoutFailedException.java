package dev.licaza.itacatl.exception;

import dev.licaza.itacatl.dto.OrderResponseDTO;

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
