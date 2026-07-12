package licaza.ecommerce.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.Optional;
import licaza.ecommerce.backend.domain.Order;
import licaza.ecommerce.backend.domain.OrderStatus;
import licaza.ecommerce.backend.domain.Product;
import licaza.ecommerce.backend.dto.*;
import licaza.ecommerce.backend.exception.InsufficientStockException;
import licaza.ecommerce.backend.repo.OrderRepository;
import licaza.ecommerce.backend.repo.ProductRepository;
import licaza.ecommerce.backend.service.impl.ProductDatabaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductDatabaseServiceTest {

  @Mock private ProductRepository productRepository;

  @Mock private OrderRepository orderRepository;

  @InjectMocks private ProductDatabaseService productService;

  private Product dummyProduct;

  @BeforeEach
  void setUp() {
    dummyProduct = new Product();
    dummyProduct.setId(1L);
    dummyProduct.setName("Laptop Gamer");
    dummyProduct.setPrice(new BigDecimal("1000.00"));
    dummyProduct.setStock(10);
    dummyProduct.setVersion(0L);
  }

  @Test
  void purchaseProduct_SuccessfulTransition_ReturnsPaidOrder() {
    PurchaseRequestDTO request = new PurchaseRequestDTO(1L, 2);

    Order dummyOrder = new Order();
    dummyOrder.setId(100L);
    dummyOrder.setProduct(dummyProduct);
    dummyOrder.setQuantity(2);
    dummyOrder.setTotalAmount(new BigDecimal("2000.00"));
    dummyOrder.setStatus(OrderStatus.PAID);

    when(productRepository.findById(1L)).thenReturn(Optional.of(dummyProduct));
    when(orderRepository.save(any(Order.class))).thenReturn(dummyOrder);
    when(productRepository.save(any(Product.class))).thenReturn(dummyProduct);

    OrderResponseDTO response = productService.purchaseProduct(request);

    assertNotNull(response);
    assertEquals(100L, response.orderId());
    assertEquals("PAID", response.status());
    assertEquals(new BigDecimal("2000.00"), response.totalAmount());
    assertEquals(8, dummyProduct.getStock()); // Stock change from 10 to 8

    // Verify calls to repos
    verify(productRepository, times(1)).findById(1L);
    verify(productRepository, times(1)).save(any(Product.class));
  }

  @Test
  void purchaseProduct_InsufficientStock_ThrowsExceptionAndDoesNotSave() {
    // User ask for 15 units, there are only 10
    PurchaseRequestDTO request = new PurchaseRequestDTO(1L, 15);
    when(productRepository.findById(1L)).thenReturn(Optional.of(dummyProduct));

    // Verify exception is thrown
    assertThrows(
        InsufficientStockException.class,
        () -> {
          productService.purchaseProduct(request);
        });

    // Ensure stock did not changed and repos were not called
    assertEquals(10, dummyProduct.getStock());
    verify(orderRepository, never()).save(any(Order.class));
    verify(productRepository, never()).save(any(Product.class));
  }

  @Test
  void purchaseProduct_CardDeclined_SavesOrderAsFailedAndThrowsException() {
    // Try to buy 99 items, trigger credit card error
    PurchaseRequestDTO request = new PurchaseRequestDTO(1L, 99);
    dummyProduct.setStock(200);

    Order failedOrder = new Order();
    failedOrder.setId(200L);
    failedOrder.setProduct(dummyProduct); // avoid NullPointerException
    failedOrder.setQuantity(99);
    failedOrder.setTotalAmount(new java.math.BigDecimal("99000.00"));
    failedOrder.setStatus(OrderStatus.FAILED);
    failedOrder.setCreatedAt(java.time.LocalDateTime.now());

    when(productRepository.findById(1L)).thenReturn(Optional.of(dummyProduct));
    when(productRepository.save(any(Product.class))).thenReturn(dummyProduct);

    // Repo will return our failed order
    when(orderRepository.save(any(Order.class))).thenReturn(failedOrder);

    // Verify we get the expected exception
    assertThrows(
        licaza.ecommerce.backend.exception.CheckoutFailedException.class,
        () -> {
          productService.purchaseProduct(request);
        });

    // Verify order was registered as FAILED
    verify(orderRepository, atLeastOnce())
        .save(argThat(order -> order.getStatus() == OrderStatus.FAILED));
  }

  @Test
  void purchaseProduct_RaceCondition_SavesOrderAsFailedAndThrowsException() {
    // Force error of @Version storing the product
    PurchaseRequestDTO request = new PurchaseRequestDTO(1L, 1);

    Order failedOrder = new Order();
    failedOrder.setId(300L);
    failedOrder.setProduct(dummyProduct); // avoid NullPointerException
    failedOrder.setQuantity(1);
    failedOrder.setTotalAmount(new java.math.BigDecimal("1000.00"));
    failedOrder.setStatus(OrderStatus.FAILED);
    failedOrder.setCreatedAt(java.time.LocalDateTime.now());

    when(productRepository.findById(1L)).thenReturn(Optional.of(dummyProduct));

    // Simulate version issues when save(). JPA detects this
    when(productRepository.save(any(Product.class)))
        .thenThrow(
            new org.springframework.orm.ObjectOptimisticLockingFailureException(Product.class, 1L));

    when(orderRepository.save(any(Order.class))).thenReturn(failedOrder);

    // Verify CheckoutFailedException is throw
    assertThrows(
        licaza.ecommerce.backend.exception.CheckoutFailedException.class,
        () -> {
          productService.purchaseProduct(request);
        });

    // Verify order was saved as FAILED
    verify(orderRepository, atLeastOnce())
        .save(argThat(order -> order.getStatus() == OrderStatus.FAILED));
  }

  @Test
  void createProductsBatch_FiltersDuplicatesAndNulls_SavesOnlyValidProducts() {
    // Give a bundle of useful and broken data
    ProductRequestDTO validDto =
        new ProductRequestDTO(
            "Product A", "SKU-A", "Desc", "Cat", new java.math.BigDecimal("10.00"), 5, 1.0);
    ProductRequestDTO nullPriceDto =
        new ProductRequestDTO("Product B", "SKU-B", "Desc", "Cat", null, 5, 1.0);
    ProductRequestDTO duplicateDto =
        new ProductRequestDTO(
            "Product C", "SKU-A", "Desc", "Cat", new java.math.BigDecimal("20.00"), 2, 1.0);

    java.util.List<ProductRequestDTO> requestList =
        java.util.List.of(validDto, nullPriceDto, duplicateDto);

    // Simulate DB says that product do not exist
    when(productRepository.findSkuBySkuIn(anyList())).thenReturn(java.util.List.of());
    when(productRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

    java.util.List<licaza.ecommerce.backend.dto.ProductResponseDTO> response =
        productService.createProductsBatch(requestList);

    assertNotNull(response);
    // Use ArgumentCaptor to get List objects
    org.mockito.ArgumentCaptor<java.util.List> listCaptor =
        org.mockito.ArgumentCaptor.forClass(java.util.List.class);

    // Verify method was called and get argument
    verify(productRepository, times(1)).saveAll(listCaptor.capture());

    // Get list from DB
    java.util.List<?> capturedList = listCaptor.getValue();

    // Assert only one element was saved, the valid one
    assertEquals(1, capturedList.size());
  }
}
