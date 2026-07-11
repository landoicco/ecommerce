package licaza.ecommerce.backend.exception;

import jakarta.persistence.EntityNotFoundException;
import licaza.ecommerce.backend.dto.OrderResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(CheckoutFailedException.class)
  public ResponseEntity<OrderResponseDTO> handleCheckoutFailed(CheckoutFailedException ex) {
    // Get the object with the all data and message
    OrderResponseDTO failedOrder = ex.getOrderResponse();

    // Return 422 Unprocessable Entity with the same structure
    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(failedOrder);
  }

  @ExceptionHandler(InsufficientStockException.class)
  public ResponseEntity<String> handleInsufficientStock(InsufficientStockException ex) {
    // Return 400 Bad Request with the insufficient stock explanation
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
  }

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<String> handleNotFound(EntityNotFoundException ex) {
    // Return 404 Not Found
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
  }
}
