package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "doctoravailability")
public class DoctorAvailability {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "startdate")
    @NotNull
    private LocalDate startdate;

    @Column(name = "enddate")
    @NotNull
    private  LocalDate enddate;



    @Column(name = "addeduser")
    @NotNull
    private  Integer addeduser;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;


    @Column(name = "updateuser")
    private Integer updateuser;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name="note")
    private String  note ;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")//join column condition
    private Employee employee_id;


    @OneToMany(mappedBy = "doctoravailability_id" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List<AvailableDateandTime> availableDateandTimeList;





}
