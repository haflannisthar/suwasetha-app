window.addEventListener('load',()=>{


     // // get user privilege for given module
     UserPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Purchase-Drug");

    //refresh function for table and form
    refreshPurchaseDrugTable()
    refreshPurchaseDrugForm();

    // tooltip
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })



})
//function to refresh table
const refreshPurchaseDrugTable=()=>{
     purchaseDrugListData=ajaxGetReq("/purchasedrug/list");

    const displayProperty=[
             {property:getDrugNameCode,datatype:'function'},
          {property:getConverionFactor,datatype:'function'},
          {property:getAddedUser,datatype:'function'},
          {property:getStatus,datatype:'function'}

    ]
    fillDataIntoTable(tableDrug,purchaseDrugListData,displayProperty,refillForm,deleteDrugRecord,printDrugRecord,true,UserPrivilege);
    disableBtnForDeletedStatus();
    $('#tableDrug').dataTable();



}

// get drug naem to fill in table
const getDrugNameCode=(rowOb)=>{
    return rowOb.code + "-"+rowOb.name;
}
// get conversion factor to fill in table
const getConverionFactor=(rowOb)=>{

    if (rowOb.conversionfactor!=null){
        return rowOb.conversionfactor;

    }else {
        return "-";
    }
}
// get added user
const getAddedUser=(rowOb)=>{
    return rowOb.user_id.username;
}
// get the drug status
const  getStatus=(rowOb)=>{
    if (rowOb.purchasedrugstatus_id.name=='Available') {
        return '<p ><span class="text-success border border-success rounded text-center p-1 ">'+rowOb.purchasedrugstatus_id.name+'</span></p>'
    }
    if (rowOb.purchasedrugstatus_id.name=='Not Available') {
        return '<p ><span class="text-warning border border-warning rounded text-center p-1 ">'+rowOb.purchasedrugstatus_id.name+'</span></p>'
    }
    if (rowOb.purchasedrugstatus_id.name=='Deleted') {
        return '<p ><span class="text-danger border border-danger rounded text-center p-1 ">'+rowOb.purchasedrugstatus_id.name+'</span></p>'
    }
}

// delete button disable for deleted status
const  disableBtnForDeletedStatus=()=>{
    const tableDrug = document.getElementById("tableDrug");
    const tableRows = tableDrug.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {
        const statusCell = row.querySelector("td:nth-child(5) p"); // Adjusted selector for status cell

        if (statusCell) {
            const statusValue = statusCell.textContent.trim();
            const actionCell = row.querySelector("td:nth-child(6)"); // Adjusted selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
            const deleteButton = dropdown.querySelector(".btn-danger");

            if (UserPrivilege.delete){
                if (statusValue === "Deleted") {
                    deleteButton.disabled = true;

                    deleteButton.style.display = "none";

                }
            }


        }


    });
}




