package backend.service.impl;

import backend.dto.coupon.CouponResponseDto;
import backend.dto.coupon.CouponValidateRequest;
import backend.entity.Coupon;
import backend.entity.enums.DiscountType;
import backend.exception.BadRequestException;
import backend.exception.ResourceNotFoundException;
import backend.repository.CouponRepository;
import backend.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;

    @Override
    @Transactional(readOnly = true)
    public CouponResponseDto validateCoupon(CouponValidateRequest request) {
        Coupon coupon = getValidCouponEntity(request.getCode(), request.getOrderAmount());

        BigDecimal calculatedDiscount = calculateDiscount(coupon, request.getOrderAmount());

        return CouponResponseDto.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .description(coupon.getDescription())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .minOrderAmount(coupon.getMinOrderAmount())
                .maxDiscountAmount(coupon.getMaxDiscountAmount())
                .calculatedDiscount(calculatedDiscount)
                .isValid(true)
                .validUntil(coupon.getValidUntil())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Coupon getValidCouponEntity(String code, BigDecimal orderAmount) {
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndIsActiveTrue(code)
                .orElseThrow(() -> new ResourceNotFoundException("El cupón '" + code + "' no existe o no está activo"));

        OffsetDateTime now = OffsetDateTime.now();
        if (now.isBefore(coupon.getValidFrom()) || now.isAfter(coupon.getValidUntil())) {
            throw new BadRequestException("El cupón ha expirado o aún no está vigente");
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new BadRequestException("El cupón ha alcanzado el límite máximo de usos");
        }

        if (orderAmount != null && coupon.getMinOrderAmount() != null && orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new BadRequestException("El monto mínimo de compra para este cupón es de $" + coupon.getMinOrderAmount());
        }

        return coupon;
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderAmount) {
        if (orderAmount == null || orderAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount;
        if (coupon.getDiscountType() == DiscountType.percentage) {
            discount = orderAmount.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else {
            discount = coupon.getDiscountValue();
            if (discount.compareTo(orderAmount) > 0) {
                discount = orderAmount;
            }
        }

        return discount;
    }
}
