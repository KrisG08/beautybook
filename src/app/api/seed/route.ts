import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

const plovdivBusinesses = [
  // HAIR
  { name: 'Салон Имидж', contactPerson: 'Мария Иванова', email: 'image@salon.bg', phone: '+359885123401', address: 'ул. "Княз Александър Батенберг" 15, Пловдив', description: 'Професионален салон за фризьорство и стилизиране с над 15 години опит.', category: 'hair', rating: 4.7, reviewCount: 128 },
  { name: 'Keys Hair Studio', contactPerson: 'Екипът на Keys', email: 'info@keys-hair.bg', phone: '+359885123402', address: 'бул. "Васил Априлов" 42, Пловдив', description: 'Модерно студио за коса с най-новите техники за боядисване и подстригване.', category: 'hair', rating: 4.9, reviewCount: 215 },
  { name: 'Салон Елеганс', contactPerson: 'Силвия Петрова', email: 'elegance@abv.bg', phone: '+359885123403', address: 'ул. "Антим І" 8, Пловдив', description: 'Елегантен салон за дами и господа с класически и модерни прически.', category: 'hair', rating: 4.5, reviewCount: 89 },
  { name: 'Barber Shop 19', contactPerson: 'Георги Димитров', email: 'barber19@abv.bg', phone: '+359885123404', address: 'ул. "Заводска" 19, Пловдив', description: 'Мъжки фризьорски салон с традиционни и модерни стилове.', category: 'hair', rating: 4.8, reviewCount: 156 },
  { name: 'Салон Златка', contactPerson: 'Златка Недялкова', email: 'zl@salon.bg', phone: '+359885123405', address: 'бул. "Санкт Петербург" 56, Пловдив', description: 'Семеен салон с персонализиран подход към всеки клиент.', category: 'hair', rating: 4.6, reviewCount: 72 },
  { name: 'Hair & Beauty Center', contactPerson: 'Антония Дончева', email: 'hbc@abv.bg', phone: '+359885123406', address: 'ул. "Раковска" 34, Пловдив', description: 'Комплексен център за красота с всички видове услуги за коса.', category: 'hair', rating: 4.7, reviewCount: 143 },
  { name: 'Виктория Студио', contactPerson: 'Виктория Колева', email: 'viktoria@studio.bg', phone: '+359885123407', address: 'бул. "Източен" 28, Пловдив', description: 'Студио за модерни прически и професионални консултации.', category: 'hair', rating: 4.4, reviewCount: 67 },
  { name: 'Салон Стильо', contactPerson: 'Илиян Стоянов', email: 'style@abv.bg', phone: '+359885123408', address: 'ул. "Патриарх Евтимий" 22, Пловдив', description: 'Стилен салон с фокус върху модерните тенденции в прическите.', category: 'hair', rating: 4.8, reviewCount: 189 },
  { name: 'Блясък & Ко', contactPerson: 'Марин Маринов', email: 'blqsk@abv.bg', phone: '+359885123409', address: 'бул. "Ручей" 67, Пловдив', description: 'Салон за блясък и креативни прически за младежи.', category: 'hair', rating: 4.5, reviewCount: 95 },
  { name: 'Екип Красота', contactPerson: 'Таня Иванова', email: 'team@beauty.bg', phone: '+359885123410', address: 'ул. "Дунав" 45, Пловдив', description: 'Професионален екип с индивидуален подход към всяка прическа.', category: 'hair', rating: 4.6, reviewCount: 112 },
  // NAILS
  { name: 'Nail Art Studio Plovdiv', contactPerson: 'Даниела Костова', email: 'nailart@abv.bg', phone: '+359885123411', address: 'ул. "Гладстон" 12, Пловдив', description: 'Студио за ноктопластика с над 100 дизайна и модерни техники.', category: 'nails', rating: 4.9, reviewCount: 234 },
  { name: 'Лючия Нейлс', contactPerson: 'Людмила Гочева', email: 'lucia@nails.bg', phone: '+359885123412', address: 'бул. "Марица" 89, Пловдив', description: 'Специализирано студио за гел и акрил нокти.', category: 'nails', rating: 4.8, reviewCount: 178 },
  { name: 'Брилянт Нокти', contactPerson: 'Петя Стоянова', email: 'bril@abv.bg', phone: '+359885123413', address: 'ул. "Антим І" 25, Пловдив', description: 'Професионален маникюр и педикюр с качествени материали.', category: 'nails', rating: 4.7, reviewCount: 145 },
  { name: 'Nails & Beauty', contactPerson: 'Гергана Иванова', email: 'nbeauty@abv.bg', phone: '+359885123414', address: 'бул. "Васил Априлов" 31, Пловдив', description: 'Комплексни услуги за нокти и красота.', category: 'nails', rating: 4.6, reviewCount: 98 },
  { name: 'Виктория Нейл Студио', contactPerson: 'Виктория Петрова', email: 'vnail@studio.bg', phone: '+359885123415', address: 'ул. "Княз Александър" 8, Пловдив', description: 'Студио за класически и модерен маникюр.', category: 'nails', rating: 4.8, reviewCount: 167 },
  { name: 'Сребърен Нокът', contactPerson: 'Симеонка Димова', email: 'srebr@abv.bg', phone: '+359885123416', address: 'бул. "Източен" 52, Пловдив', description: 'Качествени услуги за маникюр и педикюр.', category: 'nails', rating: 4.5, reviewCount: 76 },
  { name: 'Mimo Nails', contactPerson: 'Милена Ангелова', email: 'mimo@nails.bg', phone: '+359885123417', address: 'ул. "Раковска" 18, Пловдив', description: 'Модерно студио с креативни дизайни и техники.', category: 'nails', rating: 4.9, reviewCount: 212 },
  { name: 'Професионален Маникюр', contactPerson: 'Даниела Генова', email: 'pman@abv.bg', phone: '+359885123418', address: 'бул. "Санкт Петербург" 73, Пловдив', description: 'Професионален маникюр с хипоалергенни материали.', category: 'nails', rating: 4.6, reviewCount: 89 },
  { name: 'GLAMOUR Nails', contactPerson: 'Галя Николова', email: 'glamour@abv.bg', phone: '+359885123419', address: 'ул. "Заводска" 5, Пловдив', description: 'Glamour студио за нокти с най-новите тенденции.', category: 'nails', rating: 4.7, reviewCount: 134 },
  { name: 'Nail Express', contactPerson: 'Радостина Христова', email: 'nexpress@abv.bg', phone: '+359885123420', address: 'бул. "Ручей" 34, Пловдив', description: 'Бърз и качествен маникюр за хора в движение.', category: 'nails', rating: 4.4, reviewCount: 65 },
  // SKIN
  { name: 'Клиника Естет', contactPerson: 'Д-р Мария Иванова', email: 'estet@clinic.bg', phone: '+359885123421', address: 'бул. "Васил Априлов" 56, Пловдив', description: 'Медицинска козметика и anti-aging процедури.', category: 'skin', rating: 4.9, reviewCount: 267 },
  { name: 'Студио Лице', contactPerson: 'Ива Иванова', email: 'lice@studio.bg', phone: '+359885123422', address: 'ул. "Княз Александър" 33, Пловдив', description: 'Професионални козметични процедури за лице и тяло.', category: 'skin', rating: 4.7, reviewCount: 156 },
  { name: 'EA Esthetic', contactPerson: 'Елена Атанасова', email: 'ea@estetic.bg', phone: '+359885123423', address: 'бул. "Марица" 78, Пловдив', description: 'Естетично студио с модерни технологии и продукти.', category: 'skin', rating: 4.8, reviewCount: 198 },
  { name: 'Салон Свежест', contactPerson: 'Снежана Петрова', email: 'svezhest@abv.bg', phone: '+359885123424', address: 'ул. "Гладстон" 9, Пловдив', description: 'Почистване, подхранване и подмладяване на кожата.', category: 'skin', rating: 4.6, reviewCount: 87 },
  { name: 'Beauty Skin Center', contactPerson: 'Анна Недялкова', email: 'bskin@abv.bg', phone: '+359885123425', address: 'бул. "Източен" 41, Пловдив', description: 'Център за козметични процедури и терапии.', category: 'skin', rating: 4.7, reviewCount: 143 },
  { name: 'Лазер Естетик', contactPerson: 'Д-р Росен Георгиев', email: 'laser@abv.bg', phone: '+359885123426', address: 'ул. "Антим І" 17, Пловдив', description: 'Лазерна епилация и козметични процедури.', category: 'skin', rating: 4.8, reviewCount: 189 },
  { name: 'Красота & Здраве', contactPerson: 'Марияна Димитрова', email: 'kras@abv.bg', phone: '+359885123427', address: 'бул. "Санкт Петербург" 62, Пловдив', description: 'Холистичен подход към красотата и здравето.', category: 'skin', rating: 4.5, reviewCount: 78 },
  { name: 'Dermal Care', contactPerson: 'Десислава Тодорова', email: 'dermal@care.bg', phone: '+359885123428', address: 'ул. "Раковска" 42, Пловдив', description: 'Дерматологични консултации и процедури.', category: 'skin', rating: 4.9, reviewCount: 234 },
  { name: 'Студио Блясък', contactPerson: 'Надежда Колева', email: 'blsqk@studio.bg', phone: '+359885123429', address: 'бул. "Ручей" 89, Пловдив', description: 'Висококачествени козметични услуги и продукти.', category: 'skin', rating: 4.6, reviewCount: 112 },
  { name: 'Perfect Skin Plovdiv', contactPerson: 'Петя Налбантова', email: 'perfect@skin.bg', phone: '+359885123430', address: 'ул. "Заводска" 28, Пловдив', description: 'Персонализирани козметични програми за всеки тип кожа.', category: 'skin', rating: 4.7, reviewCount: 145 },
  // MASSAGE
  { name: 'Spa Център Релакс', contactPerson: 'Мирослав Иванов', email: 'relax@spa.bg', phone: '+359885123431', address: 'бул. "Васил Априлов" 65, Пловдив', description: 'Spa и релакс център с масажи от класа.', category: 'massage', rating: 4.9, reviewCount: 312 },
  { name: 'Масажно Студио Здраве', contactPerson: 'Пламен Попов', email: 'zdrave@abv.bg', phone: '+359885123432', address: 'ул. "Княз Александър" 21, Пловдив', description: 'Лечебни и релаксиращи масажи.', category: 'massage', rating: 4.8, reviewCount: 198 },
  { name: 'Wellness Center Plovdiv', contactPerson: 'Антонина Белчева', email: 'wellness@bg', phone: '+359885123433', address: 'бул. "Марица" 92, Пловдив', description: 'Уелнес център с пълен набор от масажи.', category: 'massage', rating: 4.9, reviewCount: 256 },
  { name: 'Спортен Масаж Пловдив', contactPerson: 'Стефан Стоянов', email: 'sport@massage.bg', phone: '+359885123434', address: 'ул. "Антим І" 14, Пловдив', description: 'Спортен масаж за активни хора и спортисти.', category: 'massage', rating: 4.7, reviewCount: 134 },
  { name: 'Традиционна Масажна', contactPerson: 'Иванка Димова', email: 'tradicia@abv.bg', phone: '+359885123435', address: 'бул. "Източен" 37, Пловдив', description: 'Традиционни техники за релаксация и лечение.', category: 'massage', rating: 4.6, reviewCount: 89 },
  { name: 'Thai Massage Plovdiv', contactPerson: 'Нанучай Сукчаап', email: 'thai@plovdiv.bg', phone: '+359885123436', address: 'ул. "Гладстон" 26, Пловдив', description: 'Автентичен тайландски масаж и ароматерапия.', category: 'massage', rating: 4.8, reviewCount: 178 },
  { name: 'Масаж & Релакс', contactPerson: 'Даниела Стоянова', email: 'mrelax@abv.bg', phone: '+359885123437', address: 'бул. "Санкт Петербург" 48, Пловдив', description: 'Комплексни релакс услуги за тяло и дух.', category: 'massage', rating: 4.7, reviewCount: 145 },
  { name: 'Hot Stone Therapy', contactPerson: 'Галина Петрова', email: 'hotstone@abv.bg', phone: '+359885123438', address: 'ул. "Раковска" 55, Пловдив', description: 'Масаж с горещи камъни и терапии.', category: 'massage', rating: 4.8, reviewCount: 167 },
  { name: 'Body & Soul Massage', contactPerson: 'Елена Колева', email: 'body@abv.bg', phone: '+359885123439', address: 'бул. "Ручей" 72, Пловдив', description: 'Хармония между тяло и душа чрез масаж.', category: 'massage', rating: 4.6, reviewCount: 98 },
  { name: 'Професионален Масаж', contactPerson: 'Росен Иванов', email: 'profi@massage.bg', phone: '+359885123440', address: 'ул. "Заводска" 38, Пловдив', description: 'Професионални масажни техники за различни нужди.', category: 'massage', rating: 4.5, reviewCount: 76 },
  // MAKEUP
  { name: 'Glamour Makeup Studio', contactPerson: 'Милена Ангелова', email: 'glamour@makeup.bg', phone: '+359885123441', address: 'бул. "Васил Априлов" 38, Пловдив', description: 'Професионален грим за всякакви поводи.', category: 'makeup', rating: 4.9, reviewCount: 245 },
  { name: 'Виктория_makeup', contactPerson: 'Виктория Иванова', email: 'viktoria@makeup.bg', phone: '+359885123442', address: 'ул. "Княз Александър" 17, Пловдив', description: 'Сватбен и евентуален грим от експерт.', category: 'makeup', rating: 4.8, reviewCount: 189 },
  { name: 'Beauty Art Makeup', contactPerson: 'Анна Бойчева', email: 'bart@makeup.bg', phone: '+359885123443', address: 'бул. "Марица" 68, Пловдив', description: 'Артистичен грим и специални ефекти.', category: 'makeup', rating: 4.7, reviewCount: 156 },
  { name: 'Студио Грим', contactPerson: 'Даниела Николова', email: 'grim@studio.bg', phone: '+359885123444', address: 'ул. "Антим І" 11, Пловдив', description: 'Професионален грим за всеки вкус.', category: 'makeup', rating: 4.8, reviewCount: 178 },
  { name: 'Makeup Pro Plovdiv', contactPerson: 'Петя Генова', email: 'mpro@abv.bg', phone: '+359885123445', address: 'бул. "Източен" 29, Пловдив', description: 'Професионален грим с качествени продукти.', category: 'makeup', rating: 4.6, reviewCount: 112 },
  { name: 'Bridal Makeup Studio', contactPerson: 'Силвия Каменова', email: 'bridal@makeup.bg', phone: '+359885123446', address: 'ул. "Гладстон" 21, Пловдив', description: 'Специализиран свадебен грим и прическа.', category: 'makeup', rating: 4.9, reviewCount: 234 },
  { name: 'LOOK Studio', contactPerson: 'Люба Колева', email: 'look@studio.bg', phone: '+359885123447', address: 'бул. "Санкт Петербург" 57, Пловдив', description: 'Модерни визии и професионален грим.', category: 'makeup', rating: 4.7, reviewCount: 145 },
  { name: 'Валя Грим', contactPerson: 'Валентина Димова', email: 'valya@abv.bg', phone: '+359885123448', address: 'ул. "Раковска" 31, Пловдив', description: 'Дневен и вечерен грим за всеки повод.', category: 'makeup', rating: 4.5, reviewCount: 89 },
  { name: 'Perfect Look Makeup', contactPerson: 'Гергана Стоянова', email: 'perfect@makeup.bg', phone: '+359885123449', address: 'бул. "Ручей" 46, Пловдив', description: 'Перфектни визии за специални моменти.', category: 'makeup', rating: 4.8, reviewCount: 167 },
  { name: 'Elite Makeup Art', contactPerson: 'Елица Петрова', email: 'elite@makeup.bg', phone: '+359885123450', address: 'ул. "Заводска" 14, Пловдив', description: 'Елитен грим с най-новите техники.', category: 'makeup', rating: 4.7, reviewCount: 134 },
  // BROWS
  { name: 'Brow Studio Plovdiv', contactPerson: 'Радостина Гаджалова', email: 'brow@studio.bg', phone: '+359885123451', address: 'бул. "Васил Априлов" 29, Пловдив', description: 'Специализирано студио за вежди и ламиниране.', category: 'brows', rating: 4.9, reviewCount: 198 },
  { name: 'Eye Brow Art', contactPerson: 'Мария Дойчинова', email: 'eyebrow@abv.bg', phone: '+359885123452', address: 'ул. "Княз Александър" 25, Пловдив', description: 'Изкуството на перфектните вежди.', category: 'brows', rating: 4.8, reviewCount: 156 },
  { name: 'Perfect Brows', contactPerson: 'Десислава Недялкова', email: 'perfbro@abv.bg', phone: '+359885123453', address: 'бул. "Марица" 84, Пловдив', description: 'Перфектни вежди с различни техники.', category: 'brows', rating: 4.7, reviewCount: 134 },
  { name: 'Brow & Lash Pro', contactPerson: 'Елена Иванова', email: 'browpro@abv.bg', phone: '+359885123454', address: 'ул. "Антим І" 19, Пловдив', description: 'Вежди и мигли от професионалисти.', category: 'brows', rating: 4.8, reviewCount: 178 },
  { name: 'Студио Вежди', contactPerson: 'Таня Христова', email: 'vezhdi@studio.bg', phone: '+359885123455', address: 'бул. "Източен" 44, Пловдив', description: 'Всичко за вашите вежди на едно място.', category: 'brows', rating: 4.6, reviewCount: 98 },
  { name: 'Lash & Brow Expert', contactPerson: 'Нели Петрова', email: 'expert@abv.bg', phone: '+359885123456', address: 'ул. "Гладстон" 16, Пловдив', description: 'Експертни услуги за вежди и мигли.', category: 'brows', rating: 4.9, reviewCount: 212 },
  { name: 'Микроблейдинг Пловдив', contactPerson: 'Анна Стоянова', email: 'micro@abv.bg', phone: '+359885123457', address: 'бул. "Санкт Петербург" 61, Пловдив', description: 'Микроблейдинг и перманентен грим на вежди.', category: 'brows', rating: 4.8, reviewCount: 167 },
  { name: 'Brow Factory', contactPerson: 'Галина Колева', email: 'factory@abv.bg', phone: '+359885123458', address: 'ул. "Раковска" 27, Пловдив', description: 'Фабрика за перфектни вежди.', category: 'brows', rating: 4.7, reviewCount: 145 },
  { name: 'Идеални Вежди', contactPerson: 'Петя Димитрова', email: 'ideal@abv.bg', phone: '+359885123459', address: 'бул. "Ручей" 53, Пловдив', description: 'Идеални вежди за всяка форма на лице.', category: 'brows', rating: 4.6, reviewCount: 89 },
  { name: 'Brow Care Center', contactPerson: 'Ивана Налбантова', email: 'care@abv.bg', phone: '+359885123460', address: 'ул. "Заводска" 22, Пловдив', description: 'Център за грижа за вежди и мигли.', category: 'brows', rating: 4.7, reviewCount: 123 },
];

