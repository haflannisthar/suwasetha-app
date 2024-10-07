const logoutconfirm=()=>{
    Swal.fire({
        title: "Are you sure to logout",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            // window.location.href = "http://localhost:8080/logout";
            const form = document.createElement("form");
            form.method = "POST";
            form.action = "/logout";
            document.body.appendChild(form);
            form.submit();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    });
}
