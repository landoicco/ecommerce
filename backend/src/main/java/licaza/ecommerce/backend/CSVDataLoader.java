package licaza.ecommerce.backend;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import java.util.stream.Collectors;
import licaza.ecommerce.backend.dto.*;
import licaza.ecommerce.backend.service.ProductService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class CSVDataLoader implements CommandLineRunner {

  private final ProductService productService;

  public CSVDataLoader(ProductService productService) {
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
                    System.err.println(
                        "WARN: CSV row ignored due to formatting error on line "
                            + exception.getLineNumber()
                            + ". Detail: "
                            + exception.getMessage());
                    return null;
                  })
              .build();

      // Keep only valid rows
      List<CSVProductRow> validRows = csvToBean.parse();

      if (validRows.isEmpty()) {
        System.out.println("WARN: The CSV file did not contain any valid rows to process.");
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

      System.out.println(
          "INFO: [CSV Success] Processed "
              + dtoList.size()
              + " valid lines. "
              + "Successfully saved "
              + savedBatch.size()
              + " products in bulk.");

    } catch (Exception e) {
      // If there is a critical error
      System.err.println(
          "ERROR: Critical and unexpected failure reading CSV file: " + e.getMessage());
    }
  }
}
