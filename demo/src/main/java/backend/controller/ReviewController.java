package backend.controller;

import backend.dto.common.ApiResponse;
import backend.dto.review.ReviewRequestDto;
import backend.dto.review.ReviewResponseDto;
import backend.security.JwtUtil;
import backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtUtil jwtUtil;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<Page<ReviewResponseDto>>> getProductReviews(
            @PathVariable UUID productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewResponseDto> reviews = reviewService.getProductReviews(productId, pageable);
        return ResponseEntity.ok(ApiResponse.success(reviews, "Reseñas del producto"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponseDto>> addReview(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody ReviewRequestDto request
    ) {
        UUID userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
        ReviewResponseDto review = reviewService.addReview(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(review, "Reseña publicada con éxito"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable UUID id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Reseña eliminada con éxito"));
    }
}
