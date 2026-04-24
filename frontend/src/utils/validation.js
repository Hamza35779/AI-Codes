export function isValidPakistaniPhone(phone) {
  // Pakistani phone formats: +92XXXXXXXXX, 03XXXXXXXXX, 0XX-XXXXXXX
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const pakistaniPhoneRegex = /^(\+92|0092)?[0-9]{3}[0-9]{7}$/;
  return pakistaniPhoneRegex.test(cleaned);
}

export function formatPakistaniPhone(phone) {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('+92')) {
    return cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+92' + cleaned.substring(1);
  }
  return cleaned;
}

export function isValidNTN(ntn) {
  // NTN format: 1234567-8 or 1234567-8-9
  const ntnRegex = /^[0-9]{7}-[0-9]{1}(-[0-9]{1})?$/;
  return !ntn || ntnRegex.test(ntn);
}

export function isValidGST(gst) {
  // GST format: 1234567-8-9
  const gstRegex = /^[0-9]{7}-[0-9]{1}-[0-9]{1}$/;
  return !gst || gstRegex.test(gst);
}
