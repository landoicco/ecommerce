package licaza.ecommerce.backend;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import licaza.ecommerce.backend.domain.Product;
import licaza.ecommerce.backend.repo.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class CSVDataLoader implements CommandLineRunner {

  private final ProductRepository productRepository;

  public CSVDataLoader(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  @Override
  public void run(String... args) throws Exception {
    // Avoid duplicate data
    if (productRepository.count() > 0) {
      System.out.println("Data exists in database. Skipping data loading");
      return;
    }

    System.out.println("Loading product data from CSV file");

    // Get CSV file from src/main/resources/
    ClassPathResource resource = new ClassPathResource("products.csv");

    try (BufferedReader br =
        new BufferedReader(
            new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

      String line;
      boolean isFirstLine = true;

      while ((line = br.readLine()) != null) {
        // Ignore CSV header
        if (isFirstLine) {
          isFirstLine = false;
          continue;
        }

        // Process CSV
        String[] data = line.split(",");
        if (data.length == 7) {
          String name = data[0].trim(),
              sku = data[1].trim(),
              description = data[2].trim(),
              category = data[3].trim(),
              priceString = data[4].replace("$", "").trim(),
              stockString = data[5].trim(),
              weightKgString = data[6].trim();

          Product product =
              new Product(
                  name,
                  sku,
                  description,
                  category,
                  Float.parseFloat(priceString),
                  Integer.parseInt(stockString),
                  Float.parseFloat(weightKgString));

          // Store in database
          productRepository.save(product);
        }
      }
      System.out.println("Data stored in database!");
      System.out.println("Entries in database: " + productRepository.count());
    } catch (Exception e) {
      System.err.println("Error while loading CSV: " + e.getMessage());
    }
  }
}
