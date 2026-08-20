package backend.service;

import backend.dto.cart.CartItemRequest;
import backend.dto.cart.CartResponseDto;

import java.util.UUID;

public interface CartService {
    CartResponseDto getCart(UUID userId, String sessionToken);
    CartResponseDto addItemToCart(UUID userId, String sessionToken, CartItemRequest request);
    CartResponseDto updateCartItem(UUID userId, String sessionToken, UUID itemId, Integer quantity);
    CartResponseDto removeCartItem(UUID userId, String sessionToken, UUID itemId);
    void clearCart(UUID userId, String sessionToken);
}
