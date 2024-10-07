window.addEventListener('load',()=>{


     // get user privilege for given module
     UserPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Sales-Drug");

    //refresh function for table and form
    refreshSalesDrugTable()
    refreshSalesDrugForm();

    refreshCategoryForm()

    refreshGenericForm()

    refreshBrandForm()


})
//function to refresh table
const refreshSalesDrugTable=()=>{
    SalesDrug=ajaxGetReq("/salesdrug/list");

    const displayProperty=[
        {property:getDrugNameCode,datatype:'function'},
          {property:getItemType,datatype:'function'},
         {property:getCategory,datatype:'function'},
         // {property:getaddeduser,datatype:'function'},
          {property:getStatus,datatype:'function'}

    ]
    fillDataIntoTable(tableDrug,SalesDrug,displayProperty,refillForm,deleteSalesDrugRecord,printSalesDrugRecord,true,UserPrivilege);
    disableBtnForDeletedStatus();

    $('#tableDrug').dataTable();


}


const getDrugNameCode=(rowOb)=>{
    return rowOb.code + " - "+rowOb.name;
}


const getItemType=(rowOb)=>{
    return rowOb.subcategory_id.category_id.itemtype_id.name;
}
const getCategory=(rowOb)=>{
    return rowOb.subcategory_id.category_id.name;
}

// const getaddeduser=(rowOb)=>{
//     return rowOb.user_id.username;
// }
// get the drug status
const  getStatus=(rowOb)=>{
    if (rowOb.drugstatus_id.name=='Available') {
        return '<p ><span class="text-success border border-success rounded text-center p-1 ">'+rowOb.drugstatus_id.name+'</span></p>'
    }
    if (rowOb.drugstatus_id.name=='Not available') {
        return '<p ><span class="text-warning border border-warning rounded text-center p-1 ">'+rowOb.drugstatus_id.name+'</span></p>'
    }
    if (rowOb.drugstatus_id.name=='Deleted') {
        return '<p ><span class="text-danger border border-danger rounded text-center p-1 ">'+rowOb.drugstatus_id.name+'</span></p>'
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

            // if (UserPrivilege.delete){
                if (statusValue === "Deleted") {
                    deleteButton.disabled = true;
                    deleteButton.style.display = "none";

                }
            // }


        }


    });
}




// refresh sales drug form
// fill the dynamic select fields
// create object
const refreshSalesDrugForm=()=>{

    Title.innerText=''
    Title.innerText=" New Sales Item Enrollment"
    refreshBtn.style.visibility = 'visible'


       salesdrug={}



    ItemType=ajaxGetReq("/itemtype/list");
    fillDataIntoSelect(selectItemType,"Select Item",ItemType,'name')

    Category=ajaxGetReq("/category/list");
    fillDataIntoSelect(selectCategory,"Select Category",Category,'name')

    subCategory=ajaxGetReq("/subcategory/list");
    fillDataIntoSelect(selectSubCategory,"Select Sub Category",subCategory,'name')


    Brand=ajaxGetReq("/brand/list");
    fillDataIntoSelect(selectBrand,"Select Brand",Brand,'name')

    productType=ajaxGetReq("/producttype/list");
    fillDataIntoSelect(selectProductType,"Select Product type",productType,'name')

    unitType=ajaxGetReq("/unittype/list");
    fillDataIntoSelect(selectUnitType,"Select Unit type",unitType,'name')

    drugStatus=ajaxGetReq("/drugstatus/list");
    fillDataIntoSelect(selectDrugStatus,"Select Drug status",drugStatus,'name','Not available')
    selectDrugStatus.classList.add("is-valid")
    salesdrug.drugstatus_id=JSON.parse(selectDrugStatus.value)
    selectDrugStatus.disabled=true



    selectRoq.disabled=true
    selectRop.disabled=true



    selectCategory.disabled=true
    selectSubCategory.disabled=true
    selectBrand.disabled=true
    selectProductType.disabled=true
    selectUnitType.disabled=true
    textUnitSize.disabled=true
    textDrugName.disabled=true
    textItemCode.disabled=true;


    // set default value
    selectItemType.value=''
    selectCategory.value=''
    selectSubCategory.value=''
    selectBrand.value=''
    selectProductType.value=''
    selectUnitType.value=''
    textUnitSize.value=''
    textDrugName.value=''
    selectRoq.value=''
    selectRop.value=''
    textNote.value=''
    textItemCode.value=''



    //set default color

    selectItemType.classList.remove('is-valid')
    selectCategory.classList.remove('is-valid')
    selectSubCategory.classList.remove('is-valid')
    selectBrand.classList.remove('is-valid')
    selectProductType.classList.remove('is-valid')
    selectUnitType.classList.remove('is-valid')
    textUnitSize.classList.remove('is-valid')
    textDrugName.classList.remove('is-valid')
    selectRoq.classList.remove('is-valid')
    selectRop.classList.remove('is-valid')
    // selectDrugStatus.classList.remove('is-valid')
    textNote.classList.remove('is-valid')
    textItemCode.classList.remove('is-valid')

    selectItemType.classList.remove('is-invalid')
    selectCategory.classList.remove('is-invalid')
    selectSubCategory.classList.remove('is-invalid')
    selectBrand.classList.remove('is-invalid')
    selectProductType.classList.remove('is-invalid')
    selectUnitType.classList.remove('is-invalid')
    textUnitSize.classList.remove('is-invalid')
    textDrugName.classList.remove('is-invalid')
    selectRoq.classList.remove('is-invalid')
    selectRop.classList.remove('is-invalid')
    // selectDrugStatus.classList.remove('is-valid')
    textNote.classList.remove('is-invalid')
    textItemCode.classList.remove('is-invalid')



    // disable update button when form load
    btnUpdateGrg.disabled="disabled"
    // btnUpdateEmp.style.cursor="not-allowed"
    $("#btnUpdateGrg").css("cursor","not-allowed")



    if (UserPrivilege.insert){
        btnAddGrg.disabled=""
        btnAddGrg.style.cursor="pointer"
    }
    else {
        btnAddPat.disabled="disabled"
        btnAddPat.style.cursor="not-allowed"
    }

}

