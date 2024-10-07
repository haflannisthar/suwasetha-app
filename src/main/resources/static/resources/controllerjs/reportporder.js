
//console.log("loaded");
let totalCountChart = null;
// window load event
window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Employee");
    console.log(userPrivilege)


    let startDate=new Date();
    let startYear=startDate.getFullYear();
    let startMonth=startDate.getMonth()+1;
     if (startMonth<10){
         startMonth='0'+startMonth
     }
     let startDay=startDate.getDate();

     if (startDay<10){
         startDay='0'+startDay;
     }

    selectStartDate.max=startYear+'-'+startMonth+'-'+startDay


    let endDate=new Date();
    let endYear=endDate.getFullYear();
    let endMonth=endDate.getMonth()+1;
    if (endMonth<10){
        endMonth='0'+endMonth
    }
    let endDay=endDate.getDate();

    if (endDay<10){
        endDay='0'+endDay;
    }

    selectEndDate.max=endYear+'-'+endMonth+'-'+endDay


    
})

const generateReports=()=>{

    let endDate=selectEndDate.value
    let startDate=selectStartDate.value

    if (startDate>endDate){
        Swal.fire({
            html: 'Start date must be before the end date. Please select a valid date.',
            icon: "warning",
            confirmButtonText: "Ok"
        }).then((result) => {
           selectEndDate.value=''
           selectStartDate.value=''
        });
    }else {


        if (selectEndDate.value!='' && selectStartDate.value!=''){
            pOrderListData=ajaxGetReq("/porderdrugcountbydate?startdate="+selectStartDate.value+"&enddate="+selectEndDate.value);
            refreshPOrderTable()
        }else{
            Swal.fire({
                html: 'Please Select the dates to generate report',
                icon: "warning",
                confirmButtonText: "Ok"
            })
        }

    }




}

//function to refresh table
const refreshPOrderTable=()=>{

  // console.log(employees);
   const displayProperty=[
    {property:'itemName',datatype:'string'},
    {property:'itemCount',datatype:'string'}
  ]

  //fillDataIntoTable function call
  fillDataIntoTable(reportTablePOrder,pOrderListData,displayProperty,refillForm,deleteRecord,printRecord,false,userPrivilege);


//    bar chart area
    let labelArray=new Array();
    let dataArray=new Array();

    pOrderListData.forEach(element=>{
        labelArray.push(element.itemName)
        dataArray.push(element.itemCount)
    })

    if (totalCountChart){
        totalCountChart.destroy();
    }


    let POrderItemCountChart=document.getElementById('POrderItemCountChart').getContext('2d')

    totalCountChart=new Chart(POrderItemCountChart,{
        type:'bar',
        data: {
            labels: labelArray,
            datasets: [{
                label: 'Drug/Item Count',
                data: dataArray,
                borderColor: 'rgba(52,115,200,1)',
                backgroundColor: 'rgba(52,115,200,0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })

}




const deleteRecord=(rowOb,rowind)=>{}

//edit function
const refillForm=(rowOb, rowind)=>{}

const printRecord=(rowOb,rowind)=>{}





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
                  '<head><title>Purchase Order table Print</title>'+
                  ' <script src="../resources/jQuery/jquery.js"></script>'+
                  '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                  '<style>.btn-display { display: none; }</style>'+'</head>'+
                  '<h2  class="Text-center">Purchase Order Table Details<h2>'+
                  reportTablePOrder.outerHTML
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

  // chart print
  const printChart=()=>{
      chartPrintPOrderTotal.src=totalCountChart.toBase64Image();

      Swal.fire({
          title: "Are you sure to print chart?",

          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "confirm"
      }).then((result) => {
          if (result.isConfirmed) {
              let newWindow=window.open();

                newWindow.document.write(
                  '<head><title>Purchase Order Chart Print</title>'+
                  '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                  '<style>.row{display: flex}</style>'+
                  '</head>'+
                  '<h3  class="Text-center" >Purchase Order Print<h3>'+
                  '<div class="row"><div class="col-3"></div><div class="col-6">'+
                  chartPrintPOrderTotal.outerHTML+'</div><div class="col-3"></div></div>'

              );

              setTimeout(
                  function() {
                      newWindow.print()
                      newWindow.close()

                  },2000
              )
          }
      })


  }


  //print chart and table
const printComplete=()=>{

    chartPrintPOrderTotal.src=totalCountChart.toBase64Image();

    Swal.fire({
        title: "Are you sure to print table and chart?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {




            let newWindow=window.open();

            newWindow.document.write(
                '<head><title>Purchase Order  Print</title>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.row{display: flex}</style>'+
                '</head>'+
                '<h3  class="Text-center" >Purchase Order Print<h3>'+
                '<div class="row mt-4 mb-4"><div class="col-1"></div><div class="col-10">'+
                reportTablePOrder.outerHTML+'</div><div class="col-1"></div></div>'+
                '<div class="row mt-2"><div class="col-1"></div><div class="col-10">'+
                chartPrintPOrderTotal.outerHTML+'</div><div class="col-1"></div></div>'

            );

            setTimeout(
                function() {
                    newWindow.print()
                    newWindow.close()

                },2000
            )
        }
    })

}