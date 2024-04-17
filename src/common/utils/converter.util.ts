import { OptionsSlug } from '../interfaces/options-slug.interface';
import { genRandomChar } from './generator.util';

export const removeAccent = (str) => {
  return str
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd');
};

export const formatSlug = (name: string, options: OptionsSlug) => {
  const nameWithoutAccent = removeAccent(name);
  const slug = `${
    nameWithoutAccent.includes(' ')
      ? `${nameWithoutAccent.trim().split(' ').join('-')}`
      : nameWithoutAccent
  }`;
  if (options) {
    const regex = /^[a-zA-Z0-9!@#$%^&*_+;':"\\|,.<>\/?]+$/;
    let randomStr = Array.from({ length: 5 }, genRandomChar).join('');
    while (!regex.test(randomStr)) {
      randomStr = Array.from({ length: 5 }, genRandomChar).join('');
    }
    const date = new Date();
    return `${slug}-${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}-${
      options.isEdit ? options.oldSlug.slice(-5) : randomStr
    }`;
  }
  return slug;
};
