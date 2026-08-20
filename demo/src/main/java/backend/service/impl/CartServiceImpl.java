package backend.service.impl;

import backend.dto.cart.CartItemRequest;
import backend.dto.cart.CartItemResponseDto;
import backend.dto.cart.CartResponseDto;
import backend.entity.*;
import backend.exception.BadRequestException;
import backend.exception.ResourceNotFoundException;
import backend.repository.*;
import backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final ShoppingCartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    @Override
    @Transactional
    public CartResponseDto getCart(UUID userId, String sessionToken) {
        ShoppingCart cart = getOrCreateCart(userId, sessionToken);
        return mapToCartDto(cart);
    }

    @Override
    @Transactional
    public CartResponseDto addItemToCart(UUID userId, String sessionToken, CartItemRequest request) {
        ShoppingCart cart = getOrCreateCart(userId, sessionToken);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        ProductVariant variant = null;
        if (request.getVariantId() != null) {
            variant = variantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variante de producto no encontrada"));
        }

        // Verificar si el ítem ya existe en el carrito
        Optional<CartItem> existingItemOpt = (variant != null)
                ? cartItemRepository.findByCartIdAndProductIdAndVariantId(cart.getId(), product.getId(), variant.getId())
                : cartItemRepository.findByCartIdAndProductIdAndVariantIsNull(cart.getId(), product.getId());

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return mapToCartDto(cartRepository.findById(cart.getId()).orElse(cart));
    }

    @Override
    @Transactional
    public CartResponseDto updateCartItem(UUID userId, String sessionToken, UUID itemId, Integer quantity) {
        ShoppingCart cart = getOrCreateCart(userId, sessionToken);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Ítem del carrito no encontrado"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("El ítem no pertenece a tu carrito actual");
        }

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return mapToCartDto(cartRepository.findById(cart.getId()).orElse(cart));
    }

    @Override
    @Transactional
    public CartResponseDto removeCartItem(UUID userId, String sessionToken, UUID itemId) {
        ShoppingCart cart = getOrCreateCart(userId, sessionToken);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Ítem del carrito no encontrado"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("El ítem no pertenece a tu carrito actual");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return mapToCartDto(cartRepository.findById(cart.getId()).orElse(cart));
    }

    @Override
    @Transactional
    public void clearCart(UUID userId, String sessionToken) {
        ShoppingCart cart = getOrCreateCart(userId, sessionToken);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private ShoppingCart getOrCreateCart(UUID userId, String sessionToken) {
        if (userId != null) {
            return cartRepository.findByUserId(userId)
                    .orElseGet(() -> {
                        User user = userRepository.findById(userId).orElse(null);
                        return cartRepository.save(ShoppingCart.builder().user(user).build());
                    });
        } else if (sessionToken != null) {
            return cartRepository.findBySessionToken(sessionToken)
                    .orElseGet(() -> cartRepository.save(
                            ShoppingCart.builder().sessionToken(sessionToken).build()
                    ));
        } else {
            throw new BadRequestException("Se requiere identificación de usuario o sessionToken para el carrito");
        }
    }

    private CartResponseDto mapToCartDto(ShoppingCart cart) {
        BigDecimal totalSubtotal = BigDecimal.ZERO;
        int totalItemsCount = 0;
        List<CartItemResponseDto> itemDtos = new ArrayList<>();

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                Product p = item.getProduct();
                ProductVariant v = item.getVariant();

                BigDecimal unitPrice = (p.getDiscountPrice() != null) ? p.getDiscountPrice() : p.getBasePrice();
                if (v != null && v.getPriceModifier() != null) {
                    unitPrice = unitPrice.add(v.getPriceModifier());
                }

                BigDecimal itemSubtotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
                totalSubtotal = totalSubtotal.add(itemSubtotal);
                totalItemsCount += item.getQuantity();

                String imageUrl = (p.getImages() != null && !p.getImages().isEmpty())
                        ? p.getImages().get(0).getImageUrl()
                        : null;

                itemDtos.add(CartItemResponseDto.builder()
                        .id(item.getId())
                        .productId(p.getId())
                        .productName(p.getName())
                        .productSlug(p.getSlug())
                        .productImage(imageUrl)
                        .variantId(v != null ? v.getId() : null)
                        .variantName(v != null ? v.getVariantName() : null)
                        .sku(v != null ? v.getSku() : p.getSku())
                        .unitPrice(unitPrice)
                        .quantity(item.getQuantity())
                        .subtotal(itemSubtotal)
                        .build());
            }
        }

        return CartResponseDto.builder()
                .id(cart.getId())
                .userId(cart.getUser() != null ? cart.getUser().getId() : null)
                .sessionToken(cart.getSessionToken())
                .items(itemDtos)
                .totalItems(totalItemsCount)
                .subtotal(totalSubtotal)
                .build();
    }
}
