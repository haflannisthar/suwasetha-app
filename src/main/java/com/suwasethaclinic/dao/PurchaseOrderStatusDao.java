package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.EmployeeStatus;
import com.suwasethaclinic.entity.PurchaseOrder;
import com.suwasethaclinic.entity.PurchaseOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderStatusDao extends JpaRepository<PurchaseOrderStatus,Integer> {
}
