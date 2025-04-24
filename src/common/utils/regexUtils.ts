// ----------------------------------- REGEX JUST NUMBERS -----------------------------------
export const REGEX_ONLY_DIGITS = '^\\d+$';

// ----------------------------------- PASSWORD REQUIREMENTS -----------------------------------
export const passwordRequirements = [
  { regex: /[A-Z]/, message: 'Pelo menos uma letra maiúscula' },
  { regex: /\d/, message: 'Pelo menos um número' },
  { regex: /[^A-Za-z0-9]/, message: 'Pelo menos um caractere especial' },
  { regex: /.{9,}/, message: 'Mínimo de 9 caracteres' },
];

// ----------------------------------- PARSE NUMBER -----------------------------------
export const parseNumber = (value: string | number): number => {
  if (typeof value === 'number') return Math.abs(value);

  // Remove tudo que não seja dígito, vírgula, ponto ou sinal de menos
  let cleaned = value.replace(/[^0-9,.-]+/g, '');

  // Remove todos os sinais de menos (independente da posição)
  cleaned = cleaned.replace(/-/g, '');

  // Se houver vírgula, presumimos que seja separador decimal (formato brasileiro)
  if (cleaned.indexOf(',') > -1) {
    // Remove pontos que possam ser separadores de milhar
    // e substitui a vírgula pelo ponto decimal
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  }

  // Converte para número e garante que seja positivo
  return Number(cleaned);
};
