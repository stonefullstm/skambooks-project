import Swal from 'sweetalert2';

export const showAlert = (status, message) => {
  Swal.fire({
    title: status,
    text: message,
    icon: 'error',
    confirmButtonText: 'OK'
  });
};

export const showAlertSucces = (status, message) => {
  Swal.fire({
    title: status,
    text: message,
    icon: 'success',
    confirmButtonText: 'OK'
  });
};

export const  showAlertConfirm = async (id, handleExcluir) => {
  Swal.fire({
    title: 'Are you sure?',
    text: `Are you sure you want to delete the id ${id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      handleExcluir(id);
    }
  });
};

export const  showAlertSwitch= async (id, handleSwitch) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Want to make the switch?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, switch it!'
  }).then((result) => {
    if (result.isConfirmed) {
      handleSwitch(id);
    }
  });
};