// refresh sales drug form
const refreshPurchaseDrugForm=()=>{

    Title.innerText=''
    Title.innerText="New Purchase Item Enrollment"
    refreshBtn.style.visibility = 'visible'

       purchasedrug={}


    drugStatus=ajaxGetReq("/purchasedrugstatus/list");

       fillDataIntoSelect(selectDrugStatus,"select status",drugStatus,'name','Not Available')
    purchasedrug.purchasedrugstatus_id=JSON.parse(selectDrugStatus.value)
    selectDrugStatus.classList.add("is-valid");
    selectDrugStatus.disabled=true


    // drugName=ajaxGetReq("/salesdrugwithoutpurchaserecord/list");
fillDataIntoSelect(selectSalesDrugName,"Select Item Name",'','name')

    itemTypeList=ajaxGetReq("/itemtype/list");
    fillDataIntoSelect(selectItemType,"select Item Type ",itemTypeList,'name')

    productType=ajaxGetReq("/purchaseproducttype/list");
    fillDataIntoSelect(selectProductType,"select product type",productType,'name')



    selectSalesDrugName.disabled=true
    textCardFactor.disabled=true
    textTabletCount.disabled=true
    textConversionFactor.disabled=true
    selectProductType.disabled=true


    // // set default value
    selectSalesDrugName.value=''
    textCardFactor.value=''
    textTabletCount.value=''
    textConversionFactor.value=''
    selectProductType.value=''
    textPurchaseDrug.value=''
    textNote.value=''



    // //set default color
    selectSalesDrugName.classList.remove('is-valid')
    selectItemType.classList.remove('is-valid')
    textCardFactor.classList.remove('is-valid')
    textTabletCount.classList.remove('is-valid')

    textConversionFactor.classList.remove('is-valid')
    selectProductType.classList.remove('is-valid')
    textPurchaseDrug.classList.remove('is-valid')
    textNote.classList.remove('is-valid')


    // //set default color
    selectSalesDrugName.classList.remove('is-invalid')
    textCardFactor.classList.remove('is-invalid')
    textTabletCount.classList.remove('is-invalid')
    selectItemType.classList.remove('is-invalid')
    textConversionFactor.classList.remove('is-invalid')
    selectProductType.classList.remove('is-invalid')
    selectDrugStatus.classList.remove('is-invalid')
    textPurchaseDrug.classList.remove('is-invalid')
    textNote.classList.remove('is-invalid')

    //
    //
    //
    // // disable update button when form load
     btnUpdateGrg.disabled="disabled"
    // btnUpdateEmp.style.cursor="not-allowed"
    $("#btnUpdateGrg").css("cursor","not-allowed")

    //
    //
    if (UserPrivilege.insert){
        btnAddGrg.disabled=""
        btnAddGrg.style.cursor="pointer"
    }
    else {
        btnAddPat.disabled="disabled"
        btnAddPat.style.cursor="not-allowed"
    }

}

// get user confirmation befor form refresh
const  refreshPurchasedrugFormByuserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshPurchaseDrugForm();
        }
    });
}


// filter sales drugName by itemtype
const FilterByItemType=()=>{

    selectItemType.classList.add("is-valid")
   itemListNames= ajaxGetReq("/salesdrugwithoutpurchaserecord/listbyitemtype/"+JSON.parse(selectItemType.value).id)
    fillDataIntoSelect(selectSalesDrugName,"Select Item",itemListNames,'name')
    selectSalesDrugName.disabled=false



    textCardFactor.disabled=true
    textTabletCount.disabled=true
    textConversionFactor.disabled=true

    selectProductType.disabled=false

    textCardFactor.value=''
    textTabletCount.value=''
    textConversionFactor.value=''
    selectProductType.value=''
    textPurchaseDrug.value=''

    textCardFactor.classList.remove('is-valid')
    textTabletCount.classList.remove('is-valid')
    textConversionFactor.classList.remove('is-valid')
    selectProductType.classList.remove('is-valid')
    textPurchaseDrug.classList.remove('is-valid')

    textCardFactor.classList.remove('is-invalid')
    textTabletCount.classList.remove('is-invalid')
    textConversionFactor.classList.remove('is-invalid')
    selectProductType.classList.remove('is-invalid')
    textPurchaseDrug.classList.remove('is-invalid')


    selectSalesDrugName.classList.remove('is-valid')


}

// drugName for non medicine
const generateDrugNameNM=()=>{
    if (selectItemType.options[selectItemType.selectedIndex].text !== 'Medicine'){



            textPurchaseDrug.value=JSON.parse(selectSalesDrugName.value).name;
            purchasedrug.name=  textPurchaseDrug.value
            textPurchaseDrug.classList.add('is-valid');
            textPurchaseDrug.classList.remove('is-invalid');


            if (selectProductType.value!=''){
                textPurchaseDrug.value=JSON.parse(selectSalesDrugName.value).name+" "+JSON.parse(selectProductType.value).name;
                purchasedrug.name=  textPurchaseDrug.value
                textPurchaseDrug.classList.add('is-valid');
                textPurchaseDrug.classList.remove('is-invalid');
            }





    }else {
        getProductType=ajaxGetReq("/salesdrug/getproducttype/"+JSON.parse(selectSalesDrugName.value).id)
        console.log(getProductType)
        if (selectItemType.options[selectItemType.selectedIndex].text === 'Medicine' && !(getProductType.name==='Tablet' || getProductType.name==='Capsules')) {
            console.log("1")
            textPurchaseDrug.value=JSON.parse(selectSalesDrugName.value).name;
            purchasedrug.name=  textPurchaseDrug.value
            textPurchaseDrug.classList.add('is-valid');
            textPurchaseDrug.classList.remove('is-invalid');

            if (selectProductType.value!=''){
                textPurchaseDrug.value=JSON.parse(selectSalesDrugName.value).name+" "+JSON.parse(selectProductType.value).name;
                purchasedrug.name=  textPurchaseDrug.value
                textPurchaseDrug.classList.add('is-valid');
                textPurchaseDrug.classList.remove('is-invalid');
            }

        }
    }



    }

