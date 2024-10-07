// window load event

let roqChart = null;

let ropChart = null;


window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Employee");
    console.log(userPrivilege)

    roqUpdateBtn.disabled=true
    ropUpdateBtn.disabled=true

    salesDrugList=ajaxGetReq("/salesdrug/getdruglistforroq")
    fillDataIntoSelect(selectRoqDrug,'select item name',salesDrugList,'name')

    salesDrugROPList=ajaxGetReq("/salesdrug/getdruglistforrop")
    fillDataIntoSelect(selectRopDrugName,'select item name',salesDrugROPList,'name')



    // set date for rop roq

    let maxDate= new Date()
    let minDate= new Date()

    let maxMonth =maxDate.getMonth()+1;

    if (maxMonth<10){
        maxMonth='0'+maxMonth;
    }

    let maxDay= maxDate.getDate();
    if (maxDay < 10){
        maxDay='0'+ maxDay;
    }

    let minMonth=minDate.getMonth()-2
    if (minMonth<10){
        minMonth='0'+minMonth;
    }

    let minDay= maxDate.getDate();
    if (minDay < 10){
        minDay='0'+ minDay;
    }
    console.log(maxDate.getFullYear() +"-"+ minMonth+"-"+minDay)
    selectRoqEndDate.max=maxDate.getFullYear() +"-"+ maxMonth+"-"+maxDay;
    selectRoqStartDate.max=maxDate.getFullYear() +"-"+ minMonth+"-"+minDay;


    selectRopEndDate.max=maxDate.getFullYear() +"-"+ maxMonth+"-"+maxDay;
    selectRopStartDate.max=maxDate.getFullYear() +"-"+ minMonth+"-"+minDay;




})

let calculatedROQValue;

