const fs = require('fs');
const path = require('path');

const photosDir = path.join(__dirname, 'assets/photo-presentation');
const outputFile = path.join(photosDir, 'photos.json');

// Список допустимых расширений изображений
const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];

fs.readdir(photosDir, (err, files) => {
  if (err) {
    console.error('Ошибка чтения папки:', err);
    process.exit(1);
  }
  // Фильтруем только изображения
  const photoFiles = files.filter(f => allowedExt.includes(path.extname(f).toLowerCase()));
  // Сортируем по номеру, если имя начинается с числа
  photoFiles.sort((a, b) => {
    const aNum = parseInt(a);
    const bNum = parseInt(b);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a.localeCompare(b, 'ru');
  });
  fs.writeFileSync(outputFile, JSON.stringify(photoFiles, null, 2), 'utf8');
  console.log('Файл photos.json успешно обновлён!');
}); 