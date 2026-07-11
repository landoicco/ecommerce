package licaza.ecommerce.backend.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import licaza.ecommerce.backend.domain.*;
import licaza.ecommerce.backend.dto.*;
import licaza.ecommerce.backend.repo.*;
import licaza.ecommerce.backend.service.ProductService;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductDatabaseService implements ProductService {

  private final ProductRepository productRepository;
  private final OrderRepository orderRepository;

  public ProductDatabaseService(
      ProductRepository productRepository, OrderRepository orderRepository) {
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
  }

  @Override
  public List<ProductResponseDTO> getAllProducts() {
    return productRepository.findAll().stream()
        .map(this::convertToResponseDTO)
        .collect(Collectors.toList());
  }

  @Override
  public ProductResponseDTO createProduct(ProductRequestDTO requestDTO) {
    Product product = new Product();
    product.setId(null);
    mapRequestToEntity(requestDTO, product);

    Product savedProduct = productRepository.save(product);
    return convertToResponseDTO(savedProduct);
  }

  @Override
  public List<ProductResponseDTO> createProductsBatch(List<ProductRequestDTO> requestDTOs) {
    // Set to identify duplicates on the CSV
    Set<String> seenSkusInBatch = new HashSet<>();

    // Get all SKUs that pass basic NULL filters
    List<String> skusInRequest =
        requestDTOs.stream()
            .filter(dto -> dto.price() != null && dto.stock() != null)
            .map(ProductRequestDTO::sku)
            .collect(Collectors.toList());

    // Get existing SKUs from database
    List<String> existingSkusInDb = productRepository.findSkuBySkuIn(skusInRequest);
    Set<String> existingSkusSet = new HashSet<>(existingSkusInDb); // Set to improve search speed

    // Filter in-memory
    List<Product> productsToSave =
        requestDTOs.stream()
            .filter(
                dto -> {
                  if (dto.price() == null) {
                    System.out.println(
                        "WARN: Skipping CSV row. Product with SKU '"
                            + dto.sku()
                            + "' has an invalid or missing price.");
                    return false;
                  }
                  if (dto.stock() == null) {
                    System.out.println(
                        "WARN: Skipping CSV row. Product with SKU '"
                            + dto.sku()
                            + "' has an invalid or missing stock.");
                    return false;
                  }
                  if (!seenSkusInBatch.add(dto.sku())) {
                    System.out.println(
                        "WARN: Skipping CSV row. SKU '"
                            + dto.sku()
                            + "' is duplicated within the same CSV file.");
                    return false;
                  }

                  // Validate using existing SKU set from database
                  if (existingSkusSet.contains(dto.sku())) {
                    System.out.println(
                        "WARN: Skipping product from CSV. SKU '"
                            + dto.sku()
                            + "' already exists in the database.");
                    return false;
                  }
                  return true;
                })
            .map(
                dto -> {
                  // Map only unique and valid entries
                  Product product = new Product();
                  product.setId(null);
                  product.setName(dto.name());
                  product.setSku(dto.sku());
                  product.setDescription(dto.description());
                  product.setCategory(dto.category());
                  product.setPrice(dto.price());
                  product.setStock(dto.stock());
                  product.setWeightKg(dto.weightKg());
                  return product;
                })
            .collect(Collectors.toList());

    if (productsToSave.isEmpty()) {
      System.out.println("INFO: No new or valid products found in the CSV to insert.");
      return List.of();
    }

    // Batch saving
    List<Product> savedProducts = productRepository.saveAll(productsToSave);

    return savedProducts.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
  }

  @Override
  public Optional<ProductResponseDTO> updateProduct(Long id, ProductRequestDTO requestDTO) {
    return productRepository
        .findById(id)
        .map(
            existingProduct -> {
              mapRequestToEntity(requestDTO, existingProduct);
              Product updatedProduct = productRepository.save(existingProduct);
              return convertToResponseDTO(updatedProduct);
            });
  }

  @Override
  public boolean deleteProduct(Long id) {
    if (!productRepository.existsById(id)) {
      return false;
    }
    productRepository.deleteById(id);
    return true;
  }

  @Override
  @Transactional // Atomic consistency
  public OrderResponseDTO purchaseProduct(PurchaseRequestDTO purchaseDTO) {
    // Search product in stock
    Product product =
        productRepository
            .findById(purchaseDTO.productId())
            .orElseThrow(
                () ->
                    new RuntimeException(
                        "ERROR: Product not found with ID: " + purchaseDTO.productId()));

    if (product.getStock() < purchaseDTO.quantity()) {
      System.out.println("WARN: Insufficient stock for product ID: " + product.getId());
      throw new RuntimeException("ERROR: Insufficient stock.");
    }

    // Get total cost
    BigDecimal totalAmount =
        product.getPrice().multiply(BigDecimal.valueOf(purchaseDTO.quantity()));

    // Create Order and change state to PENDING
    Order order = new Order();
    order.setProduct(product);
    order.setQuantity(purchaseDTO.quantity());
    order.setTotalAmount(totalAmount);
    order.setStatus(OrderStatus.PENDING);
    order.setCreatedAt(LocalDateTime.now());

    // Save order
    order = orderRepository.save(order);

    // Reduce stock
    product.setStock(product.getStock() - purchaseDTO.quantity());

    try {
      // Save product. @Version protect against race conditions
      productRepository.save(product);

      // [TEST] Simulate payment rejection, if user requests exactly 99 items
      if (purchaseDTO.quantity() == 99) {
        System.out.println("INFO: Simulating a declined payment gateway transition.");
        throw new RuntimeException("Payment rejected by bank.");
      }

      // At this point, Order is paid
      order.setStatus(OrderStatus.PAID);
      order = orderRepository.save(order);

      System.out.println("INFO: Checkout transition completed successfully. Order PAID.");
      return convertToOrderResponseDTO(order);

    } catch (ObjectOptimisticLockingFailureException e) {
      // Handling Race Conditions
      System.err.println("WARN: Race condition detected during checkout transition.");
      order.setStatus(OrderStatus.FAILED);
      orderRepository.save(order);
      throw new RuntimeException("ERROR: Product state changed during checkout. Please try again.");

    } catch (Exception e) {
      System.err.println("WARN: Payment failed. Rolling back stock transition.");
      order.setStatus(OrderStatus.FAILED);
      orderRepository.save(order); // Save the order as FAILED

      // Force exception to force Spring to rollback product stock
      throw new RuntimeException("ERROR: Checkout failed. " + e.getMessage());
    }
  }

  // Utility methods (Mappers)
  private void mapRequestToEntity(ProductRequestDTO dto, Product entity) {
    entity.setName(dto.name());
    entity.setSku(dto.sku());
    entity.setDescription(dto.description());
    entity.setCategory(dto.category());
    entity.setPrice(dto.price());
    entity.setStock(dto.stock());
    entity.setWeightKg(dto.weightKg());
  }

  private ProductResponseDTO convertToResponseDTO(Product entity) {
    return new ProductResponseDTO(
        entity.getId(),
        entity.getName(),
        entity.getSku(),
        entity.getDescription(),
        entity.getCategory(),
        entity.getPrice(),
        entity.getStock(),
        entity.getWeightKg());
  }

  private OrderResponseDTO convertToOrderResponseDTO(Order order) {
    return new OrderResponseDTO(
        order.getId(),
        order.getProduct().getId(),
        order.getProduct().getName(),
        order.getQuantity(),
        order.getTotalAmount(),
        order.getStatus().name(),
        order.getCreatedAt());
  }
}
