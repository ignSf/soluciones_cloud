package backend.dto.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponseDto {
    private UUID id;
    private UUID productId;
    private UUID userId;
    private String userName;
    private Short rating;
    private String title;
    private String comment;
    private Boolean isVerifiedPurchase;
    private OffsetDateTime createdAt;
}
