package com.dot.tour_info_service_server.service.cart;

import com.dot.tour_info_service_server.dto.request.folder.CartAllRequestDTO;
import com.dot.tour_info_service_server.entity.*;
import com.dot.tour_info_service_server.entity.cart.Cart;
import com.dot.tour_info_service_server.entity.cart.CartPK;

public interface CartService {

    //장바구니 추가 - 추후 진행
    Long addCart(CartAllRequestDTO cartAllRequestDTO);

    //장바구니 삭제 - 추후 진행
    Long deleteCart(CartAllRequestDTO cartAllRequestDTO);


    //Cart dtoToEntity
    default Cart dtoToEntity(CartAllRequestDTO cartAllRequestDTO){
        CartPK cartPK= CartPK.builder()
                .member(Member.builder().mno(cartAllRequestDTO.getMno()).build())
                .place(Place.builder().pno(cartAllRequestDTO.getPno()).build())
                .folder(Folder.builder().fno(cartAllRequestDTO.getFno()).build())
                .build();
        Cart cart=Cart.builder()
                .cartPK(cartPK)
                .build();

        return cart;
    }

    //Cart entityToDTO
    default CartAllRequestDTO entityToDto(Cart cart){
        CartAllRequestDTO cartAllRequestDTO = CartAllRequestDTO.builder()
                .mno(cart.getCartPK().getMember().getMno())
                .pno(cart.getCartPK().getPlace().getPno())
                .fno(cart.getCartPK().getFolder().getFno())
                .build();
        return cartAllRequestDTO;
    }
}
