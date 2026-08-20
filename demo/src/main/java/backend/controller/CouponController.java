package backend.controller;

import backend.dto.common.ApiResponse;
import backend.dto.coupon.CouponResponseDto;
import backend.dto.coupon.CouponValidateRequest;
import backend.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<CouponResponseDto>> validateCoupon(@Valid @RequestBody CouponValidateRequest request) {
        CouponResponseDto response = couponService.validateCoupon(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Cupón válido"));
    }
}
