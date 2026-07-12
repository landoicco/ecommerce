package licaza.ecommerce.backend.exception;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import licaza.ecommerce.backend.dto.OrderResponseDTO;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

class GlobalExceptionHandlerTest {

  private final GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();

  @Test
  void handleCheckoutFailed_ReturnsStatus422WithDtoBody() {
    OrderResponseDTO dummyFailedOrder =
        new OrderResponseDTO(
            1L,
            2L,
            "Product Test",
            5,
            new BigDecimal("50.00"),
            "FAILED",
            "ERROR: Payment rejected",
            LocalDateTime.now());
    CheckoutFailedException exception =
        new CheckoutFailedException("Payment failed", dummyFailedOrder);

    ResponseEntity<OrderResponseDTO> response = exceptionHandler.handleCheckoutFailed(exception);

    assertNotNull(response);
    assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, response.getStatusCode()); // Verify code 422
    assertEquals("FAILED", response.getBody().status()); // Verify DTO on body
    assertEquals("ERROR: Payment rejected", response.getBody().message());
  }

  @Test
  void handleInsufficientStock_ReturnsStatus400WithTextMessage() {
    InsufficientStockException exception = new InsufficientStockException("ERROR: Out of stock");

    ResponseEntity<String> response = exceptionHandler.handleInsufficientStock(exception);

    assertNotNull(response);
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode()); // Verify code 400
    assertEquals("ERROR: Out of stock", response.getBody()); // Verify we get plain text
  }
}
