package com.suwasethaclinic.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class POrderCountReport {

    private String itemName;
    private  String itemCount;

}
