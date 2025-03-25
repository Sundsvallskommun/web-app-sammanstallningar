export const flows = {
  data: [
    {
      id: 'flow1',
      version: 1,
      name: 'Flow 1',
      description: 'Ett Intric AI-flöde för sammanställning av dokumenttyp 1.',
    },
    {
      id: 'flow2',
      version: 1,
      name: 'Flow 2',
      description: 'Ett Intric AI-flöde för sammanställning av dokumenttyp 2.',
    },
    {
      id: 'flow3',
      version: 1,
      name: 'Flow 3',
      description: 'Ett Intric AI-flöde för sammanställning av dokumenttyp 3.',
    },
    {
      id: 'flow4',
      version: 1,
      name: 'Flow 4',
      description: 'Ett Intric AI-flöde för sammanställning av dokumenttyp 4.',
    },
    {
      id: 'flow5',
      version: 1,
      name: 'Flow 5',
      description: 'Ett Intric AI-flöde för sammanställning av dokumenttyp 5.',
    },
    {
      id: 'flow6',
      version: 1,
      name: 'Flow 6',
      description: 'Ett Intric AI-flöde för sammanställning av dokumenttyp 6.',
    },
  ],
  message: 'success',
};

export const flow = {
  data: {
    id: 'flow1',
    version: 1,
    name: 'Flow 1',
    description: 'Ett Intric AI-flöde för sammanställning av dokumenttyp 1.',
    inputPrefix: '#####',
    defaultTemplateId: 'ai-mvp.flow1',
    input: [
      {
        id: 'arendenummer',
        name: 'Ärendenummer',
        description: 'Fyll i ärendenummer',
        type: 'STRING',
        optional: true,
        multipleValued: false,
        passthrough: true,
      },
      {
        id: 'uppdrag',
        name: 'Uppdrag',
        description: 'Fyll i efterfrågad information',
        type: 'TEXT',
        optional: false,
        multipleValued: false,
        passthrough: false,
      },
      {
        id: 'bakgrundsmaterial',
        name: 'Bakgrundsmaterial',
        description: 'Detta fält är obligatoriskt',
        type: 'FILE',
        optional: false,
        multipleValued: true,
        passthrough: false,
      },
    ],
    steps: [
      {
        id: 'step1',
        order: 1,
        name: 'Steg 1',
        intricEndpoint: {
          type: 'SERVICE',
          id: '9dda859f-aaaa-aaaa-aaaa-cdcb1c8b3d85',
        },
        input: [
          {
            'flow-input-ref': 'step2',
          },
        ],
      },
      {
        id: 'step2',
        order: 2,
        name: 'Steg 2',
        intricEndpoint: {
          type: 'SERVICE',
          id: '127dd187-aaaa-aaaa-aaaa-f413de22963f',
        },
        input: [
          {
            'flow-input-ref': 'step3',
          },
        ],
      },
      {
        id: 'step3',
        order: 3,
        name: 'Steg 3',
        intricEndpoint: {
          type: 'SERVICE',
          id: '714e598a-aaaa-aaaa-aaaa-1b8c9e3897a3',
        },
        input: [
          {
            'flow-input-ref': 'step1',
          },
        ],
      },
    ],
  },
  message: 'success',
};
