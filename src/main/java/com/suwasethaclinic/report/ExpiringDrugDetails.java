package com.suwasethaclinic.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpiringDrugDetails {

    private String name;
    private String batchno;
    private String expirydate;
    private String availableqty;

}
