package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity //applied as an entity class
@Table(name="employee") // map to given table
@Data //generate getter setter
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //generate all argument constructor
public class Employee {


    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name="id" ,unique = true)//for map with column
    private Integer id ;

    @Column(name="empnumber" , unique = true)
    @NotNull
    @Length(max = 10)
    private String empnumber ;

    @Column(name="fullname")
    @NotNull
    private String fullname ;

    @Column(name="callingname")
    @NotNull
    private String callingname ;

    @Column(name="nic",unique = true)
    @NotNull
    @Length(max = 12,min = 10)
    private String nic ;

    @Column(name="email",unique = true)
    @NotNull
    private String email  ;

    @Column(name="mobile")
    @NotNull
    @Length(max = 10)
    private String mobile ;

    @Column(name="landno")
    @Length(max = 10)
    private String landno  ;


    @Column(name="address")
    @NotNull
    private String  address;

    @Column(name="note")
    private String  note ;

    @Column(name="civilstatus")
    @NotNull
    private String civilstatus ;

    @Column(name="gender")
    @NotNull
    private String gender;

    @Column(name="dateofbirth")
    @NotNull
    private LocalDate dateofbirth;


    @Column(name="addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;


    @Column(name="lastmodifydatetime")
    private LocalDateTime lastmodifydatetime;

    @Column(name="deletedatetime")
    private LocalDateTime deletedatetime;

    @ManyToOne
    @JoinColumn(name = "employeestatus_id", referencedColumnName = "id")//join column condition
    private EmployeeStatus employeestatus_id ;

    @ManyToOne
    @JoinColumn(name = "designation_id", referencedColumnName  = "id")
    private Designation designation_id ;

    @Column(name = "emp_photo")
    private byte[] emp_photo;

    @Column(name = "emp_photo_name")
   private String emp_photo_name;

    @Column(name="channellingcharge")
    private BigDecimal channellingcharge;


    public Employee(Integer id,String fullname,String callingname){
        this.id=id;
        this.fullname=fullname;
        this.callingname=callingname;
    }

}
