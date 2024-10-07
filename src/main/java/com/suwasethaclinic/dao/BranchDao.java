package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Bank;
import com.suwasethaclinic.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BranchDao extends JpaRepository<Branch,Integer> {


    @Query("select br from Branch br where br.bank_id.id=?1 and br.city_id.id=?2")
    List<Branch> filterBranchByBankCity(Integer bankId, Integer cityId);
}
