const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const start = new Date().getTime();

const channelId = context.params.event.channel_id;
const messageId = context.params.event.id;
message = context.params.event.content;


//отстань-блок
const refMes = context.params.event.referenced_message;
const idOfThisBot = '901435566405599264';
if (refMes && refMes.author.id == idOfThisBot && (message == 'отстань' || message == 'отбой')) {
  const joindedAt = new Date(context.params.event.member.joined_at.replace(/T.*/,'')).getTime();
  const isOld = ((Date.now() - joindedAt)/1000/60/60/24 > 360);
  if (isOld) {
    await roolBack(refMes.id,messageId,channelId )
    return
  }
  const fullRefMes = await lib.discord.channels['@0.3.1'].messages.retrieve({
    message_id: refMes.id,
    channel_id: channelId
  });
  const isInjured = (fullRefMes.referenced_message.author.id == context.params.event.author.id);
  if (isInjured) {
    await roolBack(refMes.id,messageId,channelId )
    return
  }
}
async function roolBack(botMes,injMes,channelId) {
  await lib.discord.channels['@0.3.1'].messages.destroy({
    message_id: botMes,
    channel_id: channelId 
  });
  await lib.discord.channels['@0.3.1'].messages.destroy({
    message_id: injMes,
    channel_id: channelId 
  });
}




//начало работы с триггерами
triggers = await lib.googlesheets.query['@0.3.0'].select({
  range: `A:H`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{}],
  limit: {
    'count': 0,
    'offset': 0
  }
});

console.log(`скачал тригерры ${new Date().getTime() - start}`);

let current = start;
index = triggers.rows.findIndex(row => {
  fields = row.fields;
  trigger = fields.trigger;
  
  //console.log(`+${new Date().getTime() - current}=${new Date().getTime() - start} (${trigger})`);
  current =  new Date().getTime();
  if (!trigger) return false;
  if (!fields.includes) {
    flags = fields.ignoreCase || "i";
    if (message.search(new RegExp(trigger, flags)) != -1) return true;
    return false;
  }
  if (fields.ignoreCase == 'TRUE') {
    trigger = trigger.toLowerCase();
    message = message.toLowerCase();
  }
  if (fields.includes == 'TRUE') {
    if (message.includes(trigger)) return true;
  } else {
    if (message == trigger) return true;
  }
})

console.log(`нашёл тригер ${new Date().getTime() - start}`);

if (index != -1) {
  /* response = await lib.googlesheets.query['@0.3.0'].select({
    range: `D:F`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{}],
    limit: {
      'count': 1,
      'offset': index
    }
  }); 
  console.log(`скачал ответ ${new Date().getTime() - start}`);*/
  const fields = triggers.rows[index].fields;
  let response = {
    channel_id: channelId,
    content: fields.content || ' ',
    message_reference: {
      message_id: messageId,
    }, // из-за этого картинка отправляется без текста сообщения
  };
  if (fields.imgUrl) {
    let fileRequest = await lib.http.request['@1.1.5']({
      method: 'GET',
      url: fields.imgUrl
    });
    response.attachments = [
      {
        file: fileRequest.body,
        filename: fields.imgUrl.match(/[^/]+$/)[0]
      }
    ];
  }
  if (fields.embed) response.embed = JSON.parse(fields.embed);
  console.log(`подготовил ответ ${new Date().getTime() - start}`);
  if (response.content || response.embed || response.file) {
    await lib.discord.channels['@0.3.1'].messages.create(response);
  }
  console.log(`отправил ответ ${new Date().getTime() - start}`);
  
  await setCount(fields.trigger, fields.count);
}

console.log(`всё ${new Date().getTime() - start}`);

async function setCount(trigger, count) {
  if (!count) count = 0;
  count++;
  
  await lib.googlesheets.query['@0.3.0'].update({
    range: `A:H`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'trigger': trigger
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    },
    fields: {
      'count': count
    }
  });
  
}