const servicesData: Record<string, { name: string; subtype: string; price: number; duration: number }[]> = {
  hair: [
    { name: 'Мъжко подстригване', subtype: 'cut', price: 25, duration: 30 },
    { name: 'Дамско подстригване', subtype: 'cut', price: 35, duration: 45 },
    { name: 'Боядисване на коса', subtype: 'color', price: 80, duration: 120 },
    { name: 'Осветяване', subtype: 'highlights', price: 100, duration: 150 },
    { name: 'Балиаж', subtype: 'balayage', price: 120, duration: 180 },
    { name: 'Кератиново третиране', subtype: 'treatment', price: 90, duration: 120 },
  ],
  nails: [
    { name: 'Класически маникюр', subtype: 'manicure', price: 25, duration: 30 },
    { name: 'Гел маникюр', subtype: 'gel', price: 45, duration: 60 },
    { name: 'Акрил нокти', subtype: 'acrylic', price: 55, duration: 90 },
    { name: 'Педикюр', subtype: 'pedicure', price: 35, duration: 45 },
    { name: 'SPA педикюр', subtype: 'spa', price: 50, duration: 60 },
    { name: 'Гел лак', subtype: 'shellac', price: 40, duration: 45 },
  ],
  skin: [
    { name: 'Почистване на лице', subtype: 'cleaning', price: 40, duration: 45 },
    { name: 'Хидратиращо третиране', subtype: 'hydrating', price: 55, duration: 60 },
    { name: 'Анти-ейдж третиране', subtype: 'anti-aging', price: 70, duration: 75 },
    { name: 'Микродермабразио', subtype: 'microderm', price: 65, duration: 60 },
    { name: 'Химически пилинг', subtype: 'peeling', price: 60, duration: 45 },
    { name: 'Лазерна епилация', subtype: 'laser', price: 80, duration: 60 },
  ],
  massage: [
    { name: 'Релаксиращ масаж', subtype: 'relax', price: 60, duration: 60 },
    { name: 'Спортен масаж', subtype: 'sport', price: 80, duration: 60 },
    { name: 'Лечебен масаж', subtype: 'therapeutic', price: 70, duration: 45 },
    { name: 'Шведски масаж', subtype: 'swedish', price: 65, duration: 60 },
    { name: 'Масаж с горени камъни', subtype: 'hotstone', price: 85, duration: 75 },
    { name: 'Тайландски масаж', subtype: 'thai', price: 90, duration: 90 },
  ],
  makeup: [
    { name: 'Дневен грим', subtype: 'day', price: 50, duration: 45 },
    { name: 'Вечерен грим', subtype: 'evening', price: 70, duration: 60 },
    { name: 'Свадебен грим', subtype: 'bridal', price: 150, duration: 120 },
    { name: 'Грим за фотосесия', subtype: 'photo', price: 80, duration: 60 },
    { name: 'Консултация за грим', subtype: 'consult', price: 40, duration: 30 },
    { name: 'Прическа + грим', subtype: 'combo', price: 100, duration: 90 },
  ],
  brows: [
    { name: 'Оформяне на вежди', subtype: 'shaping', price: 20, duration: 20 },
    { name: 'Ламиниране на вежди', subtype: 'lamination', price: 60, duration: 60 },
    { name: 'Микроблейдинг', subtype: 'microblade', price: 250, duration: 120 },
    { name: 'Ботокс за вежди', subtype: 'botox', price: 80, duration: 45 },
    { name: 'Боядисване на вежди', subtype: 'color', price: 25, duration: 25 },
    { name: 'Миглопластика', subtype: 'lashes', price: 70, duration: 60 },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();
    
    if (secret !== 'plovdiv-seed-2024') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const results: string[] = [];

    for (const businessData of plovdivBusinesses) {
      const existingBusiness = await prisma.business.findFirst({
        where: { name: businessData.name }
      });

      if (!existingBusiness) {
        const user = await prisma.user.create({
          data: {
            name: businessData.contactPerson,
            email: businessData.email,
            password: 'password123',
            phone: businessData.phone,
            role: 'business',
          }
        });

        const business = await prisma.business.create({
          data: {
            name: businessData.name,
            contactPerson: businessData.contactPerson,
            email: businessData.email,
            phone: businessData.phone,
            address: businessData.address,
            description: businessData.description,
            category: businessData.category,
            status: 'approved',
            rating: businessData.rating,
            reviewCount: businessData.reviewCount,
            commission: 10,
            userId: user.id,
          }
        });

        const categoryServices = servicesData[businessData.category] || [];
        const shuffled = categoryServices.sort(() => 0.5 - Math.random()).slice(0, 6);

        for (const svc of shuffled) {
          await prisma.service.create({
            data: {
              name: svc.name,
              price: svc.price,
              duration: svc.duration,
              businessId: business.id,
            }
          });
        }

        results.push(`Created: ${business.name} (${business.category})`);
      }
    }

    return NextResponse.json({ 
      message: 'Seeding completed!', 
      results 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      error: 'Seeding failed', 
      details: String(error) 
    }, { status: 500 });
  }
}