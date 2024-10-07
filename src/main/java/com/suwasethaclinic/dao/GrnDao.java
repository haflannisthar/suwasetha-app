package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Grn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface GrnDao extends JpaRepository<Grn,Integer> {


//    check supplier no unique for supplier
    @Query("select g from Grn  g where g.supplierbillno=?1 and  g.purchaseorder_id.supplier_id.id=?2")
    Grn getSbillNo(String supplierbillno, Integer id);

//    get next grn no
@Query(value = "select concat('GRN', lpad(substring(max(grnno), 4) + 1, 5, '0')) as grnno from suwasetha_clinic.grn as g",nativeQuery = true)
    String getnextgrnno();
//get the grn list whose status are 1 or 2
@Query("select g from Grn g where g.grnstatus_id.id=1 or g.grnstatus_id.id=2")
    List<Grn> receivedGrnList();
//get the grn list by supplier id where net amount - paid amount >0
@Query("select g from Grn g where (g.netamount-g.paidamount) > 0 and  g.purchaseorder_id.id in (select po.id from PurchaseOrder po where po.supplier_id.id=?1) ")
    List<Grn> getGrnListBySupplierId(Integer supplierid);

//get the net amount - paid amount b grn id
@Query("select   g.netamount-g.paidamount from Grn g where g.id=?1")
    BigDecimal getGrnListByGrnId(Integer grnid);

//get the total net amount - total paid amount by supplier id
  @Query("select sum(g.netamount)- sum(g.paidamount) from Grn g where g.purchaseorder_id.id in (select po.id from PurchaseOrder po where po.supplier_id.id=?1)")
  BigDecimal getGrnNetAmountBySupplierId(Integer supplierid);
}
