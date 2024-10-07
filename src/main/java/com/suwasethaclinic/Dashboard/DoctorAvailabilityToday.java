package com.suwasethaclinic.Dashboard;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAvailabilityToday {

    private String name;
    private String date;
    private String starttime;
    private String endtime;
}