// get user confirmation before form refresh
const  refreshSalesdrugFormByuserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshSalesDrugForm();
        }
    });
}

// filter Category by item type
const filterByItemType=()=>{

    filterCategoryByItemType=ajaxGetReq("/category/listbyitem/"+JSON.parse(selectItemType.value).id);
    console.log(filterCategoryByItemType)
    fillDataIntoSelect(selectCategory,"Select Category",filterCategoryByItemType,'name')


}

// filter sub Category  by Category
const filterByCatType=()=>{

    filterSubCategoryByCategory=ajaxGetReq("/subcategory/listbycategory/"+JSON.parse(selectCategory.value).id);
    console.log(filterSubCategoryByCategory)
    fillDataIntoSelect(selectSubCategory,"Select Sub Category",filterSubCategoryByCategory,'name')

    filterBrandByCategory=ajaxGetReq("/brand/listbycategory/"+JSON.parse(selectCategory.value).id);
    console.log(filterBrandByCategory)
    fillDataIntoSelect(selectBrand,"Select Brand",filterBrandByCategory,'name')



}



// enable category if item type is selected
// on change remove the selected values of other fields and colors
const  enableCategory=(value)=>{

    if (value!=''){
        selectCategory.disabled=false;

        selectCategory.value=''
        selectSubCategory.value=''
        selectBrand.value=''
        selectProductType.value=''
        selectUnitType.value=''
        textUnitSize.value=''

        selectSubCategory.disabled=true
        selectBrand.disabled=true
        selectProductType.disabled=true
        selectUnitType.disabled=true
        textUnitSize.disabled=true

        selectCategory.classList.remove('is-valid')
        selectSubCategory.classList.remove('is-valid')
        selectBrand.classList.remove('is-valid')
        selectProductType.classList.remove('is-valid')
        selectUnitType.classList.remove('is-valid')
        textUnitSize.classList.remove('is-valid')



    }
    else {
        selectCategory.disabled=true;
    }
}

// enable subCategory if Category is selected
const  enableSubCategory=(value)=>{

    if (value!=''){
        selectSubCategory.disabled=false;

        selectSubCategory.value=''
        selectBrand.value=''
        selectProductType.value=''
        selectUnitType.value=''
        textUnitSize.value=''

        selectBrand.disabled=true
        selectProductType.disabled=true
        selectUnitType.disabled=true
        textUnitSize.disabled=true

        selectSubCategory.classList.remove('is-valid')
        selectBrand.classList.remove('is-valid')
        selectProductType.classList.remove('is-valid')
        selectUnitType.classList.remove('is-valid')
        textUnitSize.classList.remove('is-valid')

    }
    else {
        selectSubCategory.disabled=true;
    }
}

// enable brand if sub-Category is selected
const  enableBrand=(value)=>{

    if (value!=''){
        selectBrand.disabled=false;


    }

    selectBrand.value=''
    selectProductType.value=''
    selectUnitType.value=''
    textUnitSize.value=''

    selectProductType.disabled=true
    selectUnitType.disabled=true
    textUnitSize.disabled=true

    selectBrand.classList.remove('is-valid')
    selectProductType.classList.remove('is-valid')
    selectUnitType.classList.remove('is-valid')
    textUnitSize.classList.remove('is-valid')

    if (selectItemType.value != '' && selectCategory.value != '' && textUnitSize.value != '' && selectUnitType.value != '' && selectProductType.value != '' && salesdrug.productsize != null) {
        generateDrugName();
    }
}

