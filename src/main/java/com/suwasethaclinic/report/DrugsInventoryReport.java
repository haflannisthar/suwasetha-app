package com.suwasethaclinic.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class DrugsInventoryReport {

    private String itemname;
    private String availableQty;
    private String rop;


}
