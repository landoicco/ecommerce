package licaza.ecommerce.backend.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;
import java.util.List;
import licaza.ecommerce.backend.dto.ProductQueryDTO;
import licaza.ecommerce.backend.dto.ProductResponseDTO;
import licaza.ecommerce.backend.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ProductController.class)
@ActiveProfiles("test")
class ProductControllerIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private ProductService productService;

  @Test
  void getCatalog_UniversalSearchBySku_ReturnsHttp200AndPayload() throws Exception {
    ProductResponseDTO dummyResponse =
        new ProductResponseDTO(
            1L,
            "Ergonomic Mouse Logi",
            "SKU-LOGI-88",
            "Accessories",
            "Desc",
            new BigDecimal("45.00"),
            50,
            0.15);

    Page<ProductResponseDTO> dummyPage =
        new PageImpl<>(List.of(dummyResponse), PageRequest.of(0, 10), 1);

    when(productService.getCatalog(any(ProductQueryDTO.class))).thenReturn(dummyPage);

    mockMvc
        .perform(
            get("/api/products/catalog")
                .param("search", "LOGI")
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content", hasSize(1)))
        .andExpect(jsonPath("$.content[0].name").value("Ergonomic Mouse Logi"))
        .andExpect(jsonPath("$.content[0].sku").value("SKU-LOGI-88"))
        .andExpect(jsonPath("$.totalElements").value(1));
  }
}
