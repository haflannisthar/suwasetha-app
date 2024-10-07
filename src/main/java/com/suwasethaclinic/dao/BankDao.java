package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Bank;
import com.suwasethaclinic.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BankDao extends JpaRepository<Bank,Integer> {


}
