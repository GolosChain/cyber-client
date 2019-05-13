export const accounts = {
  alice: {
    account_name: 'alice',
    permissions: [
      {
        perm_name: 'active',
        parent: 'owner',
        required_auth: {
          threshold: 1,
          keys: [
            {
              key: 'GLS88rE1igQtp9vu5fwNbo7mEo3Pv976C76akACAYWwNE1zEdR2JG',
              weight: 1,
            },
          ],
          accounts: [],
          waits: [],
        },
      },
      {
        perm_name: 'owner',
        parent: '',
        required_auth: {
          threshold: 1,
          keys: [
            {
              key: 'GLS7Cb1iawbNBHQkYUchYYKe1JLJevwCst8knqG7NwJASN4w3KNNr',
              weight: 1,
            },
          ],
          accounts: [],
          waits: [],
        },
      },
      {
        perm_name: 'posting',
        parent: 'active',
        required_auth: {
          threshold: 1,
          keys: [
            {
              key: 'GLS6qtGvXfhtNdrnk2QT5wFXvF5hmiVeMfVrqrPFuLbZigPVC4xVo',
              weight: 1,
            },
          ],
          accounts: [],
          waits: [],
        },
      },
    ],
  },
};
