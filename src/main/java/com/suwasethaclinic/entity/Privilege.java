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
@Table(name="privilege") // map to given table
@Data //generate getter setter
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //generate all argument constructor
public class Privilege {


    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name="id" ,unique = true)//for map with column
    private Integer id ;

    @Column(name="privselect" )
    @NotNull
    private Boolean privselect ;


    @Column(name="privinsert" )
    @NotNull
    private Boolean privinsert ;


    @Column(name="privupdate" )
    @NotNull
    private Boolean privupdate ;


    @Column(name="privdelete" )
    @NotNull
    private Boolean privdelete ;

    @ManyToOne
    @JoinColumn(name = "module_id", referencedColumnName = "id")//join column condition
    private Module module_id ;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id")//join column condition
    private Role role_id ;

}
