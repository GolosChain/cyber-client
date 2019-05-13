# Cyber-Client - library for communication between CyberWay Blockchain and Golos dApp

Добавления своего ключа для формирования транзакций:

```javascript
cyber.initProvider(privateKey); // Где privateKey это ваш приватный ключ
```

```javascript
import cyber from 'cyber-client';

const key = 'MY_PRIVATE_KEY';

cyber.initProvider(key);
```

## Работа с транзакциями:

Все транзакции сгруппированны по контрактам, общий вид вызова транзакции:

cyber.**CONTRACT**.**METHOD**({ **accountName** }, **params**, **options**);

- **CONTRACT** - Имя контакта (basic, ctrl, publish, ...). Полный список можно посмотреть [тут](src/actions)
- **METHOD** - Имя метода в контракте (смотреть внутри контакта)
- **accountName** {string} - Имя аккаунта подписывающего транзакцию
- **params** {Object} - Объект параметров которые будут переданы один к одному в блокчейн
- **options** {Object} - Опции для самой библиотеки cyber-client

Список доступных опций:

- **providebw** {boolean} _(default: false)_ - создать транзакцию от своего имени но дать возможность другому лицу оплатить все накладные расходы связанные с проведением данной транзакции.
- **broadcast** {boolean} _(default: true)_ - при значении false транзакция не будет автоматически отослана в сеть. Нужно например в тех случаях когда нужно передать транзакцию в сыров виде для дальнейшей подписи другими лицами.

В дальшей документации будут описаны только структура параметров (аргумент params), так как остальные параметры везде одинаковы.

Так же в дальнейшей документации используется тип MessageId, это объект с полями:

```
@param {string} author - Username автора поста/комментария
@param {string} permlink - Permlink поста/комментария
@param {string} ref_block_num - Номер последнего созданного блока на момент создания транзакции
```

### Транзакции контракта [publish](src/actions/publish.js):

#### createmssg - Создании поста/комментария

```
@param {Object} message_id
@param {string} message_id.author - Username автора поста
@param {string} message_id.permlink - Строка в урле по которой будет доступен пост, обычно генерируется из заголовка с помощью библиотек аналогичных https://www.npmjs.com/package/speakingurl
@param {Object} parent_id - Если создается комментарий, то этот объект является ссылкой на пост или родительский комментарий
@param {string} parent_id.author - Username автора поста
@param {string} parent_id.permlink - Permlink поста
@param {string} parent_id.ref_block_num - ref block number
@param {string} headermssg - Заголовок поста
@param {string} bodymssg - Заголовок поста
@param {string} languagemssg - Язык на котором написан пост в формате en, ru, fr и тд.
@param {{ tag: string }[]} tags - Массив тэгов
@param {Array} tags[]
@param {string} jsonmetadata - JSON строка с метаданными о посте
@param {string[]} beneficiaries - Список бенефициаров
@param {number} tokenprop - ???
@param {boolean} vestpayment - ???
```

```javascript
const result = await createmssg({
  message_id: {
    author: 'my-account-name',
    permlink: 'some-link-like-string',
  },
  headermssg: 'Hello world',
  bodymssg: 'Lorem ipsum',
  beneficiaries: [],
  tokenprop: 0,
  vestpayment: true,
  languagemssg: 'ru',
  tags: [{ tag: 'test' }],
  jsonmetadata: JSON.stringify({ type: 'plain-text' }),
});
```

#### upvote - Проголосовать за пост/комментарий

```
@param {string} voter - Голосующий
@param {MessageId} message_id - Ссылка на пост/комментарий
@param {number} weight - Вес, значение может принимать значения от 1 (0.01%) до 10000 (100%)
```

```javascript
cyber.publish.upvote(
  { accountName },
  {
    voter: accountName,
    message_id: {
      author: '...',
      permlink: '...',
      ref_block_num: 123,
    },
    weight: 10000,
  }
);
```

#### downvote - Проголосовать против поста/комментария

```
@param {string} voter - Голосующий
@param {MessageId} message_id - Ссылка на пост/комментарий
@param {number} weight - Вес, значение может принимать значения от 1 (0.01%) до 10000 (100%)
```

#### unvote - Отменить голос на посте/комментарие

```
@param {string} voter - Голосующий
@param {MessageId} message_id - ссылка на пост/комментарий
```

### Транзакции контракта [social](src/actions/social.js):

#### pin - Подписаться на сообщество

```
@param {string} pinner - Кто подписывается
@param {string} pinning - Имя сообщества
```

#### unpin - Подписаться на сообщество

```
@param {string} pinner - Кто подписывается
@param {string} pinning - Имя сообщества
```

#### block - Заблокировать пользователя

```
@param {string} blocker - Кто блокирует
@param {string} blocking - Кого блокируют
```

#### unblock - Разблокировать пользователя

```
@param {string} blocker - Кто блокирует
@param {string} blocking - Кого блокируют
```

#### updatemeta - Обновить данные профиля

```
@param {string} account - Username
@param {Object} meta
@param {string} meta.bio - О себе
@param {string} meta.facebook - Facebook аккаунт
@param {string} meta.wechat - WeChat аккаунт
@param {string} meta.telegram - Telegram аккаунт
... Это неполный список. Список всё ещё обновляется в текущее время.
```

```javascript
await cyber.social.updatemeta({ accountName }, {
  account: accountName,
  meta: {
    facebook: 'my-facebook-account',
    ...
  },
})
```
