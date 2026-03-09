import toastr from 'toastr';
toastr.options =
{
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-left",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
export const toastsuccess = (text) => {
    toastr.options.positionClass = "toast-top-right";
    toastr.success(text);
}


export const toastdanger = (text) => {
    toastr.options.positionClass = "toast-top-right";
    toastr.error(text);
}

export const toastloading = (text) => {
    toastr.options.positionClass = "toast-top-left";
    toastr.loading(text);
}

