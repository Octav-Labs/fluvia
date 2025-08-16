export const factoryAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'fluviaOwner',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: 'destDomain',
        type: 'uint32',
      },
      {
        internalType: 'address',
        name: 'destRecipient',
        type: 'address',
      },
    ],
    name: 'deploy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'address',
        name: 'fluviaOwner',
        type: 'address',
      },
    ],
    name: 'computeAddressForNext',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
