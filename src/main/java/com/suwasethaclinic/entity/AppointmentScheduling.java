package com.suwasethaclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "appointment")
public class AppointmentScheduling {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="appno")
    @NotNull
    private String  appno ;

    @Column(name = "channaliingno")
    @NotNull
    private  Integer channaliingno;

    @Column(name = "channellingdate")
    @NotNull
    private LocalDate channellingdate;

    @Column(name = "sessionstarttime")
    @NotNull
    private LocalTime sessionstarttime;

    @Column(name = "starttime")
    @NotNull
    private LocalTime starttime;

    @Column(name = "endtime")
    @NotNull
    private LocalTime endtime;

    @Column(name = "channelingcharge")
    @NotNull
    private BigDecimal channelingcharge;


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

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")//join column condition
    private Employee employee_id;

    @ManyToOne
    @JoinColumn(name = "appstatus_id", referencedColumnName = "id")//join column condition
    private AppointmentStatus appstatus_id;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")//join column condition
    private Patient patient_id;



    public  AppointmentScheduling(Integer id,String appno,BigDecimal channelingcharge){
        this.id=id;
        this.appno=appno;
        this.channelingcharge=channelingcharge;

    }

    public  AppointmentScheduling(Integer id,String appno){
        this.id=id;
        this.appno=appno;

    }

    public AppointmentScheduling(Integer id,LocalDate channellingdate,LocalTime endtime){
        this.id=id;
        this.channellingdate=channellingdate;
        this.endtime=endtime;

    }

}
