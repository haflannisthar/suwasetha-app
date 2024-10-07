package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.PurchaseOrder;
import com.suwasethaclinic.entity.Purchasedrug;
import com.suwasethaclinic.entity.Salesdrug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseDrugDao extends JpaRepository<Purchasedrug,Integer> {

//check drugname avilable in purchasedrugtable(check for duplication)
    @Query("select pd from Purchasedrug pd where pd.name=?1")
    Purchasedrug getPurchaseDrugByName(String name);


//get the next purchase drug code
    @Query(value = "select concat('SPI', lpad(substring(max(code), 4) + 1, 4, '0')) as code from suwasetha_clinic.purchasedrug as sld; ", nativeQuery = true)
    String getNextDrugCode();


//    get available drugs for supplier form
    @Query("select new Purchasedrug (pd.id, pd.code, pd.name) FROM Purchasedrug pd where pd.purchasedrugstatus_id.id=1 or pd.purchasedrugstatus_id.id=2 ")
    List<Purchasedrug> getavailableedrugsforsupplier();

//    get purchase drug list that is not have supplier and status active
    @Query("select  pd from Purchasedrug pd where  pd.id not in(select shp.purchasedrug_id.id from  SupplierHasPurchasedrug  shp where shp.supplier_id.id=?1) and  pd.purchasedrugstatus_id.id!=3")
    List<Purchasedrug> getavailableedrugsnotinsupplierhaspurchase(Integer supplierId);


//    filter by supplier id to make purchase order
    @Query("select pd from  Purchasedrug pd where pd.id in (select shp.purchasedrug_id.id from SupplierHasPurchasedrug shp where shp.supplier_id.id=?1) and pd.purchasedrugstatus_id.id!=3")
    List<Purchasedrug> getpurchasedrugbysupplierid(Integer supplierId);

//    get purchase drug using the supplier id
    @Query("select p from Purchasedrug p where p.id in(select php.purchasedrug_id.id from PurchaseOrderHasPurchaseDrug php) and p.id in (select shp.purchasedrug_id.id from SupplierHasPurchasedrug shp where shp.supplier_id.id=?1)")
    List<Purchasedrug> getpurchasedrugsbysupplierno(Integer supplierid);

//get the purchase drug by porder no to fill in grn
//    @Query("select pd from Purchasedrug pd where pd.id in(select po.purchasedrug_id.id from PurchaseOrderHasPurchaseDrug  po where po.purchaseorder_id.id=?1) ")
    @Query("select pd from Purchasedrug pd where pd.id in(select po.purchasedrug_id.id from PurchaseOrderHasPurchaseDrug  po where po.purchaseorder_id.id=?1) ")
    List<Purchasedrug> getpurchasedrugsbyporder(Integer porderid);

    @Query("select p.conversionfactor from Purchasedrug p where p.id=?1")
    Integer getPurchaseDrugConversionFactor(Integer itemid);

    @Query("select spg.qty from SupplierHasPurchasedrug spg where spg.purchasedrug_id.id=?1 and spg.supplier_id.id=?2")
    Integer getDrugDetailBySupplierAndId(Integer drugid,Integer supplierid);
}
