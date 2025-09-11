export function isContactInfoCompleteChecker({ email, phone }: { email: string; phone: string }): boolean {
  if (email.trim() === '' || phone.trim() === '') {
    return false;
  }
  return true;
}