// generate drugName for medicine items which are either capsule or tablet
const generateDrugName=()=>{
    console.log("11")
    if (JSON.parse(selectItemType.value).name === 'Medicine' && (getProductType.name=='Tablet' || getProductType.name=='Capsules')){
        console.log("12")


        if(selectSalesDrugName.value!="" && textConversionFactor.value!="" && selectProductType.value!="" && textCardFactor.value!="" && textTabletCount.value!="" ){
            console.log("12")

            textPurchaseDrug.value= JSON.parse(selectSalesDrugName.value).name+" "+ "("+" "+ textCardFactor.value+"*"+textTabletCount.value+" "+")"+" "+JSON.parse(selectProductType.value).name
            purchasedrug.name=textPurchaseDrug.value

            textPurchaseDrug.classList.add('is-valid');
            textPurchaseDrug.classList.remove('is-invalid');


        }else{
            if (selectSalesDrugName.value=="" || textConversionFactor.value=="" || selectProductType.value=="" || textCardFactor.value=="" || textTabletCount.value==""){
                textPurchaseDrug.value=''
                purchasedrug.name=null

                textPurchaseDrug.classList.remove('is-valid');
                textPurchaseDrug.classList.add('is-invalid');
            }
        }



    }


}

// calculate  purchase drug conversion factor
const calculateConversionFactor2=()=>{


    if (textCardFactor.value!=null && textTabletCount.value!=null){

        calculateConversionFactor();

        if(selectSalesDrugName.value!="" && textConversionFactor.value!="" && selectProductType.value!=""){
            generateDrugName();
        }
    }



}

// enable the other fields
const enabledrugfields=()=>{

    getProductType=ajaxGetReq("/salesdrug/getproducttype/"+JSON.parse(selectSalesDrugName.value).id)
    console.log(getProductType)
    console.log(getProductType.name)
    console.log(JSON.parse(selectItemType.value).name)
    if ((JSON.parse(selectItemType.value).name === 'Medicine' && (getProductType.name==='Tablet' || getProductType.name==='Capsules')) || (JSON.parse(selectItemType.value).name === 'Grocery' && (getProductType.name==='Tablet' || getProductType.name==='Capsules'))){


                           textCardFactor.disabled=false
                           textTabletCount.disabled=false
                           selectProductType.disabled=false

                           textPurchaseDrug.value=''
                           textPurchaseDrug.classList.remove('is-valid')
                           textPurchaseDrug.classList.remove('is-invalid')



    }else {
        textCardFactor.disabled=true
        textTabletCount.disabled=true
        textConversionFactor.disabled=true

        textCardFactor.value=''
        textTabletCount.value=''
        textConversionFactor.value=''
        selectProductType.value=''
        // textPurchaseDrug.value=''

        textCardFactor.classList.remove('is-valid')
        textTabletCount.classList.remove('is-valid')
        textConversionFactor.classList.remove('is-valid')
        selectProductType.classList.remove('is-valid')
        textPurchaseDrug.classList.add('is-valid')

        textCardFactor.classList.remove('is-invalid')
        textTabletCount.classList.remove('is-invalid')
        textConversionFactor.classList.remove('is-invalid')
        selectProductType.classList.remove('is-invalid')
        textPurchaseDrug.classList.remove('is-invalid')


        selectSalesDrugName.classList.add('is-valid')

    }


}


