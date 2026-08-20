package backend.service;

import backend.dto.coupon.CouponResponseDto;
import backend.dto.coupon.CouponValidateRequest;
import backend.entity.Coupon;

import java.math.BigDecimal;

public interface CouponService {
    CouponResponseDto validateCoupon(CouponValidateRequest request);
    Coupon getValidCouponEntity(String code, BigDecimal orderAmount);
}
