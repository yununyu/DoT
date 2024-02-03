package com.dot.tour_info_service_server.repository;

import com.dot.tour_info_service_server.entity.Folder;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder,Long> {

    //폴더 모두 조회
    @Query("select f.fno,f.title,p.pno,p.name " +
            "from Folder f " +
            "left outer join Cart c on f.fno=c.cartPK.folder.fno " +
            "left outer join Place p on c.cartPK.place.pno=p.pno " +
            "where f.member.mno=:mno " +
            "group by f.fno,p.pno ")
    List<Object[]> getFolderAll(Long mno);


    //폴더명 조회
    @Query("select f from Folder f where f.member.mno=:mno")
    List<Folder> getFolderTitle(Long mno);

    @Modifying
    @Transactional
    @Query("delete from Folder f where f.member.mno = :mno")
    void removeFolderByMno(Long mno);

}