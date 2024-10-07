package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "purchaseorder")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "code", unique = true)
    @NotNull
    private String code;

    @Column(name = "requireddate")
    @NotNull
    private LocalDate requireddate ;

    @Column(name = "totalamount")
    @NotNull
    private BigDecimal totalamount;

    @Column(name = "note")
    private  String note;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime ;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name = "addeduser")
    @NotNull
    private  Integer addeduser;

    @Column(name = "updateuser")
    private  Integer updateuser;

    @Column(name = "deleteuser")
    private  Integer deleteuser;

    @ManyToOne
    @JoinColumn(name = "porderstatus_id", referencedColumnName = "id")//join column condition
    private PurchaseOrderStatus porderstatus_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")//join column condition
   private Supplier supplier_id;

    @OneToMany(mappedBy = "purchaseorder_id" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List <PurchaseOrderHasPurchaseDrug> purchaseOrderHasPurchaseDrugList;


    public PurchaseOrder(Integer id, String code){
        this.id=id;
        this.code=code;
    }


}