// enable product type if brand is selected
const  enableProductType=(value)=>{


    if (value!=''){
        selectProductType.disabled=false;
    }
    selectProductType.value=''
    selectUnitType.value=''
    textUnitSize.value=''

    selectUnitType.disabled=true
    textUnitSize.disabled=true

    selectProductType.classList.remove('is-valid')
    selectUnitType.classList.remove('is-valid')
    textUnitSize.classList.remove('is-valid')


    if (selectItemType.value != '' && selectCategory.value != '' && textUnitSize.value != '' && selectUnitType.value != '' && selectProductType.value != '' && salesdrug.productsize != null) {
        generateDrugName();
        validateName()
    }
}
// enable unit type if product type is selected
// if selected product type is device then generate drug name
const  enableUnitType=(value)=>{
    console.log(JSON.parse(selectProductType.value).name)

    selectUnitType.value=''
    textUnitSize.value=''

    textUnitSize.disabled=true

    selectUnitType.classList.remove('is-valid')
    textUnitSize.classList.remove('is-valid')

    if (value !== '' && JSON.parse(selectProductType.value).name !== 'Device' && JSON.parse(selectProductType.value).name !== "Individual Wrap") {
        selectUnitType.disabled=false;

        if (selectItemType.value != '' && selectCategory.value != '' && textUnitSize.value != '' && selectUnitType.value != '' && selectProductType.value != '' && salesdrug.productsize != null) {
            generateDrugName();
            validateName()
        }
    }
    else {
        generateDrugName();
        validateName()
        selectUnitType.disabled=true;
    }

}
// enable unit size if unit type is selected
const  enableUnitSize=(value)=> {

    textUnitSize.value=''

    textUnitSize.classList.remove('is-valid')

    if (value != '' ) {
        textUnitSize.disabled = false;
        if (selectItemType.value != '' && selectCategory.value != '' && textUnitSize.value != '' && selectUnitType.value != '' && selectProductType.value != '' && salesdrug.productsize != null) {
            generateDrugName();
            validateName()
        }
    }


}



// generate drug name if product type is device then keep disabled the unit type and unit size fields
const generateDrugName=()=>{

    if (JSON.parse(selectProductType.value).name=='Device' || JSON.parse(selectProductType.value).name=='Individual Wrap'){
        textDrugName.value=JSON.parse(selectBrand.value).name+ " "+JSON.parse(selectSubCategory.value).name+" "
           +JSON.parse(selectCategory.value).name+ " "+JSON.parse(selectProductType.value).name;
        salesdrug.name=textDrugName.value;
        // textDrugName.disabled=true;
        textDrugName.classList.add('is-valid');
        textDrugName.classList.remove('is-invalid');
        enableItemCode()


    }else {
        if (selectItemType.value!=''   && selectCategory.value!='' && textUnitSize.value!='' && selectUnitType.value!='' && selectProductType.value!='' && salesdrug.productsize!=null){

            textDrugName.value=JSON.parse(selectBrand.value).name+ " "+JSON.parse(selectSubCategory.value).name+" "+
                textUnitSize.value+ " "+JSON.parse(selectUnitType.value).name+ " "+JSON.parse(selectProductType.value).name;

            salesdrug.name=textDrugName.value;
            // textDrugName.disabled=true;
            textDrugName.classList.add('is-valid');
            textDrugName.classList.remove('is-invalid');

            enableItemCode()

        }
        else{
            textDrugName.classList.add("is-invalid")
            salesdrug.name=null

        }

    }



}


// validate the drug name
const validateName=()=>{
    let itemNameChk=''

    if (salesdrug.producttype_id.name=='Device' ||  salesdrug.producttype_id.name=='Individual Wrap'){
        console.log("12")
         itemNameChk=salesdrug.brand_id.name +" "+salesdrug.subcategory_id.name+" "+salesdrug.category_id.name+" "+salesdrug.producttype_id.name

    }else {
         itemNameChk=salesdrug.brand_id.name +" "+salesdrug.subcategory_id.name+" "+salesdrug.productsize + " "+ salesdrug.unittype_id.name+" "+salesdrug.producttype_id.name

    }

    if (textDrugName.value != itemNameChk){
        textDrugName.classList.add("is-invalid")
    }
}

// enable item code to enter
const enableItemCode=()=>{

    if (textDrugName.value!='' && salesdrug.name!=null){
        textItemCode.disabled=false;

    }
    else {
        textItemCode.disabled=true;

    }
}




