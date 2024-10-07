package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Category;
import com.suwasethaclinic.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SubCategoryDao extends JpaRepository<SubCategory,Integer> {


    @Query("select sc from SubCategory  sc where sc.category_id.id=?1")
    List<SubCategory> getSubCatgoryList(Integer categoryid);

    @Query("select sc from SubCategory sc where sc.name=?1")
    SubCategory getsubcategorybyname(String name);
}
