package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity //applied as an entity class
@Table(name="patient") // map to given table
@Data //generate getter setter
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //generate all argument constructor
public class Patient {


    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name="id" ,unique = true)//for map with column
    private Integer id ;

    @Column(name="regno" , unique = true)
    @NotNull
    @Length(max = 8)
    private String regno ;

    @Column(name="title")
    @NotNull
    private String title ;


    @Column(name="firstname")
    @NotNull
    private String firstname ;

    @Column(name="lastname")
    @NotNull
    private String lastname ;

    @Column(name="dateofbirth")
    @NotNull
    private LocalDate dateofbirth;



    @Column(name="gender")
    @NotNull
    private String gender;

    @Column(name="contactno")
    @NotNull
    @Length(max =10)
    private String contactno  ;



     @Column(name="note")
    private String  note ;



    @Column(name="emergencycontactname")
    private String emergencycontactname  ;


    @Column(name="emergencycontactno")
    private String emergencycontactno ;


    @Column(name="addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    @Column(name="lastmodifydatetime")
    private LocalDateTime lastmodifydatetime;

    @Column(name="deleteddatetime")
    private LocalDateTime deleteddatetime;


    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName  = "id")
    private User user_id ;



    public Patient(Integer id,String title,String firstname,String lastname){
        this.id=id;
        this.title=title;
        this.firstname=firstname;
        this.lastname=lastname;
    }

    public Patient(Integer id,String contactno){
        this.id=id;
        this.contactno=contactno;

    }

}
