package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface PurchaseOrderDao extends JpaRepository<PurchaseOrder,Integer> {

//get p order id , code which the id is received
    @Query("select new  PurchaseOrder (pd.id , pd.code)  from PurchaseOrder pd where  pd.porderstatus_id.id=1 and pd.id not in (select g.id from Grn g )")
    List<PurchaseOrder> getPurchaseOrderNoDetails();
//    new  PurchaseOrder (pd.id , pd.code)

//get p order list
    @Query("select po from PurchaseOrder  po  where po.id in (select php.purchaseorder_id.id from PurchaseOrderHasPurchaseDrug php where php.purchaseorder_id.id=?1) ")
    List<PurchaseOrder> getPorderItems(Integer porderid);

//    get p order by id
    @Query("select po from PurchaseOrder po where po.id=?1")
    PurchaseOrder getporderbyid(Integer purchaseorderId);

//    requested p order list and pd.porderstatus_id.id=1
    @Query("select pd from PurchaseOrder  pd where pd.supplier_id.id=?1 and pd.porderstatus_id.id=1 ")
    List<PurchaseOrder> getPOrderItemDetailsBySuppilerId(Integer supplierid);

//next p order number
    @Query(value = "SELECT concat(year(current_date()),lpad(substring(max(po.code),5)+1,6,0)) as code FROM suwasetha_clinic.purchaseorder as po where year(current_date())=year(po.addeddatetime);",nativeQuery = true)
    String getNextPOrderCode();

//get p order list that is greater than or equal current date and status is requested
    @Query("select  p from PurchaseOrder p where p.requireddate>=?1 and p.porderstatus_id.id=1")
    List<PurchaseOrder> getPendingOrders(LocalDate currentdate);

//    get the p order list by supplier
    @Query("select p from PurchaseOrder p where p.supplier_id.id=?1 and p.porderstatus_id.id=1")
    List<PurchaseOrder> getPendingPorderListBySupplier(Integer id);

    @Query("select p from PurchaseOrder  p where p.code=?1 ")
    PurchaseOrder getPurchaseOrderStatus(String orderno);
}
