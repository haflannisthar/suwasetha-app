
//console.log("loaded");
let totalCountChart = null;
// window load event
window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Employee");
    console.log(userPrivilege)

    filterOption=[
        {id:1,name:'daily'},
        {id:2,name:'weekly'},
        {id:3,name:'monthly'},
        {id:4,name:'yearly'}

    ]


    fillDataIntoSelect(selectDateOption,'Select filter option',filterOption,'name');





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

            return
        });
    }else{
        if (selectEndDate.value!='' && selectStartDate.value!='' && selectDateOption.value!=''){
            salesListData=ajaxGetReq("/salesbydate?startdate="+selectStartDate.value+"&enddate="+selectEndDate.value+"&option="+JSON.parse(selectDateOption.value).name);
            refreshSalesTable()
        }else {
            Swal.fire({
                html: 'Please Select the fields to generate report',
                icon: "warning",
                confirmButtonText: "Ok"
            })
        }

    }






}

//function to refresh table
const refreshSalesTable=()=>{

  // console.log(employees);
   const displayProperty=[
    {property:'date',datatype:'string'},
    {property:'totalsale',datatype:'string'}
  ]

  //fillDataIntoTable function call
  fillDataIntoTable(reportTableSale,salesListData,displayProperty,refillForm,deleteRecord,printRecord,false,userPrivilege);


//    bar chart area
    let labelArray=new Array();
    let dataArray=new Array();
    let borderColorArray = [];
    let backgroundColorArray=[]


    salesListData.forEach(element=>{
        labelArray.push(element.date)
        dataArray.push(element.totalsale)
    })

    if (totalCountChart){
        totalCountChart.destroy();
    }


    for (let i = 0; i < dataArray.length; i++) {
        const colors = randomColorGenerator();
        borderColorArray.push(colors.borderColor);  // Push border color to array
        backgroundColorArray.push(colors.backgroundColor);
    }

    let saleChart=document.getElementById('saleTotalChart').getContext('2d')

    totalCountChart=new Chart(saleChart,{
        type:'bar',
        data: {
            labels: labelArray,
            datasets: [{
                label: 'total sales',
                data: dataArray,
                borderColor: borderColorArray,
                backgroundColor: backgroundColorArray,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,  // Ensure the y-axis starts at zero
                    title: {
                        display: true,
                        text: 'Total Sales'
                    }
                }
            }, plugins: {
                tooltip: {
                    enabled: true // Ensure tooltips are enabled
                }
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
                  reportTableSale.outerHTML
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
      chartPrintsaleChart.src=totalCountChart.toBase64Image();

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
                  '<head><title>Sales Chart Print</title>'+
                  '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                  '<style>.row{display: flex}</style>'+
                  '</head>'+
                  '<h3  class="Text-center" >Purchase Order Print<h3>'+
                  '<div class="row"><div class="col-3"></div><div class="col-6">'+
                    chartPrintsaleChart.outerHTML+'</div><div class="col-3"></div></div>'

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

    chartPrintsaleChart.src=totalCountChart.toBase64Image();

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
                '<head><title>Sales Report Print</title>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.row{display: flex}</style>'+
                '</head>'+
                '<h3  class="Text-center" >Sales Report Print<h3>'+
                '<div class="row mt-4 mb-4"><div class="col-1"></div><div class="col-10">'+
                reportTableSale.outerHTML+'</div><div class="col-1"></div></div>'+
                '<div class="row mt-2"><div class="col-1"></div><div class="col-10">'+
                chartPrintsaleChart.outerHTML+'</div><div class="col-1"></div></div>'

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


const randomColorGenerator = function () {
    let color='#' + (Math.random().toString(16) + '0000000').slice(2, 8);
    let backgroundColor=hexColorToRGBA(color,0.2);

    return {
        borderColor: color,
        backgroundColor: backgroundColor
    };

};

const hexColorToRGBA=(hex, alpha)=>{
    // Convert each hex character pair into an integer
    let red = parseInt(hex.substring(1, 3), 16);
    let green = parseInt(hex.substring(3, 5), 16);
    let blue = parseInt(hex.substring(5, 7), 16);

    return` rgba(${red}, ${green}, ${blue}, ${alpha})`
}

