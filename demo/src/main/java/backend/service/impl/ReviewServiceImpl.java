package backend.service.impl;

import backend.dto.review.ReviewRequestDto;
import backend.dto.review.ReviewResponseDto;
import backend.entity.Order;
import backend.entity.Product;
import backend.entity.ProductReview;
import backend.entity.User;
import backend.exception.BadRequestException;
import backend.exception.ResourceNotFoundException;
import backend.repository.OrderRepository;
import backend.repository.ProductRepository;
import backend.repository.ProductReviewRepository;
import backend.repository.UserRepository;
import backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponseDto> getProductReviews(UUID productId, Pageable pageable) {
        return reviewRepository.findByProductIdAndIsApprovedTrueOrderByCreatedAtDesc(productId, pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional
    public ReviewResponseDto addReview(UUID userId, ReviewRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        Optional<ProductReview> existingReview = reviewRepository.findByUserIdAndProductId(userId, product.getId());
        if (existingReview.isPresent()) {
            throw new BadRequestException("Ya has escrito una reseña para este producto");
        }

        Order order = null;
        boolean isVerified = false;
        if (request.getOrderId() != null) {
            order = orderRepository.findById(request.getOrderId()).orElse(null);
            if (order != null && order.getUser().getId().equals(userId)) {
                isVerified = true;
            }
        }

        ProductReview review = ProductReview.builder()
                .user(user)
                .product(product)
                .order(order)
                .rating(request.getRating())
                .title(request.getTitle())
                .comment(request.getComment())
                .isVerifiedPurchase(isVerified)
                .isApproved(true)
                .build();

        return mapToDto(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public void deleteReview(UUID reviewId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Reseña no encontrada"));
        reviewRepository.delete(review);
    }

    private ReviewResponseDto mapToDto(ProductReview review) {
        String userName = review.getUser() != null
                ? review.getUser().getFirstName() + " " + review.getUser().getLastName()
                : "Usuario Anónimo";

        return ReviewResponseDto.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .userId(review.getUser().getId())
                .userName(userName)
                .rating(review.getRating())
                .title(review.getTitle())
                .comment(review.getComment())
                .isVerifiedPurchase(review.getIsVerifiedPurchase())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
