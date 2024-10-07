package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDateTime;
import java.util.Set;

@Entity //applied as an entity class
@Table(name="salesdrug") // map to given table
@Data //generate getter setter
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //generate all argument constructor
public class Salesdrug {


    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name="id" ,unique = true)//for map with column
    private Integer id ;

    @Column(name="name" , unique = true)
    @NotNull
    private String name ;

    @Column(name="code" , unique = true)
    @NotNull
    @Length(max = 13)
    private String code ;

    @Column(name="rop" )
    private Integer rop ;

    @Column(name="roq" )
    private Integer roq ;

    @Column(name="productsize")
    private String productsize ;

    @Column(name="note")
    private String note ;


   @Column(name="addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    @Column(name="lastmodifydatetime")
    private LocalDateTime lastmodifydatetime;

    @Column(name="deletedatetime")
    private LocalDateTime deletedatetime;

    @ManyToOne
    @JoinColumn(name = "producttype_id", referencedColumnName = "id")//join column condition
    private ProductType producttype_id ;

    @ManyToOne
    @JoinColumn(name = "unittype_id", referencedColumnName = "id")//join column condition
    private UnitType unittype_id ;

    @ManyToOne
    @JoinColumn(name = "drugstatus_id", referencedColumnName = "id")//join column condition
    private DrugStatus drugstatus_id ;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")//join column condition
    private User user_id ;

    @ManyToOne
    @JoinColumn(name = "subcategory_id", referencedColumnName = "id")//join column condition
    private SubCategory subcategory_id ;

    @ManyToOne
    @JoinColumn(name = "brand_id", referencedColumnName = "id")//join column condition
    private Brand brand_id ;


    public Salesdrug(Integer id, String name){
        this.id=id;
        this.name=name;

    }


}
