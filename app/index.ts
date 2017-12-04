import './css/common.scss';
import './index.scss';

// if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
if (/android/i.test(navigator.userAgent.toLowerCase())) {
  window.location.href = "http://www.moni0.com/app/download";
}