window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Sales-Drug");

    //refresh function for table and form
    refreshBrandTable()
    refreshBrandForm();




})
//function to refresh table
const refreshBrandTable=()=>{
    brandlist=ajaxGetReq("/brand/list");

    const displayProperty=[

        {property:'name',datatype:'string'},
         {property:catname,datatype:'function'}

    ]
    fillDataIntoTable(tableBrand,brandlist,displayProperty,refillBrandForm,deleteBrand,printBrand,true,userPrivilege);

    $('#tableBrand').dataTable();
    disablebtn();
}

// get category name
const catname=(rowOb)=>{
   let cat=''
    rowOb.categories.forEach((element,index)=>{
     cat+=element.name;
     if (index!== rowOb.categories.length-1){
         cat+=",";
     }
    })
    return cat;
}

// disable delete button
// delete button disablefor deleted status
const  disablebtn=()=>{
    const tableEmployee = document.getElementById("tableBrand");
    const tableRows = tableEmployee.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {

   const actionCell = row.querySelector("td:nth-child(4)"); // Adjusted selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
            const deleteButton = dropdown.querySelector(".btn-danger");


            if (userPrivilege.delete){
                deleteButton.disabled = true;

                deleteButton.style.display = "none";
            }







    });
}



const refreshBrandForm=()=>{

    brandTitle.innerHTML=' New Brand Enrollment'

    brandrefreshbtn.style.visibility = 'visible'

    brand=new Object();
    brand.categories=new Array();




    textBrand.value=''
    textBrand.classList.remove('is-valid')
    textBrand.classList.remove('is-invalid')

    catagory=ajaxGetReq("category/list")

    selectedCatogories.innerHTML=''

    selectCategory.innerText=''



    const dropdownButton = document.getElementById('dropdownMenuButton');
    const dropdownMenu = document.getElementById('selectCategory');

    dropdownMenu.classList.add('dropup');
    catagory.forEach(element=>{
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

    // disable update button when form load
    btnUpdate.disabled="disabled"
    // btnUpdateEmp.style.cursor="not-allowed"
    $("#btnUpdate").css("cursor","not-allowed")



    if (userPrivilege.insert){
        btnAdd.disabled=""
        btnAdd.style.cursor="pointer"
    }
    else {
        btnAdd.disabled="disabled"
        btnAdd.style.cursor="not-allowed"
    }

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



const  checkerror=()=>{
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
    console.log(brand);
    let error=checkerror();

    if (error==''){

        let brandcat=''
        brand.categories.forEach(element=>{
            brandcat+=element.name+" ";
        })
        console.log(brandcat)
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
                    refreshBrandForm()
                    refreshBrandTable()
                    $('a[href="#BrandTable"]').tab('show');

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

const refillBrandForm=(rowOb)=>{

    brandTitle.innerHTML=' Brand Update'

    brand=JSON.parse(JSON.stringify(rowOb))
    brandold=JSON.parse(JSON.stringify(rowOb))

    console.log(brand)
    let Info = `Brand: ${brand.name}<br>
                           `
    Swal.fire({
        title: "Are you sure to edit the following brand?",
        html:Info ,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#BrandForm"]').tab('show');


            // disable add button and enable update button

            if (userPrivilege.update){
                btnUpdate.disabled=""
                btnUpdate.style.cursor="pointer"
            }
            else {
                btnUpdateDes.disabled="disabled"
                btnUpdateDes.style.cursor="not-allowed"
            }


            btnAdd.disabled="disabled"
            btnAdd.style.cursor="not-allowed"

            textBrand.classList.remove('is-invalid')


            brand=rowOb
            console.log(brand)

            brandrefreshbtn.style.visibility = 'visible'

            textBrand.value=brand.name
            textBrand.classList.add("is-valid")

            catagory=ajaxGetReq("category/list")
             selectCategory.innerText=''

            const dropdownButton = document.getElementById('dropdownMenuButton');
            const dropdownMenu = document.getElementById('selectCategory');
            const selectedCatogories = document.getElementById('selectedCatogories');
            selectedCatogories.innerText=''
            dropdownMenu.classList.add('dropup');

            catagory.forEach(element => {
                const checkboxItem = document.createElement('li');
                checkboxItem.classList.add('dropdown-item');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = "form-check-input "
                checkbox.id = "chk" + element.name;

                checkbox.onchange = function () {
                    if (this.checked) {
                        brand.categories.push(element);

                        selectedCatogories.textContent += element.name + '\n';


                    } else {
                        let extIndex = brand.categories.map(item => item.name).indexOf(element.name);
                        selval=element.name + '\n'
                        selectedCatogories.textContent = selectedCatogories.textContent.replace(selval, '');
                        if (extIndex != -1) {
                            brand.categories.splice(extIndex, 1);

                        }
                        //            // Filter out the unchecked category from the current list of selected categories.
                        const categoriesArray = selectedCatogories.textContent.split('\n').filter(cat => cat.trim() !== element.name);

                        // Update the displayed list, joining remaining categories with '\n', and add an extra newline if the list is non-empty.
                        selectedCatogories.textContent = categoriesArray.join('\n') + (categoriesArray.length > 0 ? '\n' : '');

                    }
                }

                let extDrugIndex=brand.categories.map(item=>item.name).indexOf(element.name);
                if(extDrugIndex!=-1){
                    checkbox.checked=true;
                    selectedCatogories.textContent += element.name + '\n';
                }

                const label = document.createElement('label')
                label.className = "form-check-label "
                label.className = "ms-2"
                label.htmlFor = checkbox.id;
                label.innerText = element.name;


                label.addEventListener('click', (event) => {
                    event.stopPropagation();
                });


                // label.appendChild(checkbox);
                checkboxItem.appendChild(checkbox);
                checkboxItem.appendChild(label);
                dropdownMenu.appendChild(checkboxItem);


            })
            dropdownMenu.style.maxHeight = '200px'; // Adjust this value as needed
            dropdownMenu.style.overflowY = 'auto';



        }
        else {

                Swal.fire({
                    icon: "error",
                    title: "Action Aborted"


                });
        }
    });



}

const  checkUpdate=()=>{
    let updateForm='';

    if (brand.name!=brandold.name) {
        updateForm=updateForm + "brand name " +brandold.name+ " changed into " + brand.name +"<br>";
    }


        let newlyAddedCategories=[];
        for (let element of brand.categories){
            let extIndex=brandold.categories.map(item=>item.id).indexOf(element.id)
            if (extIndex==-1){
                // updateForm=updateForm + "Categories changed " +"<br>";
                newlyAddedCategories.push(element);
            }
        }
      let newCategories=''

       if (newlyAddedCategories.length>0){
        newCategories+='Newly Added Categories <br>'

           newlyAddedCategories.forEach(element=>{
               newCategories+=element.name+"<br>"
           })

           updateForm=updateForm +""+newCategories+"<br>";

       }




          let removedCategories=[]
    for (let element of brandold.categories){
        let extIndex=brand.categories.map(item=>item.id).indexOf(element.id)
        if (extIndex==-1){
            // updateForm=updateForm + "Categories changed " +"<br>";
            removedCategories.push(element);
        }
    }
    let removedCategoriesList=''



    if (removedCategories.length>0){
        removedCategoriesList+='Removed Categories <br>'



        removedCategories.forEach(element=>{
            removedCategoriesList+=element.name+"<br>"
        })

        updateForm=updateForm +" <br>"+removedCategoriesList+"<br>";


    }







    return updateForm;
}

const buttonBrandUpdate=()=>{
    console.log(brand)
    // check form errors
    let formerrors=checkerror();

    if (formerrors==""){
        //form update
        let newUpdate=checkUpdate();
        if (newUpdate != ""){

            Swal.fire({
                title: "Are you sure to update the following?",
                html:newUpdate,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm"
            }).then((result) => {
                if (result.isConfirmed) {
                    let   ajaxUpdateResponse=ajaxRequestBody("/brand","PUT",brand);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Brand record updated successfully!",

                            icon: "success"
                        });
                       refreshBrandTable()
                        refreshBrandForm()
                        // hide the modal
                        $('a[href="#BrandTable"]').tab('show');
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
        Swal.fire({
            title: " Form has some errors!",
    html:formerrors,
            icon: "warning"
        });
    }

}

const deleteBrand=(rowOb)=>{
    console.log(rowOb.id)
    Swal.fire({
        title: "Are you sure to delete following Brand record?",
        text: "Brand name :" +rowOb.name,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverRespnse=ajaxRequestBody("/Brand","DELETE",rowOb)
            if (serverRespnse=="OK") {


                Swal.fire({
                    title: "record Deleted Successfully!",

                    icon: "success"
                });
                refreshBrandTable()




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



//employee table print function

const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print Brand table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Brand table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Brand Table Details<h2>'+
                tableBrand.outerHTML
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
//print function
const printBrand=(rowOb,rowind)=>{


    const PrintB=rowOb;


    tdNumber.innerHTML=PrintB.id
    tdBrname.innerHTML=PrintB.name

    let printcat=''
    PrintB.categories.forEach((element,index)=>{

        printcat+=element.name;
        if (index!== PrintB.categories.length-1){
            printcat+=","
        }
    })
    // console.log(printcat)
    //
    tdCatname.innerHTML=printcat;



    let PrintInfo = ` Id : ${PrintB.id}<br>
                Brand Name :  ${PrintB.name}<br>
               Category :  ${printcat}<br>
                   `
    Swal.fire({
        title: "are you sure Print following Brand details?",
        html:PrintInfo,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            printDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })





// option 2

// $('#modalPrintEmployee').modal('show');

}
const printDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Brand Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
        '<style>p{font-size: 15px} </style>'+
        '</head>'+

        printBrandTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
        },1000
    )
}


const buttonBrandClear=()=>{
    textBrand.value=''
    textBrand.classList.remove('is-valid')
    textBrand.classList.add('is-invalid')



    const dropdownButton = document.getElementById('dropdownMenuButton');
    const dropdownMenu = document.getElementById('selectCategory');
    const selectedCatogories = document.getElementById('selectedCatogories');
    selectedCatogories.innerText=''
    dropdownMenu.classList.add('dropup');
    dropdownMenu.innerText=''
    catagory.forEach(element=>{
        const checkboxItem = document.createElement('li');
        checkboxItem.classList.add('dropdown-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className="form-check-input "
        checkbox.id="chk"+element.name;

        checkbox.onchange=function () {
            if (this.checked) {
                brand.categories.push(element);

                selectedCatogories.textContent += element.name + '\n';


            } else {
                let extIndex=brand.categories.map(item=>item.name).indexOf(element.name);
                selval=element.name + '\n'
                selectedCatogories.textContent = selectedCatogories.textContent.replace(selval, '');
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
        dropdownMenu.appendChild(checkboxItem);


    })
    dropdownMenu.style.maxHeight = '200px'; // Adjust this value as needed
    dropdownMenu.style.overflowY = 'auto';


}