const generateRoqReports=()=>{

    if (selectRoqDrug.value!='' && selectRoqStartDate.value!='' && selectRoqEndDate.value!=''){

        if (selectRoqStartDate.value>selectRoqEndDate.value){
            Swal.fire({
                icon: 'error',
                title: 'Invalid Date',
                text: 'Start Date cannot be greater than End Date'
            });
            selectRoqStartDate.value==''
            selectRoqEndDate.value==''
        }else{
            roqDrugCountByMonth=getRoqDrugByMonth=ajaxGetReq("/getroqbymonth?drugid="+JSON.parse(selectRoqDrug.value).id +"&startdate="+selectRoqStartDate.value+"&enddate="+selectRoqEndDate.value)
            console.log(roqDrugCountByMonth)


            const displayProperty=[
                {property:'month',datatype:'string'},
                {property:'itemCount',datatype:'string'}
            ]

            //fillDataIntoTable function call
            fillDataIntoTable(roqDetailsTable,roqDrugCountByMonth,displayProperty,refillForm,deleteRecord,printRecord,false,userPrivilege);

            roqDrugTitle.innerHTML='Item Name : '+JSON.parse(selectRoqDrug.value).name

            totalItemCount=''
            noOfMonths=0

            roqDrugCountByMonth.forEach(element=>{
                totalItemCount =Number(totalItemCount)+Number(element.itemCount)
                noOfMonths=noOfMonths+1;
            })
            console.log(totalItemCount)
            console.log(noOfMonths)
            console.log(Math.ceil(Number(totalItemCount)/noOfMonths))
            calculatedROQValue=Math.ceil(Number(totalItemCount) / noOfMonths)
            averageRoqQuantity.innerHTML=Math.ceil(Number(totalItemCount)/noOfMonths)

            //    bar chart area
            let roqLabelArray=new Array();
            let roqDataArray=new Array();

            roqDrugCountByMonth.forEach(element=>{
                roqLabelArray.push(element.month)
                roqDataArray.push(element.itemCount)
            })

            if (roqChart){
                roqChart.destroy();
            }


            let roqChartView=document.getElementById('roqChart').getContext('2d')

            roqChart=new Chart(roqChartView,{
                type:'bar',
                data: {
                    labels: roqLabelArray,
                    datasets: [{
                        label: 'Drug/Item Count by month '+JSON.parse(selectRoqDrug.value).name,
                        data: roqDataArray,
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

            roqUpdateBtn.disabled=false
        }


    }else{
        Swal.fire({
            icon: 'error',
            title: 'Empty Field',
            text: 'Please select the fields'
        });

        roqUpdateBtn.disabled=true
    }

}

// update roq
const updateROQSalesItem=()=>{

    Swal.fire({
        title: "Are you sure to update the ROQ?",
        html:"Sales Item : "+JSON.parse(selectRoqDrug.value).name+"<br>ROQ : "+calculatedROQValue ,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            salesdrug=ajaxGetReq("/salesdrug/getdrugbyid/"+JSON.parse(selectRoqDrug.value).id)
            console.log(salesdrug)
            salesdrug.roq=calculatedROQValue

            let   ajaxUpdateResponse=ajaxRequestBody("/salesdrug","PUT",salesdrug);
            if (ajaxUpdateResponse=="OK") {
                Swal.fire({
                    title: " Item record updated successfully!",

                    icon: "success"
                });

                roqUpdateBtn.disabled=true
            }else{
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


const deleteRecord=(rowOb,rowind)=>{}

//edit function
const refillForm=(rowOb, rowind)=>{}

const printRecord=(rowOb,rowind)=>{}


const printRoqCompleteTable=()=>{
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
                '<head><title>table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+'</head>'+
                '<h2  class="Text-center">Ordered Item By Month Details<h2>'+
                roqDetailsTable.outerHTML
                // '<script>$(".btn-display").css("display","none")</script>'+
                // '<script>$(".btn-display").hide("display","none")</script>'
            )
            setTimeout(
                function() {
                    newTab.print()
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


const printRoqChart=()=>{



    Swal.fire({
        title: "Are you sure to print the chart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            chartPrintRoqChart.src=roqChart.toBase64Image();
            let newWindow=window.open();

            newWindow.document.write(
                '<head><title> Chart Print</title>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.row{display: flex}</style>'+
                '</head>'+
                '<h3  class="Text-center" >Ordered Item By Month<h3>'+
                '<div class="row"><div class="col-3"></div><div class="col-6">'+
                chartPrintRoqChart.outerHTML+'</div><div class="col-3"></div></div>'

            );

            setTimeout(
                function() {
                    newWindow.print()
                    newWindow.close()
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







let calculatedROPValue;

//rop details start
const generatereRopreports=()=>{
    if (selectRopDrugName.value!='' && selectRopStartDate.value!='' && selectRopEndDate.value!=''){


        if (selectRopStartDate.value>selectRopEndDate.value){
            Swal.fire({
                icon: 'error',
                title: 'Invalid Date',
                text: 'Start Date cannot be greater than End Date'
            });
            selectRopStartDate.value==''
            selectRopEndDate.value==''
        }else {

            ropDrugCountByMonth = getRoqDrugByMonth = ajaxGetReq("/getropbymonth?drugid=" + JSON.parse(selectRopDrugName.value).id + "&startdate=" + selectRopStartDate.value + "&enddate=" + selectRopEndDate.value)
            console.log(ropDrugCountByMonth)


            const displayProperty = [
                {property: 'month', datatype: 'string'},
                {property: 'itemCount', datatype: 'string'}
            ]

            //fillDataIntoTable function call
            fillDataIntoTable(ropDetailsTable, ropDrugCountByMonth, displayProperty, refillForm, deleteRecord, printRecord, false, userPrivilege);
            ropDrugTitle.innerHTML = 'Item Name : ' + JSON.parse(selectRopDrugName.value).name

            totalRopItemCount = ''
            noOfMonths = 0

            ropDrugCountByMonth.forEach(element => {
                totalRopItemCount = Number(totalRopItemCount) + Number(element.itemCount)
                noOfMonths = noOfMonths + 1;
            })
            console.log(totalRopItemCount)
            console.log(noOfMonths)
            console.log(Math.ceil(Number(totalRopItemCount) / noOfMonths))
            calculatedROPValue = Math.ceil(Number(totalRopItemCount) / noOfMonths)
            averageRopQuantity.innerHTML = Math.ceil(Number(totalRopItemCount) / noOfMonths)

            //    bar chart area
            let ropLabelArray = new Array();
            let ropDataArray = new Array();

            ropDrugCountByMonth.forEach(element => {
                ropLabelArray.push(element.month)
                ropDataArray.push(element.itemCount)
            })

            if (ropChart) {
                ropChart.destroy();
            }


            let ropChartView = document.getElementById('ropChart').getContext('2d')

            ropChart = new Chart(ropChartView, {
                type: 'bar',
                data: {
                    labels: ropLabelArray,
                    datasets: [{
                        label: 'Drug/Item Sales Count by month ' + JSON.parse(selectRopDrugName.value).name,
                        data: ropDataArray,
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

            ropUpdateBtn.disabled = false

        }
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Empty Field',
            text: 'Please select the fields'
        });

        ropUpdateBtn.disabled=true
    }

}

const printRopCompleteTable=()=>{
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
                '<head><title>table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+'</head>'+
                '<h2  class="Text-center">Item Sales By Month Details<h2>'+
                ropDetailsTable.outerHTML
                // '<script>$(".btn-display").css("display","none")</script>'+
                // '<script>$(".btn-display").hide("display","none")</script>'
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


const printRopChart=()=>{



    Swal.fire({
        title: "Are you sure to print the chart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            chartPrintRopChart.src=ropChart.toBase64Image();
            let newWindow=window.open();

            newWindow.document.write(
                '<head><title> Chart Print</title>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.row{display: flex}</style>'+
                '</head>'+
                '<h3  class="Text-center" >Item Sale By Month<h3>'+
                '<div class="row"><div class="col-3"></div><div class="col-6">'+
                chartPrintRopChart.outerHTML+'</div><div class="col-3"></div></div>'

            );

            setTimeout(
                function() {
                    newWindow.print()
                    newWindow.close()
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

// update rop
const updateROPSalesItem=()=>{

    Swal.fire({
        title: "Are you sure to update the ROP?",
        html:"Sales Item : "+JSON.parse(selectRopDrugName.value).name+"<br>ROP : "+calculatedROPValue ,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            salesdrug=ajaxGetReq("/salesdrug/getdrugbyid/"+JSON.parse(selectRopDrugName.value).id)
            console.log(salesdrug)
            salesdrug.rop=calculatedROPValue

            let   ajaxUpdateResponse=ajaxRequestBody("/salesdrug","PUT",salesdrug);
            if (ajaxUpdateResponse=="OK") {
                Swal.fire({
                    title: " Item record updated successfully!",

                    icon: "success"
                });

                ropUpdateBtn.disabled=true
            }else{
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
