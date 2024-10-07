package com.suwasethaclinic.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "availabledateandtime")
public class AvailableDateandTime {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "availabledate")
    @NotNull
    private LocalDate availabledate;

    @Column(name = "startingtime")
    @NotNull
    private LocalTime startingtime;

    @Column(name = "endtime")
    @NotNull
    private LocalTime endtime;



    @Column(name = "noofpatients")
    @NotNull
    private  Integer noofpatients;

    @ManyToOne
    @JoinColumn(name = "doctoravailability_id", referencedColumnName = "id")//join column condition
    @JsonIgnore
    private DoctorAvailability doctoravailability_id;



}
