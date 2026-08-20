package backend.controller;

import backend.dto.cart.CartItemRequest;
import backend.dto.cart.CartResponseDto;
import backend.dto.common.ApiResponse;
import backend.security.JwtUtil;
import backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final JwtUtil jwtUtil;

    private UUID extractUserIdSafely(String authHeader) {
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            try {
                return jwtUtil.extractUserId(authHeader.substring(7));
            } catch (Exception ignored) {
            }
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponseDto>> getCart(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken
    ) {
        UUID userId = extractUserIdSafely(authHeader);
        CartResponseDto cart = cartService.getCart(userId, sessionToken);
        return ResponseEntity.ok(ApiResponse.success(cart, "Carrito de compras"));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponseDto>> addItem(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @Valid @RequestBody CartItemRequest request
    ) {
        UUID userId = extractUserIdSafely(authHeader);
        CartResponseDto cart = cartService.addItemToCart(userId, sessionToken, request);
        return ResponseEntity.ok(ApiResponse.success(cart, "Producto agregado al carrito"));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponseDto>> updateItemQuantity(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @PathVariable UUID itemId,
            @RequestParam Integer quantity
    ) {
        UUID userId = extractUserIdSafely(authHeader);
        CartResponseDto cart = cartService.updateCartItem(userId, sessionToken, itemId, quantity);
        return ResponseEntity.ok(ApiResponse.success(cart, "Cantidad actualizada"));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponseDto>> removeItem(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
            @PathVariable UUID itemId
    ) {
        UUID userId = extractUserIdSafely(authHeader);
        CartResponseDto cart = cartService.removeCartItem(userId, sessionToken, itemId);
        return ResponseEntity.ok(ApiResponse.success(cart, "Ítem eliminado del carrito"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken
    ) {
        UUID userId = extractUserIdSafely(authHeader);
        cartService.clearCart(userId, sessionToken);
        return ResponseEntity.ok(ApiResponse.success(null, "Carrito vaciado"));
    }
}