// calculate  purchase drug conversion factor
const calculateConversionFactor=()=>{


    if (textCardFactor.value!=null && textTabletCount.value!=null){
        if ((new RegExp('^([1-9]{1}[0-9]{0,2})$').test(textCardFactor.value)) && (new RegExp('^([1-9]{1}[0-9]{0,2})$').test(textTabletCount.value)) ){
            textConversionFactor.value=textCardFactor.value*textTabletCount.value;
            purchasedrug.conversionfactor=textConversionFactor.value
            textConversionFactor.classList.add("is-valid");
            textConversionFactor.classList.remove("is-invalid");
            console.log( purchasedrug.conversionfactor);

            selectProductType.disabled=false;
        }else {
            purchasedrug.conversionfactor=null
            textConversionFactor.classList.add("is-invalid");
            textConversionFactor.classList.remove("is-valid");

        }
    }

}



// // // delete function for drug delete
const  deleteDrugRecord=(rowOb)=>{

    let DrugInfo = `Drug Code: ${rowOb.code}<br>
                 Drug name: ${rowOb.name}<br>`

    let div=document.createElement('div');
    div.style.marginLeft='50px'
    div.style.textAlign='left'
    div.innerHTML=DrugInfo
    div.style.fontSize='16px'
    Swal.fire({
        title: "Are you sure to delete following Purchase Item?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverRespnse=ajaxRequestBody("/purchasedrug","DELETE",rowOb)
            if (serverRespnse=="OK") {


                Swal.fire({
                    title: "Drug record Deleted Successfully!",

                    icon: "success"
                });
                refreshPurchaseDrugTable();




            } else {

                Swal.fire("Something went wrong", serverRespnse, "info");
            }

        }
        else {
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }

    });


    }


// // print drug details method
const  printDrugRecord=(rowOb)=>{
    console.log(rowOb)
    const DrugPrint=rowOb;


    tdDrugId.innerHTML=DrugPrint.code
    tdDrugName.innerHTML=DrugPrint.name

    if(rowOb.cardfactor!=null){
        tdCardFactor.innerHTML=DrugPrint.cardfactor
    }
    else {
        tdCardFactor.innerHTML="-"
    }
    if(rowOb.nooftablets!=null){
        tdTabletFactor.innerHTML=DrugPrint.nooftablets
    }
    else {
        tdTabletFactor.innerHTML="-"
    }

    if(rowOb.conversionfactor!=null){
        tdConversionFactor.innerHTML=DrugPrint.conversionfactor
    }
    else {
        tdConversionFactor.innerHTML="-"
    }

    if(DrugPrint.purchasedrugtype_id!=null){
        tdProductType.innerHTML=DrugPrint.purchasedrugtype_id.name
    }
    else {
        tdProductType.innerHTML='-'
    }



    tdDrugStatus.innerHTML=DrugPrint.purchasedrugstatus_id.name






    tdAddedDateTime.innerHTML=DrugPrint.addeddatetime.split('T')[0]+" "+DrugPrint.addeddatetime.split('T')[1]



    if (DrugPrint.note!=null){
        tdNote.innerHTML=DrugPrint.note
    }
    else {
        tdNote.innerHTML="null"
    }

    tdUser.innerHTML=DrugPrint.user_id.username




    let drugPrintInfo = `Drug Code : ${DrugPrint.code}<br>
                 Drug Name :  ${DrugPrint.name}`
    Swal.fire({
        title: "are you sure Print following Purchase Item record?",
        html:drugPrintInfo,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            printDrugDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })


 }
// // function to print drug details
const printDrugDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Drug record Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+

        '</head>'+
        '<style>p{font-size: 15px} </style>'+
        printDrugTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
            newTab.close()
        },2000
    )
}


//drug table print function
const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print Purchase Drug table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Purchase Drug table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
                '</head>'+
                '<h2  class="Text-center">Purchase Drug Table Details<h2>'+
                tableDrug.outerHTML
                // '<script>$(".btn-display").css("display","none")</script>'+
                // '<script>$(".btn-display").hide("display","none")</script>'
            )
            setTimeout(
                function() {
                    newTab.print()
                    newTab.close()
                },1000
            )
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }

    })





}





