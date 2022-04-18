const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.2.0'].messages.create({
  "channel_id": `916302784150786088`,
  "content": `Сообщение над ембедом. Ссылка: google.com ? https://google.com ?\nПеренос строки. :plus: Может и смайлы можно. Хз как.`,
  "tts": true,
  "components": [
    {
      "type": 1,
      "components": [
        {
          "style": 1,
          "label": `Теперь поехали по кнопкам.`,
          "custom_id": `id кнопки1`,
          "disabled": false,
          "type": 2
        }
      ]
    },
    {
      "type": 1,
      "components": [
        {
          "style": 5,
          "label": `Кнопка на второй строке.`,
          "url": `http://google.com`,
          "disabled": false,
          "type": 2
        }
      ]
    }
  ],
  "embeds": [
    {
      "type": "rich",
      "title": `Заголовок ембеда. Сюда, под заголовок можно сувать ссылку. `,
      "description": `Описание ембеда\nМожно многа строк`,
      "color": 0x896f6f,
      "fields": [
        {
          "name": `Название какого-то поля`,
          "value": `Значение этого поля. Это поле с многострочной настройкой. Судя по всему, это значит, что переносы будут происходить по словам. Хотя, не факт...`
        },
        {
          "name": `ещё одно поле`,
          "value": `Вообще таких полей может быть много. И да, \nэто поле с однострочной настройкой. Переносы будут по буквам? Короче не знаю на что эта настройка влияет.`,
          "inline": true
        },
        {
          "name": `Ссылка?`,
          "value": `google.com ? https://google.com ?`,
          "inline": true
        }
      ],
      "timestamp": `2001-01-31T22:00:00.000Z`,
      "image": {
        "url": `https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png`,
        "proxy_url": `https://lh3.googleusercontent.com/ogw/ADea4I7mFKBnYy3xFPin9qON3pBBjcW2579nIekIWIiiwg=s32-c-mo`,
        "height": 11,
        "width": 22
      },
      "thumbnail": {
        "url": `https://habrastorage.org/getpro/habr/widget/9ad/ddb/757/9adddb757988b632d13dfe0916c920da.png`,
        "height": 0,
        "width": 0
      },
      "author": {
        "name": `Имя автора ембеда`,
        "url": `https://autorURL.com`,
        "icon_url": `https://habrastorage.org/getpro/habr/widget/e12/28e/7f1/e1228e7f11865e9e73aeeb89a805f1f2.jpg`
      },
      "footer": {
        "text": `Это подвал!`,
        "proxy_icon_url": `https://effect.habr.com/s/RymemqStWEszhC-OAhvJuw.0wyuTSvd07LPMFFbO-mP14AiLKHwHuZ4r8MaeMvMWoPY_foVv5F8bnSvoioivPeWAW0_JX-S12a_iYkO7c1XfYHM-aHjuGHpTO3gmc60N6JYd5XBF_SFBCvAFb5xsGLegOPy4i88eeikuUhgPdntMKj8LO7G-o-PJcnyIavO2k_CECjj3QgRgLKxHctqzRIAJAbC_4-S6f7WnBCY6WB0Yg`
      },
      "url": `https://embedURL.com`
    }
  ]
});