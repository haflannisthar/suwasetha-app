package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payment")
public class Payment {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "billno")
    @NotNull
    private String billno;

    @Column(name = "totalamount")
    @NotNull
    private BigDecimal totalamount;

    @Column(name = "paidamount")
    @NotNull
    private BigDecimal paidamount;


    @Column(name = "balanceamount")
    @NotNull
    private BigDecimal balanceamount;




    @Column(name = "addeduser")
    @NotNull
    private  Integer addeduser;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;


    @Column(name = "refno")
    private String refno;

    @Column(name = "transferdatetime")
    private LocalDateTime transferdatetime;

    @Column(name="bankname")
    private String  bankname ;


    @ManyToOne
    @JoinColumn(name = "inpaymentmethod_id", referencedColumnName = "id")//join column condition
    private InvoicePaymentMethod inpaymentmethod_id;

    @ManyToOne
    @JoinColumn(name = "appointment_id", referencedColumnName = "id")//join column condition
    private AppointmentScheduling appointment_id;

    @ManyToOne
    @JoinColumn(name = "prescription_id", referencedColumnName = "id")//join column condition
    private Prescription prescription_id;

    @OneToMany(mappedBy = "payment_id" , cascade = CascadeType.ALL , orphanRemoval = true )
    private List<PaymentHasBatch> paymentHasBatchList;



}
