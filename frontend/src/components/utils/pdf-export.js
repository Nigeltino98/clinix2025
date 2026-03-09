export const print = () => {
    let printContents = document.getElementsByClassName("rdt_Table")[0].innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}

