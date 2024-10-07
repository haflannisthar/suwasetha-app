package com.suwasethaclinic.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierDetails {

    private String regno;
    private String name;
    private String contactno;
    private String email;
    private String conversionfactor;
    private String arrearsamount;
    private String supplierstatus;

}
