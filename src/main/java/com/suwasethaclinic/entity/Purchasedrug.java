package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDateTime;

@Entity //applied as an entity class
@Table(name="purchasedrug") // map to given table
@Data //generate getter setter
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //generate all argument constructor
public class Purchasedrug {


    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name="id" ,unique = true)//for map with column
    private Integer id ;

    @Column(name="name" , unique = true)
    @NotNull
    private String name ;

    @Column(name="code" , unique = true)
    @NotNull
    @Length(max = 10)
    private String code ;

    @Column(name="conversionfactor" )
    private Integer conversionfactor ;

    @Column(name="cardfactor" )
    private Integer cardfactor ;

    @Column(name="nooftablets")
    private Integer nooftablets ;

    @Column(name="note")
    private String note ;


   @Column(name="addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    @Column(name="lastmodifydatetime")
    private LocalDateTime lastmodifydatetime;

    @Column(name="deletedatetime")
    private LocalDateTime deletedatetime;

    @ManyToOne(optional = true)
    @JoinColumn(name = "purchasedrugtype_id", referencedColumnName = "id")//join column condition
    private PurchaseDrugProductType purchasedrugtype_id ;

    @ManyToOne
    @JoinColumn(name = "salesdrug_id", referencedColumnName = "id")//join column condition
    private Salesdrug salesdrug_id ;

    @ManyToOne
    @JoinColumn(name = "purchasedrugstatus_id", referencedColumnName = "id")//join column condition
    private PurchaseDrugStatus purchasedrugstatus_id ;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")//join column condition
    private User user_id ;

    public Purchasedrug(Integer id,String code,String name){
        this.id=id;
        this.code=code;
        this.name=name;
    }

}
