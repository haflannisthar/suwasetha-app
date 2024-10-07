package com.suwasethaclinic.dao;

import com.suwasethaclinic.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierDao extends JpaRepository<Supplier,Integer> {

//check for brn duplicate
    @Query("select s from Supplier s where s.brn=?1")
    Supplier checkbrn(String brn);



//    get next supplier number
    @Query(value = "select concat('Sid', lpad(substring(max(regno), 4) + 1, 5, '0')) as regno from suwasetha_clinic.supplier as s",nativeQuery = true)
    String getNextSupplierNumber();

//check name fro duplicate
    @Query("select s from Supplier s where s.name=?1")
    Supplier checkName(String name);

//    check contact no for duplicate
    @Query("select s from Supplier s where s.contactno=?1")
    Supplier checkContactNo(String contactno);

//    check email for duplicate
    @Query("select s from Supplier s where s.email=?1")
    Supplier checkEmail(String email);

//    check contact person number for duplicate
    @Query("select s from Supplier s where s.contactpersonnumber=?1")
    Supplier checkCPNumber(String contactpersonnumber);

    @Query("select s from Supplier s where s.accountnumber=?1")
    Supplier checkAccnumber(String accountnumber);

//    active suplier list
    @Query("select  new Supplier (s.id,s.name)from Supplier s where s.supplierstatus_id.id=1")
    public List<Supplier> getSupplierList();

//    get supplier list who has ordered item list
    @Query("select s from Supplier s where s.id in (select p.supplier_id.id from PurchaseOrder p where p.porderstatus_id.id=1) and s.supplierstatus_id.id=1")
    List<Supplier> getItemOrderedSupplierList();

//    get supplier list for supplier payment
    @Query("select s from Supplier s where s.id in (select po.supplier_id.id from PurchaseOrder po where po.id in (select g.purchaseorder_id.id from Grn g where g.grnstatus_id.id!=1))")
    List<Supplier> getGrnSupplierList();

////    get bank and account no using supplier id
    @Query("select s from Supplier s where s.id=?1")
    Supplier getSupplierBankDetails(Integer supplierid);


}
