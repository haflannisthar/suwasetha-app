package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Brand;
import com.suwasethaclinic.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryDao extends JpaRepository<Category,Integer> {


    @Query("select c from Category c where c.name=?1")
    Category getcategorybyname(String name);


    @Query("select c from Category c where c.itemtype_id.id=?1")
    List<Category> getCatgoryList(Integer itemid);
}
