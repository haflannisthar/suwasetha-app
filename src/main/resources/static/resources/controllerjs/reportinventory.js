
//console.log("loaded");

// window load event
window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Employee");
    console.log(userPrivilege)



  //refresh function for table and form
    inventoryList=ajaxGetReq("/getdruginventory");
    refreshInventoryTable()

    initializeDataTable('#reportInventoryTable');


    
})


const getLowDrugsTable=()=>{
    inventoryList=ajaxGetReq("/getlowdruginventory");
    // refreshInventoryTable()
    initializeDataTable('#reportInventoryTable');
    refreshInventoryTable()

}


const initializeDataTable = (tableId) => {
    // Destroy the existing DataTable instance if it exists
    if ($.fn.dataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    new DataTable(tableId, {
        initComplete: function () {
            this.api()
                .columns()
                .every(function () {
                    let column = this;
                    let title = column.footer()?.textContent || ''; // Safe access using optional chaining
                    // Skip the "Action" column (Assuming it's the 5th column, index 4)
                    if (column.index() === 4) {
                        return;
                    }
                    // Create input element
                    let input = document.createElement('input');
                    input.placeholder = title;
                    column.footer().replaceChildren(input);

                    // Event listener for user input
                    input.addEventListener('keyup', () => {
                        if (column.search() !== input.value) {
                            column.search(input.value).draw();
                        }
                    });
                });
        }
    });
}

//function to refresh table
const refreshInventoryTable=()=>{

  // console.log(employees);
   const displayProperty=[
       {property:'itemname',datatype:'string'},
       {property:'availableQty',datatype:'string'},
       {property:'rop',datatype:'string'},

  ]
    console.log(inventoryList)

  //fillDataIntoTable function call
    fillDataIntoTableWithFiltering(reportInventoryTable,inventoryList,displayProperty,refillRecord,deleteRecord,printRecord,true,userPrivilege);

    disableBtnRefillAndPrint();







}


// delete button disabled
const  disableBtnRefillAndPrint=()=>{
    const reportInventoryTable = document.getElementById("reportInventoryTable");
    const tableRows = reportInventoryTable.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {


            const actionCell = row.querySelector("td:nth-child(5)"); // Adjusted selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
            const deleteButton = dropdown.querySelector(".btn-danger");
            const editButton = dropdown.querySelector(".btn-info");


                deleteButton.disabled = true;
                editButton.disabled = true;

                deleteButton.style.display = "none";
                editButton.style.display = "none";







    });
}



const deleteRecord=(rowOb,rowind)=>{}



    //edit function
const refillRecord=(rowOb,rowind)=>{
}

const printRecord=(rowOb,rowind)=>{
    getSupplierDetails=ajaxGetReq("/getreportsupplierdetails?drugname="+rowOb.itemname);
    console.log(getSupplierDetails)

// Open a new window
const newWindow = window.open();


    newWindow.document.write(`
    <html lang="">
    <head>
        <title>Supplier Details</title>
        <link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">
    </head>
    <body>
        <div class="container mt-5">
            <h1 class="mb-4 text-center" >Supplier Details</h1>
`);

    // Loop through the array and create a table for each supplier's details
    getSupplierDetails.forEach(supplier => {
        newWindow.document.write(`
        <table class="table table-bordered mb-5">
            <thead class="thead-light">
                <tr>
                    <th colspan="2">Supplier Information</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">Registration Number</th>
                    <td>${supplier.regno}</td>
                </tr>
                <tr>
                    <th scope="row">Name</th>
                    <td>${supplier.name}</td>
                </tr>
                <tr>
                    <th scope="row">Contact Number</th>
                    <td>${supplier.contactno}</td>
                </tr>
                <tr>
                    <th scope="row">Email</th>
                    <td>${supplier.email }</td>
                </tr>
                <tr>
                    <th scope="row">Arrears Amount</th>
                    <td>${supplier.arrearsamount}</td>
                </tr>
                
                 <tr>
                    <th scope="row">Supplier Status</th>
                    <td>${supplier.supplierstatus}</td>
                </tr>
            </tbody>
        </table>
    `);
    });

    newWindow.document.write(`
        </div>
    </body>
    </html>
`);

    newWindow.document.close();
    setTimeout(
        function() {
            newWindow.print()
            newWindow.close()
        },2000
    )
}










  // table print function
const printCompleteTable=()=>{
      Swal.fire({
          title: "Are you sure to print  table?",

          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "confirm"
      }).then((result) => {
          if (result.isConfirmed) {
              const newTab=window.open()
              newTab.document.write(
                  '<head><title>Inventory table Print</title>'+
                  ' <script src="../resources/jQuery/jquery.js"></script>'+
                  '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                  '<style>' +
                  '.btn-display { display: none; };' +'tfoot { display: none; }'+
                  '@media print { tfoot { display: none !important; } }'+
                  '</style>'+'</head>'+
                  '<h2  class="Text-center">Inventory Table Details<h2>'+'<div class="row mt-3 mb-3"><div class="col-1"></div><div class="col-10">'+
                  reportInventoryTable.outerHTML+'</div><div class="col-1"></div></div>'

              )
              setTimeout(
                  function() {
                      newTab.print()
                      newTab.close()
                  },2000
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

