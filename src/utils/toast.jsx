import { toast } from 'react-toastify';

const showToast = (type, message) => {
  const options = {
    position: "top-left",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'info':
      toast.info(message, options);
      break;
    case 'warning':
      toast.warn(message, options);
      break;
    default:
      toast(message, options);
  }
};

export default showToast;
