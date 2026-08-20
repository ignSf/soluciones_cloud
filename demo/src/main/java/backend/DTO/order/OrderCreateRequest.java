package backend.dto.order;

import backend.entity.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateRequest {

    private UUID addressId;

    @NotNull(message = "La dirección de envío es obligatoria")
    private Map<String, Object> shippingAddress;

    private Map<String, Object> billingAddress;

    private String couponCode;

    @NotNull(message = "El método de pago es obligatorio")
    private PaymentMethod paymentMethod;

    private String shippingMethod;

    private String customerNotes;
}