// check form error
const checkError=()=>{

    let errors="";

    if ( purchasedrug.salesdrug_id==null || selectSalesDrugName.value==''  ) {
        errors =errors + "Please select sale drug name <br>"
        selectSalesDrugName.classList.add('is-invalid')
    }

    if (selectSalesDrugName.value!==''){
        getProductType=ajaxGetReq("/salesdrug/getproducttype/"+JSON.parse(selectSalesDrugName.value).id)

    }


    if (selectItemType.options[selectItemType.selectedIndex].text === 'Medicine' && (getProductType.name=='Tablet' || getProductType.name=='Capsules')){
        if (purchasedrug.cardfactor==null || textCardFactor.value=='') {
            errors =errors + "Please enter card/bottle factor<br>"
            textCardFactor.classList.add('is-invalid')
        }
        if (purchasedrug.nooftablets==null || textTabletCount.value=='') {
            errors =errors + "Please enter tablet count<br>"
            textTabletCount.classList.add('is-invalid')
        }

        if (purchasedrug.purchasedrugtype_id==null || selectProductType.value=='') {
            errors =errors + "Please select product type<br>"
            selectProductType.classList.add('is-invalid')
        }
    }



    if (purchasedrug.purchasedrugstatus_id==null|| selectDrugStatus.value=='') {
        errors =errors + "Please select drug status<br>"
        selectDrugStatus.classList.add('is-invalid')
    }

    if (purchasedrug.name==null|| textPurchaseDrug.value=='') {
        errors =errors + "Drugname cannot be empty please select the fields<br>"
        textPurchaseDrug.classList.add('is-invalid')
    }

    return errors;
}


//  add function
const buttonPurchaseDrugAdd=()=>{
    console.log(purchasedrug)
     let error=checkError();

    let div=document.createElement('div');

    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'
    if (error==''){
         let druginfo = `Sales Item: ${purchasedrug.salesdrug_id.name}<br>  `;

         if (purchasedrug.cardfactor !=null){
             druginfo += `Card/bottle Factor: ${purchasedrug.cardfactor}<br>`
         }
        if (purchasedrug.nooftablets !=null){
            druginfo += ` Tablet Factor : ${purchasedrug.nooftablets}<br>`;
        }
        if (purchasedrug.purchasedrugtype_id !=null){
            druginfo+=`Product Type :${purchasedrug.purchasedrugtype_id.name}<br>  `
        }
        if (purchasedrug.conversionfactor !=null){
            druginfo+=`Conversion Factor :${purchasedrug.conversionfactor}<br>  `
        }

        druginfo += `Status: ${purchasedrug.purchasedrugstatus_id.name}<br>  `;
        druginfo += `Purchase Drug Name: ${purchasedrug.name}<br>  `;


        if (purchasedrug.note !=null){
            druginfo += ` Notw : ${purchasedrug.note}<br>`;
        }

        div.innerHTML=druginfo

        Swal.fire({
            title: "Are you sure to add following Purchase Item record?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/purchasedrug","POST",purchasedrug);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Drug record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                   refreshPurchaseDrugTable()
                    refreshPurchaseDrugForm()
                    $('a[href="#PurchaseDrugTable"]').tab('show');

                }
                else{
                    Swal.fire("Something went wrong", serverResponse, "info");

                }

            }
            else{
                Swal.fire({
                    icon: "error",
                    title: "Action Aborted"


                });
            }
        });

    }
    else{
        div.innerHTML=error
        Swal.fire({
            icon: "error",
            title: "Have following form errors",
            html: div


        });
    }
}

