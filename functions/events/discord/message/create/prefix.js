const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
console.log(context.params.event.content)

const response = context.params.event.referenced_message;
if (!response) return;

const old = Date.now() - new Date(`${context.params.event.member.joined_at.replace(/T.*/,'')}`).getTime();
if (old/1000/60/60/24 < 90) return false;
const trigger = context.params.event.content.replace(/^\+\ */g, '');
console.log(trigger)
if (!trigger) return;
double = await lib.googlesheets.query['@0.3.0'].count({
  range: `A:A`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      'trigger__is': `${trigger}`
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  }
});
console.log(double.count)
if (double.count) return;

await lib.utils.kv['@0.1.16'].set({
  key: `trigger`,
  value: trigger
});
await lib.utils.kv['@0.1.16'].set({
  key: `includes`,
  value: `false` // сбрасываем на значение по умолчанию
});
await lib.utils.kv['@0.1.16'].set({
  key: `ignoreCase`,
  value: `true` // сбрасываем на значение по умолчанию
});

await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: response.content,
  embed: response.embeds[0],
  // attacment: // не прикрепляет..
  /* message_reference: {
    message_id: context.params.event.id
  }, */ // не отвечать. Просто писать в тот же канал
  tts: false,
  components: [
    {
      "type": 1,
      "components": [
        {
          "custom_id": `ignoreCase`,
          "options": [
            {
              "label": `Игнорировать регистр`,
              "value": `true`,
              "default": true
            },
            {
              "label": `Учитывать регистр`,
              "value": `false`,
              "default": false
            }
          ],
          "min_values": 1,
          "max_values": 1,
          "type": 3
        }
      ]
    },
    {
      "type": 1,
      "components": [
        {
          "custom_id": `includes`,
          "options": [
            {
              "label": `Включительно`,
              "value": `true`,
              "description": `Сообщение должно содержать тригер`,
              "default": false
            },
            {
              "label": `Полное совпадение`,
              "value": `false`,
              "description": `Сообщение должно совпадать с тригером`,
              "default": true
            }
          ],
          "min_values": 1,
          "max_values": 1,
          "type": 3
        }
      ]
    },
    {
      "type": 1,
      "components": [
        {
          "style": 1,
          "label": `Добавить триггер "${trigger}"`,
          "custom_id": `add`,
          "disabled": false,
          "type": 2
        }
      ]
    }
  ]
})

await lib.discord.channels['@0.0.6'].messages.destroy({
  channel_id: context.params.event.channel_id,
  message_id: context.params.event.id
});