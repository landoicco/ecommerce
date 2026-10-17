package dev.licaza.itacatl.config;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import dev.licaza.itacatl.dto.*;
import dev.licaza.itacatl.service.ProductService;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class CSVMockDataConfig implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(CSVMockDataConfig.class);

  private final ProductService productService;

  public CSVMockDataConfig(ProductService productService) {
    this.productService = productService;
  }

  @Override
  public void run(String... args) throws Exception {
    // Load CSV file
    ClassPathResource resource = new ClassPathResource("products.csv");

    try (Reader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {

      CsvToBean<CSVProductRow> csvToBean =
          new CsvToBeanBuilder<CSVProductRow>(reader)
              .withType(CSVProductRow.class)
              .withIgnoreLeadingWhiteSpace(true)
              // If there is an error, log it and move to next line
              .withExceptionHandler(
                  exception -> {
                    log.warn(
                        "⏭️ CSV row ignored due to formatting error on line {}. Detail: {}",
                        exception.getLineNumber(),
                        exception.getMessage());
                    return null;
                  })
              .build();

      // Keep only valid rows
      List<CSVProductRow> validRows = csvToBean.parse();

      if (validRows.isEmpty()) {
        log.warn("📦 The CSV file did not contain any valid rows to process.");
        return;
      }

      // Transform valid CSV rows to our Product DTO
      List<ProductRequestDTO> dtoList =
          validRows.stream()
              .map(
                  row ->
                      new ProductRequestDTO(
                          row.getName(),
                          row.getSku(),
                          row.getDescription(),
                          row.getCategory(),
                          row.getPrice(),
                          row.getStock(),
                          row.getWeightKg()))
              .collect(Collectors.toList());

      // Save all valid products on a batch
      List<ProductResponseDTO> savedBatch = productService.createProductsBatch(dtoList);

      log.info(
          "📦 Processed {} valid CSV lines. Saved {} products in bulk.",
          dtoList.size(),
          savedBatch.size());

    } catch (Exception e) {
      // If there is a critical error
      log.error("❌ Unexpected failure reading the CSV file", e);
    }
  }
}
