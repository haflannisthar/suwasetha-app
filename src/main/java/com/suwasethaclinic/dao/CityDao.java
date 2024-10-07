package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Bank;
import com.suwasethaclinic.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CityDao extends JpaRepository<City,Integer> {

    @Query("select c from  City c where c.id in (select b.city_id.id from Branch b where b.bank_id.id=?1)")
    List<City> filterCityByBank(Integer bankId);
}
