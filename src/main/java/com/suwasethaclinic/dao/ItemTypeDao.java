package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ItemTypeDao extends JpaRepository<ItemType,Integer> {


//    @Query("select b from Brand b where b.generic_id.id=?1")
//    List<Brand> getbygeneric(Integer genericid);


}
