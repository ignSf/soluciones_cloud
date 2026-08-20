package backend.service;

import backend.dto.review.ReviewRequestDto;
import backend.dto.review.ReviewResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ReviewService {
    Page<ReviewResponseDto> getProductReviews(UUID productId, Pageable pageable);
    ReviewResponseDto addReview(UUID userId, ReviewRequestDto request);
    void deleteReview(UUID reviewId);
}
