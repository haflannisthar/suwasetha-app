package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity //applied as an entity class
@Table(name="supplier") // map to given table
@Data //generate getter setter
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //generate all argument constructor
public class Supplier {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true)
    private Integer id ;

    @Column(name = "regno",unique = true)
    @NotNull
    @Length(max = 10)
    private String regno;

    @Column(name = "name",unique = true)
    @NotNull
   private String name;

    @Column(name = "brn", unique = true)
    @NotNull
   private String brn;

    @Column(name = "contactno" , unique = true)
    @NotNull
    private String contactno;

    @Column(name = "email",unique = true)
    @NotNull
    private String email;

    @Column(name = "address")
    @NotNull
    private  String address;

    @Column(name = "contactpersonname")
    @NotNull
    private  String contactpersonname;

    @Column(name = "contactpersonnumber",unique = true)
    @NotNull
    private  String contactpersonnumber;

    @Column(name = "addeddatetime")
    @NotNull
   private LocalDateTime addeddatetime;

    @Column(name = "deletedatetime")
    private  LocalDateTime deletedatetime;

    @Column(name = "updatedatetime")
   private LocalDateTime updatedatetime;

    @Column(name = "bankholdersname")
    private  String bankholdersname;

    @Column(name = "accountnumber")
    private  String accountnumber;

    @Column(name = "arrearsamount")
    private  BigDecimal arrearsamount;

    @Column(name = "creditlimit")
    private  BigDecimal creditlimit;

    @Column(name = "note")
    private  String note;

    @ManyToOne
    @JoinColumn(name = "supplierstatus_id", referencedColumnName = "id")
    private  SupplierStatus supplierstatus_id;

    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private User user_id;

    @ManyToOne
    @JoinColumn(name = "branch_id",referencedColumnName = "id")
    private Branch branch_id;


    @OneToMany(mappedBy = "supplier_id" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List<SupplierHasPurchasedrug> purchasedrugs;

//    @OneToMany(mappedBy = "purchaseorder_id" , cascade = CascadeType.ALL , orphanRemoval = true)
//    private List<PurchaseOrderHasPurchaseDrug> purchaseOrderHasPurchaseDrugList;

    public  Supplier(Integer id,String name){
        this.id=id;
        this.name=name;
    }
//    public  Supplier(Integer id,B bank,String accountnumber){
//        this.id=id;
//        this.bank=bank;
//        this.accountnumber=accountnumber;
//    }

}
