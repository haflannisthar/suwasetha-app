package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "supplierpayment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "billno", unique = true)
    @NotNull
    private Integer billno;

    @Column(name = "grnamount")
    @NotNull
    private BigDecimal grnamount;

    @Column(name = "paidamount")
    @NotNull
    private BigDecimal paidamount;

    @Column(name = "balanceamount")
    @NotNull
    private BigDecimal balanceamount;

    @Column(name = "note")
    private  String note;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    @Column(name = "addeduser")
    @NotNull
    private  Integer addeduser;

    @Column(name = "checkno")
    private Integer checkno;

    @Column(name = "checkdate")
    private LocalDate checkdate ;

    @Column(name = "bankname")
    private  String bankname;

    @Column(name = "accountno")
    private String accountno;

    @Column(name = "depositdatetime")
    private LocalDateTime depositdatetime ;

    @Column(name = "transferid")
    private  String transferid;


    @ManyToOne
    @JoinColumn(name = "paymentmethod_id", referencedColumnName = "id")//join column condition
    private PaymentMethod paymentmethod_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")//join column condition
    private Supplier supplier_id;

    @OneToMany(mappedBy = "supplierpayment_id" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List <SupplierPaymentHasGrn> supplierPaymentHasGrnList;



}
