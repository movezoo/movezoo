const beforeUnloadHandler = (event) => {
  event.preventDefault();
  event.returnValue = '';
}

const enablePageLeaveWarning = () => {
  window.addEventListener('beforeunload', beforeUnloadHandler);
}

const disablePageLeaveWarning = () => {
  window.removeEventListener('beforeunload', beforeUnloadHandler);
}

export { enablePageLeaveWarning, disablePageLeaveWarning }