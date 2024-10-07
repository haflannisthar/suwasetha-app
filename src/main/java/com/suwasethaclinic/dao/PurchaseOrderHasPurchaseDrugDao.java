package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.PurchaseOrder;
import com.suwasethaclinic.entity.PurchaseOrderHasPurchaseDrug;
import com.suwasethaclinic.entity.Purchasedrug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseOrderHasPurchaseDrugDao extends JpaRepository<PurchaseOrderHasPurchaseDrug,Integer> {

//    get the list by drug id
   @Query("select php from PurchaseOrderHasPurchaseDrug php where php.purchasedrug_id.id=?1")
    List<PurchaseOrderHasPurchaseDrug> getpurchasedrugQtybyid(Integer drugid);


// get the ordered drug qty by drug id and order id
    @Query("select php.quantity from PurchaseOrderHasPurchaseDrug php where php.purchaseorder_id.id=?2 and php.purchasedrug_id.id=?1")
 Integer getOrderedDrugQty(Integer drugid, Integer poderid);
}