// refill drug form
const refillForm=(rowOb)=> {

    Title.innerText=''
    Title.innerText="Purchase  Item Update"

    purchasedrug = JSON.parse(JSON.stringify(rowOb))
    purchasedrugold = JSON.parse(JSON.stringify(rowOb))


    console.log(purchasedrug)
    console.log(purchasedrugold)


    let refillDrugInfor = `Drug code :${rowOb.code} <br>
                Drug name : ${rowOb.name}`
    let div=document.createElement('div');
    div.style.marginLeft='50px'
    div.style.textAlign='left'
    div.innerHTML=refillDrugInfor
    div.style.fontSize='16px'
    Swal.fire({
        title: "Are you sure to edit the following drug record?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#PurchaseDrugForm"]').tab('show');


            refreshBtn.style.visibility = 'visible'


            // disable add button and enable update button

            if (UserPrivilege.update) {
                btnUpdateGrg.disabled = ""
                btnUpdateGrg.style.cursor = "pointer"
            } else {
                btnUpdateGrg.disabled = "disabled"
                btnUpdateGrg.style.cursor = "not-allowed"
            }


            btnAddGrg.disabled = "disabled"
            btnAddGrg.style.cursor = "not-allowed"

            purchasedrug = rowOb
            console.log(purchasedrug)

            selectSalesDrugName.classList.remove('is-invalid')
            textCardFactor.classList.remove('is-invalid')
            textTabletCount.classList.remove('is-invalid')
            selectItemType.classList.remove('is-invalid')
            textConversionFactor.classList.remove('is-invalid')
            selectProductType.classList.remove('is-invalid')
            selectDrugStatus.classList.remove('is-invalid')
            textPurchaseDrug.classList.remove('is-invalid')
            textNote.classList.remove('is-invalid')


            selectSalesDrugName.disabled=false



            itemtypelist=ajaxGetReq("/itemtype/list");
            fillDataIntoSelect(selectItemType,"select Item Type ",itemtypelist,'name',purchasedrug.salesdrug_id.subcategory_id.category_id.itemtype_id.name)
            selectItemType.classList.add('is-valid')

            drugstatus=ajaxGetReq("/purchasedrugstatus/list");
            console.log(drugstatus)
            fillDataIntoSelect(selectDrugStatus,"select status",drugstatus,'name',purchasedrug.purchasedrugstatus_id.name)
              selectDrugStatus.classList.add("is-valid")
            selectDrugStatus.disabled=false

            drugName=ajaxGetReq("/salesdrugwithoutpurchaserecord/listbyitemtype/"+JSON.parse(selectItemType.value).id);
            drugName.push(purchasedrug.salesdrug_id)
            fillDataIntoSelect(selectSalesDrugName,"select drug name",drugName,'name',purchasedrug.salesdrug_id.name)
            selectSalesDrugName.classList.add("is-valid")

            if (rowOb.purchasedrugtype_id!=null){
                producttype=ajaxGetReq("/purchaseproducttype/list");
                fillDataIntoSelect(selectProductType,"select product type",producttype,'name',purchasedrug.purchasedrugtype_id.name)
                selectProductType.classList.add("is-valid")
            }
            getProductType=ajaxGetReq("/salesdrug/getproducttype/"+JSON.parse(selectSalesDrugName.value).id)
            if (selectItemType.options[selectItemType.selectedIndex].text === 'Medicine'&& (getProductType.name=='Tablet' || getProductType.name=='Capsule')){

                textCardFactor.disabled=false
                textTabletCount.disabled=false
                textConversionFactor.disabled=false
                selectProductType.disabled=false
            }

            if (purchasedrug.conversionfactor!=null){
                textConversionFactor.value = purchasedrug.conversionfactor
                textConversionFactor.classList.add("is-valid")
            }

            textPurchaseDrug.value = purchasedrug.name
            textPurchaseDrug.classList.add("is-valid")

            if (purchasedrug.cardfactor != null) {
                textCardFactor.value = purchasedrug.cardfactor
                textCardFactor.classList.add("is-valid")
            } else {
                textCardFactor.value = ''
            }

            if (purchasedrug.nooftablets != null) {
                textTabletCount.value = purchasedrug.nooftablets
                textTabletCount.classList.add("is-valid")
            } else {
                textTabletCount.value = ''
            }


            if (purchasedrug.note != null) {
                textNote.value = purchasedrug.note
                textNote.classList.add("is-valid")
            } else {
                textNote.value = ""
            }
        }
        else {

            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }

    })




}







