function toastScript(str) {
  return `var Toast=Swal.mixin({toast:!0,position:"top-start",showConfirmButton:!1,timer:1500,timerProgressBar:!0,didOpen(e){e.addEventListener("mouseenter",Swal.stopTimer),e.addEventListener("mouseleave",Swal.resumeTimer)}});Toast.fire({icon:"success",title:${str}});`;
}

export { toastScript };
