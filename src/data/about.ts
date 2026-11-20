export interface AboutSection {
  heading: string
  paragraphs: string[]
}

export interface AboutText {
  lang: string
  dir: 'ltr' | 'rtl'
  sections: AboutSection[]
}

/** What the About dialog says about Avestan, in English and in Persian. */
export const ABOUT_TEXTS: AboutText[] = [
  {
    lang: 'en',
    dir: 'ltr',
    sections: [
      {
        heading: 'What is Avestan?',
        paragraphs: [
          'Avestan is an ancient Eastern Iranian language, known only from the Avesta, the collection of the sacred texts of Zoroastrianism. Together with Old Persian it is one of the two oldest recorded Iranian languages, and it is closely related to the Sanskrit of the Vedas.',
          'It survives in two stages. Old Avestan, also called Gathic, is the language of the Gathas, hymns attributed to Zarathustra himself, and of the Yasna Haptanghaiti. These were probably composed in the second half of the second millennium BCE, although their date is debated. Younger Avestan, the language of most of the Avesta, comes from the first millennium BCE.',
        ],
      },
      {
        heading: 'What has it been used for?',
        paragraphs: [
          'Avestan was spoken long before it was written down: for many centuries priests passed the texts on by heart. Its use is almost entirely religious, in the hymns, prayers, rituals and laws of Zoroastrianism. Zoroastrian priests still recite these texts in Avestan today, in ceremonies and in daily prayers such as the Ashem Vohu and the Yatha Ahu Vairyo.',
        ],
      },
      {
        heading: 'The Avestan script',
        paragraphs: [
          'The Avestan alphabet was created in the Sasanian era, around the fifth century CE, from the Pahlavi script, so that the exact pronunciation of the sacred texts could be recorded. It is written from right to left, has more than fifty letters and writes every vowel, which is rare among the scripts of the region. The oldest surviving manuscripts of the Avesta date from the 13th and 14th centuries CE.',
        ],
      },
    ],
  },
  {
    lang: 'fa',
    dir: 'rtl',
    sections: [
      {
        heading: 'زبان اوستایی چیست؟',
        paragraphs: [
          'اوستایی زبانی کهن از شاخهٔ ایرانی شرقی است که تنها از راه اوستا، مجموعهٔ متن‌های دینی زرتشتیان، به ما رسیده است. اوستایی در کنار فارسی باستان یکی از دو زبان ایرانی است که کهن‌ترین نوشته‌ها از آن‌ها به جا مانده است، و خویشاوندی نزدیکی با سنسکریتِ وداها دارد.',
          'این زبان در دو دوره به ما رسیده است. اوستایی کهن یا گاهانی، زبان گاهان (گات‌ها)، سروده‌هایی که از خود زرتشت دانسته می‌شوند، و یسنای هفت‌هات است. این متن‌ها احتمالاً در نیمهٔ دوم هزارهٔ دوم پیش از میلاد سروده شده‌اند، هرچند تاریخ آن‌ها مورد بحث است. اوستایی نو، زبان بیشتر بخش‌های اوستا، از هزارهٔ نخست پیش از میلاد است.',
        ],
      },
      {
        heading: 'این زبان چه کاربردی داشته است؟',
        paragraphs: [
          'اوستایی سده‌ها پیش از آنکه نوشته شود گفته می‌شد و موبدان متن‌های آن را سینه‌به‌سینه به نسل‌های بعد می‌سپردند. کاربرد این زبان تقریباً یکسره دینی است: در سرودها، نیایش‌ها، آیین‌ها و قانون‌های دین زرتشتی. موبدان زرتشتی امروز نیز این متن‌ها را به زبان اوستایی می‌خوانند، در آیین‌ها و در نیایش‌های روزانه‌ای مانند اَشِم وُهو و یَتا اَهو وَئیریو.',
        ],
      },
      {
        heading: 'دبیرهٔ اوستایی',
        paragraphs: [
          'دبیره یا خط اوستایی یا دین‌دبیره در دوران ساسانیان، در حدود سدهٔ پنجم میلادی، بر پایهٔ خط پهلوی ساخته شد تا تلفظ دقیق متن‌های دینی ثبت شود. این خط از راست به چپ نوشته می‌شود، بیش از پنجاه حرف دارد و همهٔ واکه‌ها را می‌نویسد، که در میان خط‌های آن منطقه کم‌مانند است. کهن‌ترین دست‌نوشته‌های بازماندهٔ اوستا از سده‌های سیزدهم و چهاردهم میلادی‌اند.',
        ],
      },
    ],
  },
]