// // delete function for sales drug delete
const  deleteSalesDrugRecord=(rowOb)=>{

    let DrugInfo = `Drug Code: ${rowOb.code}<br>
                 Drug name: ${rowOb.name}<br>`


    let infodiv=document.createElement('div')
    infodiv.style.textAlign='left'
    infodiv.style.marginLeft='50px'
    infodiv.style.fontSize='15px'
    infodiv.innerHTML=DrugInfo
    Swal.fire({
        title: "Are you sure to delete following Sales Drug?",
        html: infodiv,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverRespnse=ajaxRequestBody("/salesdrug","DELETE",rowOb)
            if (serverRespnse=="OK") {


                Swal.fire({
                    title: "Drug record Deleted Successfully!",

                    icon: "success"
                });
                refreshSalesDrugTable();




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
const  printSalesDrugRecord=(rowOb)=>{

    const DrugPrint=rowOb;
    console.log(DrugPrint)

    tdDrugId.innerHTML=DrugPrint.code
    tdDrugName.innerHTML=DrugPrint.name
    tdItemType.innerHTML=DrugPrint.subcategory_id.category_id.itemtype_id.name
    tdCategory.innerHTML=DrugPrint.subcategory_id.category_id.name
    tdSubCategory.innerHTML=DrugPrint.subcategory_id.name
    tdBrandName.innerHTML=DrugPrint.brand_id.name
    tdProductType.innerHTML=DrugPrint.producttype_id.name


    if (DrugPrint.unittype_id!=null){
        tdUnitType.innerHTML=DrugPrint.unittype_id.name
    }
    if (DrugPrint.productsize!=null){
        tdUnitSize.innerHTML=DrugPrint.productsize
    }



    if (DrugPrint.rop!=null){
        tdRop.innerHTML=DrugPrint.rop
    }
    else {
        tdRop.innerHTML="-"
    }
    if (DrugPrint.roq!=null){
        tdRoq.innerHTML=DrugPrint.roq
    }
    else {
        tdRoq.innerHTML="-"
    }


    tdDrugStatus.innerHTML=DrugPrint.drugstatus_id.name

    if (DrugPrint.note!=null){
        tdNote.innerHTML=DrugPrint.note
    }
    else {
        tdNote.innerHTML="-"
    }

    tdUser.innerHTML=DrugPrint.user_id.username




    let drugPrintInfo = `Item Code : ${DrugPrint.code}<br>
                 Item Name :  ${DrugPrint.name}`

    let infodiv=document.createElement('div')
    infodiv.style.textAlign='left'
    infodiv.style.marginLeft='50px'
    infodiv.style.fontSize='15px'
    infodiv.innerHTML=drugPrintInfo

    Swal.fire({
        title: "are you sure Print following Item record?",
        html:infodiv,
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
        '<head><title>Item record Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        printDrugTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
        },1000
    )
}





// check form error
const checkError=()=>{

    let errors="";

    if ( salesdrug.itemtype_id==null || selectItemType.value==''  ) {
        errors =errors + "Please select a Item Type<br>"
        selectItemType.classList.add('is-invalid')
    }
    if (salesdrug.category_id==null || selectCategory.value=='') {
        errors =errors + "Please select Category<br>"
        selectCategory.classList.add('is-invalid')
    }
    if (salesdrug.subcategory_id==null || selectSubCategory.value=='' ) {
        errors =errors + "Please select Sub-Category<br>"
        selectSubCategory.classList.add('is-invalid')
        // dropdownMenuButton.
    }
    if (salesdrug.brand_id==null || selectBrand.value=='' ) {
        errors =errors + "Please select Brand<br>"
        selectBrand.classList.add('is-invalid')
        // dropdownMenuButton.
    }

    if (salesdrug.producttype_id==null || selectProductType.value=='') {
        errors =errors + "Please select product type<br>"
        selectProductType.classList.add('is-invalid')
    }
    console.log(salesdrug.producttype_id)

    if (selectProductType.value!==''){
        if (salesdrug.producttype_id!=null && salesdrug.producttype_id.name!='Device' && JSON.parse(selectProductType.value).name !== "Individual Wrap"){

            if (salesdrug.unittype_id==null || selectUnitType.value=='') {
                errors =errors + "Please select unit <br>"
                selectUnitType.classList.add('is-invalid')
            }
            if (salesdrug.productsize==null || textUnitSize.value=='') {
                errors =errors + "Please enter unit size<br>"
                textUnitSize.classList.add('is-invalid')
            }
        }
    }



    if (salesdrug.name==null|| textDrugName.value=='') {
        errors =errors + "Drugname cannot be empty please select the fields<br>"
        textDrugName.classList.add('is-invalid')
    }
    if (salesdrug.code==null|| textItemCode.value=='') {
        errors =errors + "please enter item code<br>"
        textItemCode.classList.add('is-invalid')
    }

    // if ( salesdrug.itemtype_id==null && salesdrug.itemtype_id.name==='Medicine'  ) {
    //     if (salesdrug.rop==null || selectRop.value=='') {
    //         errors =errors + "please enter rop<br>"
    //         selectRop.classList.add('is-invalid')
    //     }
    // }

    // if (salesdrug.roq==''|| selectRoq.value=='') {
    //     errors =errors + "please enter roq<br>"
    //     selectRoq.classList.add('is-invalid')
    // }

    if (salesdrug.drugstatus_id==null|| selectDrugStatus.value=='') {
        errors =errors + "Please select drug status<br>"
        selectDrugStatus.classList.add('is-invalid')
    }
    return errors;
}


// sales drug add function
const buttonSalesDrugAdd=()=>{

    console.log(salesdrug)
    let error=checkError();
   let infodiv=document.createElement('div')
    infodiv.style.textAlign='left'
    infodiv.style.marginLeft='50px'

    if (error==''){
         let druginfo = `
                Item name: ${salesdrug.name}<br>
                Item code: ${salesdrug.code}<br>
                 Item Type: ${salesdrug.itemtype_id.name}<br>
                 Category: ${salesdrug.category_id.name}<br>
                 Sub Category: ${salesdrug.subcategory_id.name}<br>
                 Brand name: ${salesdrug.brand_id.name}<br>
                  Product Type: ${salesdrug.producttype_id.name}<br>
                 Drug status: ${salesdrug.drugstatus_id.name}<br> `;


        if (salesdrug.unittype_id !=null){
            druginfo += ` Unit type: ${salesdrug.unittype_id.name}<br>`;
        }

        if (salesdrug.productsize !=null){
            druginfo += ` unit size: ${salesdrug.productsize}<br>`;
        }

        if (salesdrug.roq !=null){
            druginfo += ` Re-order quantity : ${salesdrug.roq}<br>`;
        }

        if (salesdrug.rop !=null){
            druginfo += `Re-order point: ${salesdrug.rop}<br>`
        }



        infodiv.style.fontSize='15px'
        infodiv.innerHTML=druginfo

        Swal.fire({
            title: "Are you sure to add following item record?",
            html: infodiv,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/salesdrug","POST",salesdrug);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Item record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                   refreshSalesDrugTable()
                    refreshSalesDrugForm()
                    $('a[href="#SalesDrugTable"]').tab('show');

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
        infodiv.innerHTML=error
        Swal.fire({
            icon: "error",
            title: "Form has Following Errors",
            html: infodiv


        });
    }
}

// refill drug form
const refillForm=(rowOb)=> {

    Title.innerText=''
    Title.innerText="Sales Drug Update"

    salesdrug = JSON.parse(JSON.stringify(rowOb))
    salesdrugold = JSON.parse(JSON.stringify(rowOb))


    let refillDrugInfor = `Item code :${rowOb.code} <br>
                Item name : ${rowOb.name}`
    let infodiv=document.createElement('div')
    infodiv.style.textAlign='left'
    infodiv.style.marginLeft='50px'
    infodiv.style.fontSize='15px'
    infodiv.innerHTML=refillDrugInfor

    Swal.fire({
        title: "Are you sure to edit the following item record?",
        html: infodiv,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#SalesDrugForm"]').tab('show');

            refreshBtn.style.visibility = 'visible'

            selectItemType.classList.remove('is-invalid')
            selectCategory.classList.remove('is-invalid')
            selectSubCategory.classList.remove('is-invalid')
            selectBrand.classList.remove('is-invalid')
            selectProductType.classList.remove('is-invalid')
            selectUnitType.classList.remove('is-invalid')
            textUnitSize.classList.remove('is-invalid')
            textDrugName.classList.remove('is-invalid')
            selectRoq.classList.remove('is-invalid')
            selectRop.classList.remove('is-invalid')
            // selectDrugStatus.classList.remove('is-valid')
            textNote.classList.remove('is-invalid')
            textItemCode.classList.remove('is-invalid')


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

            salesdrug = rowOb
            console.log(salesdrug)


            selectCategory.disabled=false
            selectSubCategory.disabled=false
            selectBrand.disabled=false
            selectProductType.disabled=false
            selectUnitType.disabled=false
            textUnitSize.disabled=false
            textDrugName.disabled=true
            textItemCode.disabled=false;

            if (salesdrug.producttype_id.name === 'Device'){
                selectUnitType.disabled=true
                textUnitSize.disabled=true
            }

            ItemType=ajaxGetReq("/itemtype/list");
            fillDataIntoSelect(selectItemType,"Select Item",ItemType,'name',salesdrug.subcategory_id.category_id.itemtype_id.name)
            salesdrug.itemtype_id=salesdrug.subcategory_id.category_id.itemtype_id
            selectItemType.classList.add("is-valid")


            filterCategoryByItemType=ajaxGetReq("/category/listbyitem/"+JSON.parse(selectItemType.value).id);
            fillDataIntoSelect(selectCategory,"Select Category",filterCategoryByItemType,'name',salesdrug.subcategory_id.category_id.name)
            salesdrug.category_id=salesdrug.subcategory_id.category_id
            selectCategory.classList.add("is-valid")

            filterSubCategoryByCategory=ajaxGetReq("/subcategory/listbycategory/"+JSON.parse(selectCategory.value).id);
            fillDataIntoSelect(selectSubCategory,"Select Sub Category",filterSubCategoryByCategory,'name',salesdrug.subcategory_id.name)
            selectSubCategory.classList.add("is-valid")

            filterBrandByCategory=ajaxGetReq("/brand/listbycategory/"+JSON.parse(selectCategory.value).id);
            fillDataIntoSelect(selectBrand,"Select Brand",filterBrandByCategory,'name',salesdrug.brand_id.name)
            selectBrand.classList.add("is-valid")

            productType=ajaxGetReq("/producttype/list");
            fillDataIntoSelect(selectProductType,"Select Product type",productType,'name',salesdrug.producttype_id.name)
            selectProductType.classList.add("is-valid")


            if (salesdrug.unittype_id!=null){
                unitType=ajaxGetReq("/unittype/list");
                fillDataIntoSelect(selectUnitType,"Select Unit type",unitType,'name', salesdrug.unittype_id.name)
                selectUnitType.classList.add("is-valid")
            }



            drugStatus=ajaxGetReq("/drugstatus/list");
            fillDataIntoSelect(selectDrugStatus,"Select Drug status",drugStatus,'name',salesdrug.drugstatus_id.name)
            selectDrugStatus.classList.add("is-valid")
            selectDrugStatus.disabled=false



            textItemCode.value = salesdrug.code
            textItemCode.classList.add("is-valid")

            if (salesdrug.productsize!=null){
                textUnitSize.value = salesdrug.productsize
                textUnitSize.classList.add("is-valid")
            }


            textDrugName.value = salesdrug.name
            textDrugName.classList.add("is-valid")

            if (salesdrug.roq != null) {
                selectRoq.value = salesdrug.roq
                selectRoq.classList.add("is-valid")
            } else {
                selectRoq.value = ''
            }

            if (salesdrug.rop != null) {
                selectRop.value = salesdrug.rop
                selectRop.classList.add("is-valid")
            } else {
                selectRop.value = ''
            }


            if (salesdrug.note != null) {
                textNote.value = salesdrug.note
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

    if (salesdrug.itemtype_id.name!==salesdrugold.subcategory_id.category_id.itemtype_id.name) {
        updateForm=updateForm + "Item Type " +salesdrugold.subcategory_id.category_id.itemtype_id.name+ " changed into " + salesdrug.itemtype_id.name+"<br>";
    }

    if (salesdrug.category_id.name!==salesdrugold.subcategory_id.category_id.name) {
        updateForm=updateForm + "Category " +salesdrugold.subcategory_id.category_id.name+ " changed into " + salesdrug.category_id.name+"<br>";
    }

    if (salesdrug.subcategory_id.name!=salesdrugold.subcategory_id.name) {
        updateForm=updateForm + "Sub Category" +salesdrugold.subcategory_id.name+ " changed into " + salesdrug.subcategory_id.name+"<br>";
    }

    if( salesdrug.brand_id.name!=salesdrugold.brand_id.name) {
        updateForm=updateForm + "Brand name " +salesdrugold.brand_id.name+ " changed into " +salesdrug.brand_id.name +"<br>";
    }
    if (salesdrug.producttype_id.name!=salesdrugold.producttype_id.name) {
        updateForm=updateForm + "Drug type " +salesdrugold.producttype_id.name+ " changed into " +salesdrug.producttype_id.name +"<br>";
    }
    if (salesdrug.unittype_id.name!=salesdrugold.unittype_id.name) {
        updateForm=updateForm + "Drug unit " +salesdrugold.unittype_id.name+ " changed into " + salesdrug.unittype_id.name+"<br>";
    }
    if (salesdrug.productsize!=salesdrugold.productsize) {
        updateForm=updateForm + "Drug size " +salesdrugold.productsize+ " changed into " + salesdrug.productsize+"<br>";
    }

    if (salesdrug.name!=salesdrugold.name) {
        updateForm=updateForm + "Item name " +salesdrugold.name+ " changed into " + salesdrug.name+"<br>";
    }

    if (salesdrug.code!=salesdrugold.code) {
        updateForm=updateForm + "Item Code name " +salesdrugold.code+ " changed into " + salesdrug.code+"<br>";
    }
    if (salesdrug.roq!=salesdrugold.roq) {
        updateForm=updateForm + "Re-order quantity " +salesdrugold.roq+ " changed into " + salesdrug.roq+"<br>";
    }
    if (salesdrug.rop!=salesdrugold.rop) {
        updateForm=updateForm + "Re-order point " +salesdrugold.rop+ " changed into " + salesdrug.rop+"<br>";
    }

    if (salesdrug.drugstatus_id.name!=salesdrugold.drugstatus_id.name) {
        updateForm=updateForm + "Drug status " +salesdrugold.drugstatus_id.name+ " changed into " + salesdrug.drugstatus_id.name+"<br>";
    }


    if (salesdrug.note!=salesdrugold.note) {
        updateForm=updateForm + "Note " +salesdrugold.note+ " changed into " + salesdrug.note+"<br>";
    }


    return updateForm;
}
//button update
const buttonSalesDrugUpdate=()=>{

    console.log(salesdrug);
    // check form errors
    let formErrors=checkError();

    infodiv=document.createElement('div')
    infodiv.style.textAlign='left'
    infodiv.style.marginLeft='50px'


    if (formErrors==""){
        //form update
        let newUpdate=checkUpdate();
        infodiv.style.fontSize='15px'
        infodiv.innerHTML=newUpdate
        if (newUpdate != ""){

            Swal.fire({
                title: "Are you sure to update the following?",
                html:infodiv,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm"
            }).then((result) => {
                if (result.isConfirmed) {
                    let   ajaxUpdateResponse=ajaxRequestBody("/salesdrug","PUT",salesdrug);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Item record updated successfully!",

                            icon: "success"
                        });
                        refreshSalesDrugTable()
                        refreshSalesDrugForm()
                        // hide the modal
                        $('a[href="#SalesDrugTable"]').tab('show');
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
        infodiv.innerHTML=formErrors

        Swal.fire({
            title: " Form has Following Errors!",
                  html:infodiv,
            icon: "warning"
        });
    }

}





//sales drug table print function
const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print Sales Drug table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Item table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Item Table Details<h2>'+
                tableDrug.outerHTML
                // '<script>$(".btn-display").css("display","none")</script>'+
                // '<script>$(".btn-display").hide("display","none")</script>'
            )
            setTimeout(
                function() {
                    newTab.print()
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





const buttonClear=()=>{

    // drugStatus=ajaxGetReq("/drugStatus/list");
    // fillDataIntoSelect(selectDrugStatus,"Select Drug status",drugStatus,'name','Not available')
    // selectDrugStatus.classList.add("is-valid")
    //

     selectItemType.value=''
    selectItemType.classList.remove('is-valid')
    selectItemType.classList.add('is-invalid')

    selectCategory.value=""
    selectCategory.classList.remove('is-valid')
    selectCategory.classList.add('is-invalid')

    selectSubCategory.value=''
     selectSubCategory.classList.remove('is-valid')
    selectSubCategory.classList.add('is-invalid')
    //
    //
    //
    selectBrand.classList.remove('is-valid')
    selectBrand.classList.add('is-invalid')
    selectBrand.value=''
    console.log(selectBrand.value)


    selectProductType.classList.remove('is-valid')
    selectProductType.classList.add('is-invalid')
    selectProductType.value=''

    //
    selectUnitType.classList.remove('is-valid')
    selectUnitType.classList.add('is-invalid')
    selectUnitType.value=''


    textUnitSize.classList.remove('is-valid')
    textUnitSize.classList.add('is-invalid')
    textUnitSize.value=''
    //
    //
    //
    textDrugName.classList.remove('is-valid')
    // textDrugName.classList.add('is-invalid')
    textDrugName.value=''


    selectRoq.classList.remove('is-valid')
    selectRoq.value=''


    selectRop.classList.remove('is-valid')
    selectRop.value=''


    textNote.classList.remove('is-valid')
    textNote.value=''



}









//category modal area -----------------------------------------------------------------------------------------------------------------------------------
const refreshCategoryForm=()=>{


    category={}



    textCategory.value=''
    textCategory.classList.remove('is-valid')
    textCategory.classList.remove('is-invalid')

    ItemType=ajaxGetReq("/itemtype/list");
    fillDataIntoSelect(selectModalItemType,"Select Item",ItemType,'name')
    selectModalItemType.value=''
    selectModalItemType.classList.remove("is-valid");
    selectModalItemType.classList.remove("is-invalid");



}

// get user confirmation befor form refresh
const  refreshCategoryFormByuserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshCategoryForm();
        }
    });
}

const  checkCategoryError=()=>{
    let error="";

    if (category.name==null || textCategory.value==''){
        error =error + "Please enter Category name<br>"
        textCategory.classList.add('is-invalid')
    }

    if (category.itemtype_id==null || selectModalItemType.value==''){
        error =error + "Please select item type<br>"
        selectModalItemType.classList.add('is-invalid')
    }


    return error;
}

const buttonCategoryAdd=()=>{
    console.log(category);
    let error=checkCategoryError();

    if (error==''){
        let Info = `Category: ${category.name}<br>
                         Item Type: ${category.itemtype_id.name}<br>
                            `

        Swal.fire({
            title: "Are you sure to add following Category?",
            html: Info,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/category","POST",category);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Category record Added Successfully!",
                        text: "",
                        icon: "success"
                    });





                    if (selectItemType.value!=''){
                        filterCategoryByItemType=ajaxGetReq("/category/listbyitem/"+JSON.parse(selectItemType.value).id);
                        console.log(filterCategoryByItemType)
                        fillDataIntoSelect(selectCategory,"Select Category",filterCategoryByItemType,'name',textCategory.value)
                        selectCategory.disabled=false
                        selectCategory.classList.add('is-valid')
                        salesdrug.category_id=JSON.parse(selectCategory.value)
                        selectSubCategory.disabled=false
                        filterByCatType()
                    }

                    refreshCategoryForm()

                    $('#modalCategoryAddForm').modal('hide');
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
        Swal.fire({
            icon: "error",
            title: "Form has Following Errors",
            html: error


        });
    }
}



//modal sub category -----------------------------------------------------------------------------------------------------------------------


const refreshGenericForm=()=>{



    subcategory={}



    textSubCategory.value=''
    textSubCategory.classList.remove('is-valid')
    textSubCategory.classList.remove('is-invalid')

    categoryList=ajaxGetReq("/category/list");
    fillDataIntoSelect(selectModalCategory,"Select Category",categoryList,'name')
    selectModalCategory.value=''
    selectModalCategory.classList.remove("is-valid")




}

// get user confirmation befor form refresh
const  refreshSubCategoryFormByuserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshGenericForm();
        }
    });
}

const  checkSubCategoryError=()=>{
    let error="";

    if (subcategory.name==null || textSubCategory.value==''){
        error =error + "Please enter sub category<br>"
        textSubCategory.classList.add('is-invalid')
    }
    if (subcategory.category_id==null || selectModalCategory.value==''){
        error =error + "Please select category<br>"
        selectModalCategory.classList.add('is-invalid')
    }


    return error;
}

const buttonGenericAdd=()=>{

    let error=checkSubCategoryError();

    if (error==''){
        let Info = `subcategory: ${subcategory.name}<br>
                             category : ${subcategory.category_id.name}<br>
                            `

        Swal.fire({
            title: "Are you sure to add following Sub category?",
            html: Info,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/subcategory","POST",subcategory);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "sub-category record Added Successfully!",
                        text: "",
                        icon: "success"
                    });




                    if (selectCategory.value!=''){
                        filterSubCategoryByCategory=ajaxGetReq("/subcategory/listbycategory/"+JSON.parse(selectCategory.value).id);
                        console.log(filterSubCategoryByCategory)
                        fillDataIntoSelect(selectSubCategory,"Select Sub Category",filterSubCategoryByCategory,'name',textSubCategory.value)
                        selectSubCategory.disabled=false
                        selectSubCategory.classList.add('is-valid')
                        salesdrug.subcategory_id=JSON.parse(selectSubCategory.value)
                        selectBrand.disabled=false

                    }
                    refreshGenericForm()
                    $('#modalSubCategoryAddForm').modal('hide');
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
        Swal.fire({
            icon: "error",
            title: "Have following form errors",
            html: error


        });
    }
}



//brand add modal start ---------------------------------------------------------------------------------------------------------------------------------

const refreshBrandForm=()=>{




    brand=new Object();
    brand.categories=new Array();




    textBrand.value=''
    textBrand.classList.remove('is-valid')
    textBrand.classList.remove('is-invalid')

    catagoryList=ajaxGetReq("category/list")

    selectedCatogories.innerHTML=''

    selectBrandModalCategory.innerText=''



    const dropdownButton = document.getElementById('dropdownMenuButton');
    const dropdownMenu = document.getElementById('selectBrandModalCategory');

    dropdownMenu.classList.add('dropup');
    catagoryList.forEach(element=>{
        const checkboxItem = document.createElement('li');
        checkboxItem.classList.add('dropdown-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className="form-check-input "
        checkbox.id="chk"+element.name;

        checkbox.onchange=function () {
            if (this.checked) {

                console.log("category have"+    brand.categories)
                brand.categories.push(element);

                selectedCatogories.textContent += element.name + '\n';


            } else {
                let extIndex=brand.categories.map(item=>item.name).indexOf(element.name);
                selval=element.name + '\n'
                selectedCatogories.textContent = selectedCatogories.textContent.replace(element.name, '');

                if (extIndex!=-1) {
                    brand.categories.splice(extIndex,1);

                }
            }
        }

        const label=document.createElement('label')
        label.className="form-check-label "
        label.className="ms-2"
        label.htmlFor=checkbox.id;
        label.innerText=element.name;



        label.addEventListener('click', (event) => {
            event.stopPropagation();
        });




        // label.appendChild(checkbox);
        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(label);
        checkboxItem.className="dropdown-item";
        dropdownMenu.appendChild(checkboxItem);


    })

    dropdownMenu.style.maxHeight = '200px'; // Adjust this value as needed
    dropdownMenu.style.overflowY = 'auto';



}

// get user confirmation befor form refresh
const  refreshBrandFormByuserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshBrandForm();
        }
    });
}



const  checkBrandError=()=>{
    let error="";

    if (brand.name==null || textBrand.value==''){
        error =error + "Please enter Brand<br>"
        textBrand.classList.add('is-invalid')
    }
    if (brand.categories.length==0) {
        error =error + "Please select the relevant categories<br>"
        // dropdownMenuButton.classList.add('is-invalid')
    }




    return error;
}

const buttonBrandAdd=()=>{
    let error=checkBrandError();

    if (error==''){

        let brandcat=''
        brand.categories.forEach(element=>{
            brandcat+=element.name+" ";
        })
        let Info = `Brand: ${brand.name}<br>
                            Category : ${brandcat}`

        Swal.fire({
            title: "Are you sure to add following Brand?",
            html: Info,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/brand","POST",brand);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Brand record Added Successfully!",
                        text: "",
                        icon: "success"
                    });


                    if (selectCategory.value!=''){
                        filterBrandByCategory=ajaxGetReq("/brand/listbycategory/"+JSON.parse(selectCategory.value).id);
                        console.log(filterBrandByCategory)
                        fillDataIntoSelect(selectBrand,"Select Brand",filterBrandByCategory,'name',textBrand.value)
                        selectBrand.disabled=false
                        selectBrand.classList.add('is-valid')
                        salesdrug.brand_id=JSON.parse(selectBrand.value)
                        selectProductType.disabled=false
                    }

                    refreshBrandForm()
                    $('#modalBrandAddForm').modal('hide');

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
        Swal.fire({
            icon: "error",
            title: "Have following form errors",
            html: error


        });
    }
}