// check update
const  checkUpdate=()=>{

    let updateForm='';

    if (purchasedrug.salesdrug_id.name!=purchasedrugold.salesdrug_id.name) {
        updateForm=updateForm + " Sales Drug Name " +purchasedrugold.salesdrug_id.name+ " changed into " +purchasedrug.salesdrug_id.name+"<br>";
    }

    if( purchasedrug.cardfactor!=purchasedrugold.cardfactor) {
        updateForm=updateForm + "Card/bottle Factor " +purchasedrugold.cardfactor+ " changed into " +purchasedrug.cardfactor +"<br>";
    }
    if( purchasedrug.nooftablets!=purchasedrugold.nooftablets) {
        updateForm=updateForm + "Tablet Count " +purchasedrugold.nooftablets+ " changed into " +purchasedrug.nooftablets +"<br>";
    }
    if( purchasedrug.conversionfactor!=purchasedrugold.conversionfactor) {
        updateForm=updateForm + "Conversion Factor " +purchasedrugold.conversionfactor+ " changed into " +purchasedrug.conversionfactor +"<br>";
    }

    if (purchasedrugold.purchasedrugtype_id!=null){
        if( purchasedrug.purchasedrugtype_id.name!=purchasedrugold.purchasedrugtype_id.name) {
            updateForm=updateForm + "Produt type " +purchasedrugold.purchasedrugtype_id.name+ " changed into " +purchasedrug.purchasedrugtype_id.name +"<br>";
        }
    }else{
        if (purchasedrug.purchasedrugtype_id!=null){
            updateForm=updateForm +'Product type'+purchasedrug.purchasedrugtype_id.name +"<br>"

        }
    }


    if( purchasedrug.purchasedrugstatus_id.name!=purchasedrugold.purchasedrugstatus_id.name) {
        updateForm=updateForm + "Drug Status " +purchasedrugold.purchasedrugstatus_id.name+ " changed into " +purchasedrug.purchasedrugstatus_id.name +"<br>";
    }
    if( purchasedrug.note!=purchasedrugold.note) {
        updateForm=updateForm + "Note " +purchasedrugold.note+ " changed into " +purchasedrug.note +"<br>";
    }
    if( purchasedrug.name!=purchasedrugold.name) {
        updateForm=updateForm + "Purchase Drug name " +purchasedrugold.name+ " changed into " +purchasedrug.name +"<br>";
    }

    return updateForm;
}
//button update
const buttonPurchaseDrugUpdate=()=>{

    console.log(purchasedrug);
    // check form errors
    let formErrors=checkError();
    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    if (formErrors==""){
        //form update
        let newUpdate=checkUpdate();

        if (newUpdate != ""){
            div.innerHTML=newUpdate
            div.style.fontSize='16px'
            Swal.fire({
                title: "Are you sure to update the following?",
                html:div,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm"
            }).then((result) => {
                if (result.isConfirmed) {
                    let   ajaxUpdateResponse=ajaxRequestBody("/purchasedrug","PUT",purchasedrug);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Purchase Item record updated successfully!",

                            icon: "success"
                        });
                       refreshPurchaseDrugTable()
                        refreshPurchaseDrugForm()
                        // hide the modal
                        $('a[href="#PurchaseDrugTable"]').tab('show');
                    }
                    else{
                        Swal.fire("Something went wrong", ajaxUpdateResponse, "info");
                    }

                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Action Aborted"


                    });
                }
            });






        }
        else{
            Swal.fire("No updates found", "", "info");
        }


    }
    else{
        div.innerHTML=formErrors
        Swal.fire({
            title: " Form has some errors!",
                  html:div,
            icon: "warning"
        });
    }

}











const buttonPurchaseDrugClear=()=>{




    selectItemType.value=''
    selectItemType.classList.add("is-invalid")
    selectItemType.classList.remove("is-valid")

    selectSalesDrugName.value=''
    selectSalesDrugName.classList.add("is-invalid")
    selectSalesDrugName.classList.remove("is-valid")

    textCardFactor.value=''


    textTabletCount.value=''


    textConversionFactor.value=''




    selectDrugStatus.value=''
    selectDrugStatus.classList.remove('is-valid')
    selectDrugStatus.classList.add('is-invalid')

    textPurchaseDrug.value=''
    textPurchaseDrug.classList.remove('is-valid')



    selectProductType.classList.remove('is-valid')
    selectProductType.classList.add('is-invalid')
    selectProductType.value=''



    textNote.classList.remove('is-valid')
    textNote.value=''



}
