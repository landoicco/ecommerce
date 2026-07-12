package licaza.ecommerce.backend.dto;

public record ProductQueryDTO(
    String search, Integer page, Integer size, String sortBy, String sortDir) {
  public ProductQueryDTO {
    if (page == null) page = 0;
    if (size == null) size = 10;
    if (sortBy == null) sortBy = "id";
    if (sortDir == null) sortDir = "asc";
  }
}
