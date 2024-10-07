package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.InvoicePaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoicePaymentMethodDao extends JpaRepository<InvoicePaymentMethod,Integer> {
}
