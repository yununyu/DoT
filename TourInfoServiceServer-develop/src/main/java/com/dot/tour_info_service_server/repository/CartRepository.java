package com.dot.tour_info_service_server.repository;

import com.dot.tour_info_service_server.entity.cart.CartPK;
import com.dot.tour_info_service_server.entity.cart.Cart;
import com.dot.tour_info_service_server.entity.Folder;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CartRepository extends JpaRepository<Cart, CartPK> {

    @Modifying
    @Transactional
    @Query("delete from Cart c where c.cartPK.place.pno = :pno")
    void removeCart(Long pno);

    @Modifying
    @Transactional
    @Query("delete from Cart c where c.cartPK.member.mno = :mno")
    void removeCartByMno(Long mno);


    //폴더 삭제시 장바구니 아이템 삭제
    @Transactional
    void deleteAllByCartPK_Folder(Folder folder);
}
