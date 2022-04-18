const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

trigger = await lib.utils.kv['@0.1.16'].get({
  key: `trigger`
});
includes = await lib.utils.kv['@0.1.16'].get({
  key: `includes`,
  defaultValue: `false`
});
ignoreCase = await lib.utils.kv['@0.1.16'].get({
  key: `ignoreCase`,
  defaultValue: `true`
});
content = context.params.event.message.content
embed = context.params.event.message.embeds[0]
attachment = context.params.event.message.attachments[0]

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

if (!double.count) 
  await lib.googlesheets.query['@0.3.0'].insert({
    range: `A:G`,
    fieldsets: [
      {
        'trigger': trigger,
        'ignoreCase': ignoreCase,
        'includes': includes,
        'content': content,
        'embed': JSON.stringify(embed),
        'attachment': JSON.stringify(attachment),
        'note': `Добавил ${context.params.event.member.user.username}`
      }
    ]
  });

await lib.discord.channels['@0.0.6'].messages.destroy({
  channel_id: context.params.event.channel_id,
  message_id: context.params.event.message.id
});
