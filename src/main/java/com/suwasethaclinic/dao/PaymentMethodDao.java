package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.EmployeeStatus;
import com.suwasethaclinic.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentMethodDao extends JpaRepository<PaymentMethod,Integer> {
}
