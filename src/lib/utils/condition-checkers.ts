export function isContactInfoCompleteChecker({ email, phone }: { email: string; phone: string }) {
  const isContactInfoComplete = email && phone;
  if (!isContactInfoComplete) {
    return false;
  }
  return true;
}
