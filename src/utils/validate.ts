const urlRegex = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

function validateUrl(url?: string): boolean {
  return !url ? false : urlRegex.test(url);
}

function validateEmail(email: string): boolean {
  return !email ? false : emailRegex.test(email);
}

export { validateEmail, validateUrl };
