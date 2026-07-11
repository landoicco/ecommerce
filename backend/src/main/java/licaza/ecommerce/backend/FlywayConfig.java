package licaza.ecommerce.backend;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Manual Flyway configuration required because Spring Boot 3 autoconfiguration silently fails to
 * detect the database type when using the native MariaDB driver.
 *
 * <p>This class forces migrations to execute BEFORE any JPA or CommandLineRunner processes.
 */
@Configuration
public class FlywayConfig {

  @Value("${spring.datasource.url}")
  private String datasourceUrl;

  @Value("${spring.datasource.username}")
  private String datasourceUsername;

  @Value("${spring.datasource.password}")
  private String datasourcePassword;

  @Bean(initMethod = "migrate")
  public Flyway flyway() {
    return Flyway.configure()
        .dataSource(datasourceUrl, datasourceUsername, datasourcePassword)
        .locations("classpath:db/migration")
        .baselineOnMigrate(true)
        .load();
  }
}
