import { toast } from 'material-react-toastify'
import Success from './Success'
import { isMobile } from 'utils/utils'

const ToastPosition = isMobile()
  ? toast.POSITION.BOTTOM_CENTER
  : toast.POSITION.TOP_RIGHT
const success = (message) => {
  toast.dismiss()
  toast.success(<Success label={message} />, {
    position: ToastPosition,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: false,
  })
}

export default {
  success,
}
