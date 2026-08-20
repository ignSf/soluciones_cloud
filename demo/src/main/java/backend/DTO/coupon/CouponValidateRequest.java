package backend.dto.coupon;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponValidateRequest {

    @NotBlank(message = "El código del cupón es obligatorio")
    private String code;

    private BigDecimal orderAmount;
}
