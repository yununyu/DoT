package com.dot.tour_info_service_server.service.cart;

import com.dot.tour_info_service_server.dto.request.folder.CartAllRequestDTO;
import com.dot.tour_info_service_server.entity.cart.Cart;
import com.dot.tour_info_service_server.repository.CartRepository;
import com.dot.tour_info_service_server.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartSeviceImpl implements CartService{

    //장바구니 repository
    private final CartRepository cartRepository;

    //장소 repository
    private final PlaceRepository placeRepository;


    //폴더에 장소 추가
    @Override
    public Long addCart(CartAllRequestDTO cartAllRequestDTO) {
        if (placeRepository.findById(cartAllRequestDTO.getPno()).isPresent()){
            Cart cart=dtoToEntity(cartAllRequestDTO);
            cartRepository.save(cart);
            return cartAllRequestDTO.getFno();
        }
        return -1l;
    }


    //폴더에 장소 제거
    @Override
    public Long deleteCart(CartAllRequestDTO cartAllRequestDTO) {
        cartRepository.delete(dtoToEntity(cartAllRequestDTO));
        return cartAllRequestDTO.getPno();
    }
}
